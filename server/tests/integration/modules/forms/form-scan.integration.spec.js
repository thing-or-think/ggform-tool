import { jest } from "@jest/globals";

jest.unstable_mockModule("axios", () => ({
    default: {
        get: jest.fn()
    }
}));

const axios = (await import("axios")).default;

const prismaModule = await import("server/src/config/prisma.js");
const prisma = prismaModule.default;

const { formScannerService } = await import(
    "server/src/modules/forms/services/form-scanner.service.js"
);

describe("formScannerService integration", () => {
    const validUrl = "https://docs.google.com/forms/d/e/FORM_ID/viewform";

    function buildGoogleFormHtml() {
        const rawData = [
            null,
            [
                "Form description",
                [
                    [
                        111,
                        "Tên của bạn",
                        null,
                        0,
                        [
                            [
                                123456,
                                null,
                                true
                            ]
                        ]
                    ],
                    [
                        222,
                        "Bạn thích ngôn ngữ nào?",
                        null,
                        2,
                        [
                            [
                                999999,
                                [
                                    ["C++"],
                                    ["JavaScript"],
                                    ["Python"]
                                ],
                                false
                            ]
                        ]
                    ]
                ]
            ],
            null,
            "Test Form"
        ];

        return `
        <html>
            <script>
                var FB_PUBLIC_LOAD_DATA_ = ${JSON.stringify(rawData)};
            </script>
        </html>
    `;
    }

    it("scans Google Form and saves form with fields", async () => {
        axios.get.mockResolvedValue({
            data: buildGoogleFormHtml()
        });

        const result = await formScannerService.scan(validUrl);

        expect(result.form.id).toBeDefined();
        expect(result.form.title).toBe("Test Form");
        expect(result.form.description).toBe("Form description");
        expect(result.form.formUrl).toBe(validUrl);
        expect(result.form.providerFormId).toBe("FORM_ID");
        expect(result.form.status).toBe("ACTIVE");
        expect(result.form.scanError).toBeNull();

        expect(result.form.fields).toHaveLength(2);

        const fields = await prisma.formField.findMany({
            where: {
                formId: result.form.id
            },
            orderBy: {
                sortOrder: "asc"
            }
        });

        expect(fields).toHaveLength(2);

        expect(fields[0]).toMatchObject({
            entryId: "123456",
            label: "Tên của bạn",
            type: "TEXT",
            required: true,
            sortOrder: 0
        });

        expect(fields[1]).toMatchObject({
            entryId: "999999",
            label: "Bạn thích ngôn ngữ nào?",
            type: "RADIO",
            required: false,
            sortOrder: 1
        });

        expect(fields[1].options).toEqual([
            { value: "C++" },
            { value: "JavaScript" },
            { value: "Python" }
        ]);
    });

    it("updates existing form when scanning same URL again", async () => {
        axios.get.mockResolvedValue({
            data: buildGoogleFormHtml()
        });

        const firstResult = await formScannerService.scan(validUrl);
        const secondResult = await formScannerService.scan(validUrl);

        expect(secondResult.form.id).toBe(firstResult.form.id);

        const forms = await prisma.form.findMany({
            where: {
                formUrl: validUrl
            }
        });

        expect(forms).toHaveLength(1);
    });

    it("throws error when formUrl is missing", async () => {
        await expect(formScannerService.scan())
            .rejects
            .toThrow("Form URL is required");
    });

    it("throws error when Google Form URL is invalid", async () => {
        await expect(formScannerService.scan("https://example.com"))
            .rejects
            .toThrow("Invalid Google Form URL");
    });

    it("saves form with ERROR status when raw data cannot be extracted", async () => {
        axios.get.mockResolvedValue({
            data: "<html>No Google Form data</html>"
        });

        await expect(formScannerService.scan(validUrl))
            .rejects
            .toThrow("Cannot extract Google Form data");

        const form = await prisma.form.findUnique({
            where: {
                formUrl: validUrl
            }
        });

        expect(form).toBeDefined();
        expect(form.status).toBe("ERROR");
        expect(form.scanError).toBe("Cannot extract Google Form data");
    });

    it("saves raw field data in database but does not return raw in response", async () => {
        axios.get.mockResolvedValue({
            data: buildGoogleFormHtml()
        });

        const result = await formScannerService.scan(validUrl);

        const fields = await prisma.formField.findMany({
            where: {
                formId: result.form.id
            },
            orderBy: {
                sortOrder: "asc"
            }
        });

        expect(fields).toHaveLength(2);

        expect(fields[0].raw).toBeDefined();
        expect(fields[0].raw).not.toBeNull();

        expect(fields[1].raw).toBeDefined();
        expect(fields[1].raw).not.toBeNull();

        expect(result.form.fields).toHaveLength(2);

        expect(result.form.fields[0]).not.toHaveProperty("raw");
        expect(result.form.fields[1]).not.toHaveProperty("raw");
    });
});