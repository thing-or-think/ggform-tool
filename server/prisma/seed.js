import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const form = await prisma.form.upsert({
        where: {
            formUrl: 'https://docs.google.com/forms/d/test'
        },
        update: {},
        create: {
            formUrl: 'https://docs.google.com/forms/d/test',
            title: 'Test Google Form',
            provider: 'GOOGLE_FORM',
            fields: [
                {
                    label: 'Name',
                    type: 'text',
                    entryId: 'entry.123'
                }
            ]
        }
    })

    await prisma.submissionJob.create({
        data: {
            formId: form.id,
            totalRecords: 10,
            status: 'QUEUED'
        }
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (error) => {
        console.error(error)
        await prisma.$disconnect()
        process.exit(1)
    })