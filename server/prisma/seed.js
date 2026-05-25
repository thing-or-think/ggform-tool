import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Start seeding...");

    await prisma.jobLog.deleteMany();
    await prisma.submissionResult.deleteMany();
    await prisma.submissionAnswer.deleteMany();
    await prisma.submissionRecord.deleteMany();
    await prisma.submissionJob.deleteMany();
    await prisma.submissionBatch.deleteMany();
    await prisma.formField.deleteMany();
    await prisma.form.deleteMany();

    const form = await prisma.form.create({
        data: {
            title: "Student Feedback Form",
            description: "Sample Google Form for testing submission flow",
            formUrl: "https://docs.google.com/forms/d/e/sample-form-id/viewform",
            provider: "GOOGLE_FORM",
            providerFormId: "sample-form-id",
            status: "ACTIVE",

            fields: {
                create: [
                    {
                        entryId: "entry.111111",
                        label: "Full name",
                        type: "TEXT",
                        required: true,
                        sortOrder: 1,
                        raw: {
                            questionId: "111111",
                            type: "short_answer",
                        },
                    },
                    {
                        entryId: "entry.222222",
                        label: "Email",
                        type: "TEXT",
                        required: true,
                        sortOrder: 2,
                        raw: {
                            questionId: "222222",
                            type: "short_answer",
                        },
                    },
                    {
                        entryId: "entry.333333",
                        label: "Rating",
                        type: "RADIO",
                        required: true,
                        options: ["Good", "Average", "Bad"],
                        sortOrder: 3,
                        raw: {
                            questionId: "333333",
                            type: "radio",
                        },
                    },
                    {
                        entryId: "entry.444444",
                        label: "Comment",
                        type: "TEXTAREA",
                        required: false,
                        sortOrder: 4,
                        raw: {
                            questionId: "444444",
                            type: "paragraph",
                        },
                    },
                ],
            },
        },
        include: {
            fields: true,
        },
    });

    const batch = await prisma.submissionBatch.create({
        data: {
            formId: form.id,
            name: "Sample Batch 001",
            sourceType: "MANUAL",
            totalRecords: 3,
            validRecords: 2,
            invalidRecords: 1,
            status: "READY",
            validationErrors: [
                {
                    rowIndex: 3,
                    errors: ["Email is required"],
                },
            ],
        },
    });

    const fieldMap = Object.fromEntries(
        form.fields.map((field) => [field.entryId, field])
    );

    const record1 = await prisma.submissionRecord.create({
        data: {
            batchId: batch.id,
            rowIndex: 1,
            isValid: true,
            answers: {
                create: [
                    {
                        fieldId: fieldMap["entry.111111"].id,
                        entryId: "entry.111111",
                        value: "Nguyen Van A",
                    },
                    {
                        fieldId: fieldMap["entry.222222"].id,
                        entryId: "entry.222222",
                        value: "vana@example.com",
                    },
                    {
                        fieldId: fieldMap["entry.333333"].id,
                        entryId: "entry.333333",
                        value: "Good",
                    },
                    {
                        fieldId: fieldMap["entry.444444"].id,
                        entryId: "entry.444444",
                        value: "Very useful form",
                    },
                ],
            },
        },
    });

    const record2 = await prisma.submissionRecord.create({
        data: {
            batchId: batch.id,
            rowIndex: 2,
            isValid: true,
            answers: {
                create: [
                    {
                        fieldId: fieldMap["entry.111111"].id,
                        entryId: "entry.111111",
                        value: "Tran Thi B",
                    },
                    {
                        fieldId: fieldMap["entry.222222"].id,
                        entryId: "entry.222222",
                        value: "thib@example.com",
                    },
                    {
                        fieldId: fieldMap["entry.333333"].id,
                        entryId: "entry.333333",
                        value: "Average",
                    },
                ],
            },
        },
    });

    const record3 = await prisma.submissionRecord.create({
        data: {
            batchId: batch.id,
            rowIndex: 3,
            isValid: false,
            validationErrors: ["Email is required"],
            answers: {
                create: [
                    {
                        fieldId: fieldMap["entry.111111"].id,
                        entryId: "entry.111111",
                        value: "Le Van C",
                    },
                    {
                        fieldId: fieldMap["entry.222222"].id,
                        entryId: "entry.222222",
                        value: null,
                    },
                    {
                        fieldId: fieldMap["entry.333333"].id,
                        entryId: "entry.333333",
                        value: "Bad",
                    },
                ],
            },
        },
    });

    const job = await prisma.submissionJob.create({
        data: {
            formId: form.id,
            batchId: batch.id,
            status: "COMPLETED",
            totalRecords: 3,
            processedCount: 3,
            successCount: 2,
            failedCount: 1,
            retryCount: 0,
            options: {
                delayMs: 1000,
                maxRetries: 3,
            },
            startedAt: new Date(),
            finishedAt: new Date(),
        },
    });

    await prisma.submissionResult.createMany({
        data: [
            {
                jobId: job.id,
                recordId: record1.id,
                recordIndex: 1,
                status: "SUCCESS",
                attemptCount: 1,
                submittedPayload: {
                    "entry.111111": "Nguyen Van A",
                    "entry.222222": "vana@example.com",
                    "entry.333333": "Good",
                    "entry.444444": "Very useful form",
                },
                providerResponse: {
                    statusCode: 200,
                    message: "Submitted successfully",
                },
            },
            {
                jobId: job.id,
                recordId: record2.id,
                recordIndex: 2,
                status: "SUCCESS",
                attemptCount: 1,
                submittedPayload: {
                    "entry.111111": "Tran Thi B",
                    "entry.222222": "thib@example.com",
                    "entry.333333": "Average",
                },
                providerResponse: {
                    statusCode: 200,
                    message: "Submitted successfully",
                },
            },
            {
                jobId: job.id,
                recordId: record3.id,
                recordIndex: 3,
                status: "SKIPPED",
                attemptCount: 0,
                errorCode: "VALIDATION_ERROR",
                errorMessage: "Record is invalid",
            },
        ],
    });

    await prisma.jobLog.createMany({
        data: [
            {
                jobId: job.id,
                level: "INFO",
                message: "Submission job created",
                context: {
                    batchId: batch.id,
                },
            },
            {
                jobId: job.id,
                level: "INFO",
                message: "Submission job completed",
                context: {
                    totalRecords: 3,
                    successCount: 2,
                    failedCount: 1,
                },
            },
            {
                jobId: job.id,
                level: "WARN",
                message: "Record skipped because validation failed",
                context: {
                    recordId: record3.id,
                    rowIndex: 3,
                },
            },
        ],
    });

    console.log("Seeding completed.");
}

main()
    .catch((error) => {
        console.error("Seeding failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });