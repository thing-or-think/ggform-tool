import { jest } from "@jest/globals";

jest.unstable_mockModule("axios", () => ({
    default: {
        get: jest.fn()
    }
}));

jest.unstable_mockModule("../../../../../src/modules/forms/repositories/form.repository.js", () => ({
    formRepository: {
        upsertByUrl: jest.fn()
    }
}));

jest.unstable_mockModule("../../../../../src/modules/forms/repositories/form-field.repository.js", () => ({
    formFieldRepository: {
        findByFormId: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    }
}));

const axios = (await import("axios")).default;

const { formScannerService } = await import(
    "../../../../../src/modules/forms/services/form-scanner.service.js"
);

const { formRepository } = await import(
    "../../../../../src/modules/forms/repositories/form.repository.js"
);

const { formFieldRepository } = await import(
    "../../../../../src/modules/forms/repositories/form-field.repository.js"
);

describe("formScannerService.scan", () => {
    const validUrl = "https://docs.google.com/forms/d/e/FORM_ID/viewform";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    function buildHtml(rawData) {
        return `
            <html>
                <script>
                    FB_PUBLIC_LOAD_DATA_ = ${JSON.stringify(rawData)};
                </script>
            </html>
        `;
    }

    function buildRawData(overrides = {}) {
        return [
            null,
            [
                overrides.description ?? "Form description",
                overrides.items ?? [
                    [
                        111,
                        "Your name",
                        null,
                        0,
                        [[123456, null, true]]
                    ],
                    [
                        222,
                        "Choose language",
                        null,
                        2,
                        [
                            [
                                789000,
                                [
                                    ["C++"],
                                    ["JavaScript"]
                                ],
                                false
                            ]
                        ]
                    ],
                    [
                        333,
                        "Page break",
                        null,
                        8,
                        null
                    ]
                ]
            ],
            null,
            overrides.title ?? "Test Form"
        ];
    }

    function mockSuccessfulFetch(rawData = buildRawData()) {
        axios.get.mockResolvedValue({
            data: buildHtml(rawData)
        });
    }

    function mockUpsertForm(form = {}) {
        formRepository.upsertByUrl.mockResolvedValue({
            id: "form-id",
            title: "Test Form",
            ...form
        });
    }

    test("throws error when formUrl is missing", async () => {
        await expect(formScannerService.scan()).rejects.toThrow(
            "Form URL is required"
        );

        expect(axios.get).not.toHaveBeenCalled();
        expect(formRepository.upsertByUrl).not.toHaveBeenCalled();
        expect(formFieldRepository.findByFormId).not.toHaveBeenCalled();
    });

    test("throws error when Google Form URL is invalid", async () => {
        await expect(
            formScannerService.scan("https://example.com/form")
        ).rejects.toThrow("Invalid Google Form URL");

        expect(axios.get).not.toHaveBeenCalled();
        expect(formRepository.upsertByUrl).not.toHaveBeenCalled();
        expect(formFieldRepository.findByFormId).not.toHaveBeenCalled();
    });

    test("scans Google Form and creates new fields", async () => {
        mockSuccessfulFetch();
        mockUpsertForm();

        formFieldRepository.findByFormId.mockResolvedValue([]);

        const result = await formScannerService.scan(validUrl);

        expect(axios.get).toHaveBeenCalledWith(validUrl);

        expect(formRepository.upsertByUrl).toHaveBeenCalledWith({
            title: "Test Form",
            description: "Form description",
            formUrl: validUrl,
            provider: "GOOGLE_FORM",
            providerFormId: "FORM_ID",
            status: "ACTIVE",
            scanError: null
        });

        expect(formFieldRepository.findByFormId).toHaveBeenCalledWith("form-id");

        expect(formFieldRepository.create).toHaveBeenCalledTimes(2);
        expect(formFieldRepository.update).not.toHaveBeenCalled();

        expect(formFieldRepository.create).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
                formId: "form-id",
                entryId: "123456",
                label: "Your name",
                type: "TEXT",
                required: true,
                options: null,
                sortOrder: 0
            })
        );

        expect(formFieldRepository.create).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({
                formId: "form-id",
                entryId: "789000",
                label: "Choose language",
                type: "RADIO",
                required: false,
                options: [
                    { value: "C++" },
                    { value: "JavaScript" }
                ],
                sortOrder: 1
            })
        );

        expect(result).toEqual({
            form: {
                id: "form-id",
                title: "Test Form",
                fields: expect.any(Array)
            }
        });

        expect(result.form.fields).toHaveLength(2);
    });

    test("ignores page break items because they are not input fields", async () => {
        mockSuccessfulFetch();
        mockUpsertForm();

        formFieldRepository.findByFormId.mockResolvedValue([]);

        await formScannerService.scan(validUrl);

        expect(formFieldRepository.create).not.toHaveBeenCalledWith(
            expect.objectContaining({
                label: "Page break"
            })
        );

        expect(formFieldRepository.create).toHaveBeenCalledTimes(2);
    });

    test("updates existing field when entryId already exists", async () => {
        mockSuccessfulFetch();
        mockUpsertForm();

        formFieldRepository.findByFormId.mockResolvedValue([
            {
                id: "field-id-1",
                entryId: "123456",
                raw: {}
            }
        ]);

        await formScannerService.scan(validUrl);

        expect(formFieldRepository.update).toHaveBeenCalledWith(
            "field-id-1",
            expect.objectContaining({
                entryId: "123456",
                label: "Your name",
                type: "TEXT",
                required: true,
                sortOrder: 0
            })
        );

        expect(formFieldRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({
                formId: "form-id",
                entryId: "789000",
                label: "Choose language"
            })
        );
    });

    test("marks removed current fields as inactive", async () => {
        mockSuccessfulFetch();
        mockUpsertForm();

        formFieldRepository.findByFormId.mockResolvedValue([
            {
                id: "old-field-id",
                entryId: "old-entry-id",
                raw: {
                    old: true
                }
            }
        ]);

        await formScannerService.scan(validUrl);

        expect(formFieldRepository.update).toHaveBeenCalledWith(
            "old-field-id",
            {
                required: false,
                raw: {
                    old: true,
                    inactive: true
                }
            }
        );
    });

    test("keeps old raw data when marking removed field as inactive", async () => {
        mockSuccessfulFetch();
        mockUpsertForm();

        formFieldRepository.findByFormId.mockResolvedValue([
            {
                id: "old-field-id",
                entryId: "deleted-entry",
                raw: {
                    typeCode: 0,
                    label: "Old question"
                }
            }
        ]);

        await formScannerService.scan(validUrl);

        expect(formFieldRepository.update).toHaveBeenCalledWith(
            "old-field-id",
            expect.objectContaining({
                required: false,
                raw: {
                    typeCode: 0,
                    label: "Old question",
                    inactive: true
                }
            })
        );
    });

    test("does not mark existing active field as inactive", async () => {
        mockSuccessfulFetch();
        mockUpsertForm();

        formFieldRepository.findByFormId.mockResolvedValue([
            {
                id: "field-id-1",
                entryId: "123456",
                raw: {}
            },
            {
                id: "field-id-2",
                entryId: "789000",
                raw: {}
            }
        ]);

        await formScannerService.scan(validUrl);

        expect(formFieldRepository.update).not.toHaveBeenCalledWith(
            "field-id-1",
            expect.objectContaining({
                raw: expect.objectContaining({
                    inactive: true
                })
            })
        );

        expect(formFieldRepository.update).not.toHaveBeenCalledWith(
            "field-id-2",
            expect.objectContaining({
                raw: expect.objectContaining({
                    inactive: true
                })
            })
        );
    });

    test("uses default title and description when raw data is missing them", async () => {
        const rawData = [
            null,
            [
                null,
                [
                    [
                        111,
                        "Your name",
                        null,
                        0,
                        [[123456, null, true]]
                    ]
                ],
                null,
                null,
                null,
                null,
                null,
                null,
                null
            ]
        ];

        mockSuccessfulFetch(rawData);
        mockUpsertForm();

        formFieldRepository.findByFormId.mockResolvedValue([]);

        await formScannerService.scan(validUrl);

        expect(formRepository.upsertByUrl).toHaveBeenCalledWith(
            expect.objectContaining({
                title: "Untitled",
                description: ""
            })
        );
    });

    test("sets unknown field type when Google field type is not mapped", async () => {
        const rawData = buildRawData({
            items: [
                [
                    999,
                    "Unknown question",
                    null,
                    999,
                    [[555555, null, false]]
                ]
            ]
        });

        mockSuccessfulFetch(rawData);
        mockUpsertForm();

        formFieldRepository.findByFormId.mockResolvedValue([]);

        await formScannerService.scan(validUrl);

        expect(formFieldRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({
                entryId: "555555",
                label: "Unknown question",
                type: "UNKNOWN"
            })
        );
    });

    test("sets form status ERROR when cannot extract raw data", async () => {
        axios.get.mockResolvedValue({
            data: "<html>No FB_PUBLIC_LOAD_DATA here</html>"
        });

        mockUpsertForm({
            id: "error-form-id"
        });

        await expect(
            formScannerService.scan(validUrl)
        ).rejects.toThrow("Cannot extract Google Form data");

        expect(formRepository.upsertByUrl).toHaveBeenCalledWith({
            title: "Untitled",
            description: "",
            formUrl: validUrl,
            provider: "GOOGLE_FORM",
            providerFormId: "FORM_ID",
            status: "ERROR",
            scanError: "Cannot extract Google Form data"
        });

        expect(formFieldRepository.findByFormId).not.toHaveBeenCalled();
        expect(formFieldRepository.create).not.toHaveBeenCalled();
        expect(formFieldRepository.update).not.toHaveBeenCalled();
    });

    test("sets form status ERROR when axios throws error", async () => {
        axios.get.mockRejectedValue(new Error("Network error"));

        mockUpsertForm({
            id: "error-form-id"
        });

        await expect(
            formScannerService.scan(validUrl)
        ).rejects.toThrow("Network error");

        expect(formRepository.upsertByUrl).toHaveBeenCalledWith({
            title: "Untitled",
            description: "",
            formUrl: validUrl,
            provider: "GOOGLE_FORM",
            providerFormId: "FORM_ID",
            status: "ERROR",
            scanError: "Network error"
        });

        expect(formFieldRepository.findByFormId).not.toHaveBeenCalled();
    });
});