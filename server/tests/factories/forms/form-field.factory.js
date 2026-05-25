import { FORM_FIELD_TYPES } from "../../../src/modules/forms/constants";
import { createForm } from "./form.factory";

function uniqueValue(prefix) {
    return `${prefix}-${Date.now()}-${Math.random()}`;
}

export function buildFormFieldData(overrides = {}) {
    return {
        formId: overrides.formId,
        entryId: uniqueValue("entry"),
        label: "Email",
        type: FORM_FIELD_TYPES.TEXT,
        required: true,
        options: null,
        sortOrder: 1,
        raw: null,
        ...overrides
    };
}

export async function createFormField(prisma, overrides = {}) {
    let formId = overrides.formId;

    if (!formId) {
        const form = await createForm(prisma);
        formId = form.id;
    }

    return prisma.formField.create({
        data: buildFormFieldData({
            ...overrides,
            formId
        })
    });
}