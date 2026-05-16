import prisma from '../../config/prisma.js'

export const formRepository = {
    create(data) {
        return prisma.form.create({
            data
        })
    },

    findById(id) {
        return prisma.form.findUnique({
            where: { id }
        })
    },

    findByUrl(formUrl) {
        return prisma.form.findUnique({
            where: { formUrl }
        })
    },

    upsertByUrl(data) {
        return prisma.form.upsert({
            where: {
                formUrl: data.formUrl
            },
            update: {
                title: data.title,
                fields: data.fields,
                provider: data.provider
            },
            create: data
        })
    },

    findMany() {
        return prisma.form.findMany({
            orderBy: {
                createAt: 'desc'
            }
        })
    }
}