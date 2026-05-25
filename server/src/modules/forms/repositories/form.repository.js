import prisma from "../../../config/prisma.js";
import {
    FORM_UPDATE_FIELDS,
    FORM_DEFAULT_STATUS
} from "../constants/form.constants.js";
import { pickFields } from "../../../shared/utils/pick-fields.js";

export const formRepository = {
    create(data) {
        return prisma.form.create({
            data: {
                ...data,
                status: data.status ?? FORM_DEFAULT_STATUS
            }
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

    findMany() {
        return prisma.form.findMany({
            where: {
                deletedAt: null
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    },

    update(id, data) {
        const allowedData = pickFields(
            data,
            FORM_UPDATE_FIELDS
        );

        return prisma.form.update({
            where: { id },
            data: allowedData
        })
    },

    softDelete(id) {
        return prisma.form.update({
            where: {
                id,
                deletedAt: null
            },
            data: {
                deletedAt: new Date()
            }
        })
    },

    upsertByUrl(data) {
        const updateData = pickFields(
            data,
            FORM_UPDATE_FIELDS
        );

        return prisma.form.upsert({
            where: {
                formUrl: data.formUrl
            },
            update: updateData,
            create: {
                ...data,
                status: data.status ?? FORM_DEFAULT_STATUS
            }
        })
    }
}