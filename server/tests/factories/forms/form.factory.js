import {
    FORM_PROVIDER,
    FORM_STATUS
} from "../../../src/modules/forms/constants";

function uniqueValue(prefix) {
    return `${prefix}-${Date.now()}-${Math.random()}`;
}

export function buildFormData(overrides = {}) {
    return {
        title: "Test Form",
        description: "Test Description",
        formUrl: `https://forms.google.com/${uniqueValue("form")}`,
        provider: FORM_PROVIDER.GOOGLE_FORM,
        providerFormId: uniqueValue("provider-form"),
        status: FORM_STATUS.ACTIVE,
        scanError: null,
        ...overrides
    };
}

export async function createForm(prisma, overrides = {}) {
    return prisma.form.create({
        data: buildFormData(overrides)
    });
}