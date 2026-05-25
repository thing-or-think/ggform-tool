import prisma from "../../../config/prisma.js";
import {
    FORM_FIELD_UPDATE_FIELDS,
    FORM_FIELD_DEFAULT_TYPE
} from "../constants/form-field.constants.js"
import { pickFields } from "../../../shared/utils/pick-fields.js";

export const formFieldRepository = {
    create(data) {
        return prisma.formField.create({
            data: {
                ...pickFields(
                    {
                        ...data,
                        type: data.type ?? FORM_FIELD_DEFAULT_TYPE
                    },
                    FORM_FIELD_UPDATE_FIELDS
                ),
                formId: data.formId
            }
        });
    },

    createMany(data) {
        const allowedData = data.map(item => ({
            ...pickFields(
                {
                    ...item,
                    type: item.type ?? FORM_FIELD_DEFAULT_TYPE
                },
                FORM_FIELD_UPDATE_FIELDS
            ),
            formId: item.formId
        }));

        return prisma.formField.createMany({
            data: allowedData
        });
    },

    findById(id) {
        return prisma.formField.findUnique({
            where: { id }
        });
    },

    findByFormId(formId) {
        return prisma.formField.findMany({
            where: { formId },
            orderBy: {
                sortOrder: "asc"
            }
        });
    },

    findByEntryId(formId, entryId) {
        return prisma.formField.findFirst({
            where: {
                formId,
                entryId
            }
        });
    },

    update(id, data) {
        const allowedData = pickFields(
            data,
            FORM_FIELD_UPDATE_FIELDS
        );

        return prisma.formField.update({
            where: { id },
            data: allowedData
        });
    },

    delete(id) {
        return prisma.formField.delete({
            where: { id }
        });
    },

    deleteByFormId(formId) {
        return prisma.formField.deleteMany({
            where: { formId }
        });
    }
};