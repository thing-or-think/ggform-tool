import axios from "axios";

import { formRepository } from "../repositories/form.repository.js";
import { formFieldRepository } from "../repositories/form-field.repository.js";
import { formFieldMapper } from "../mappers/form-field.mapper.js";
import { formMapper } from "../mappers/form.mapper.js";

import {
    FORM_PROVIDER,
    FORM_STATUS
} from "../constants/form.constants.js";

import {
    FORM_FIELD_TYPES
} from "../constants/form-field.constants.js";

const GOOGLE_FORM_FIELD_TYPE_MAP = {
    0: FORM_FIELD_TYPES.TEXT,
    1: FORM_FIELD_TYPES.TEXTAREA,
    2: FORM_FIELD_TYPES.RADIO,
    3: FORM_FIELD_TYPES.SELECT,
    4: FORM_FIELD_TYPES.CHECKBOX,
    7: FORM_FIELD_TYPES.LINEAR_SCALE,
    9: FORM_FIELD_TYPES.DATE,
    10: FORM_FIELD_TYPES.TIME,
    13: FORM_FIELD_TYPES.FILE_UPLOAD
};

function extractProviderFormId(formUrl) {
    const match = formUrl.match(/\/d\/e\/([^/]+)/);

    return match?.[1] ?? null;
}

function extractGoogleFormRawData(html) {
    const match = html.match(
        /FB_PUBLIC_LOAD_DATA_\s*=\s*(\[.*?\]);/s
    );

    if (!match) {
        throw new Error("Cannot extract Google Form data");
    }

    return JSON.parse(match[1]);
}

function mapGoogleFieldType(typeCode) {
    return (
        GOOGLE_FORM_FIELD_TYPE_MAP[typeCode] ??
        FORM_FIELD_TYPES.UNKNOWN
    );
}

function parseOptions(item) {
    const options = item?.[4]?.[0]?.[1];

    if (!Array.isArray(options)) {
        return null;
    }

    return options.map(option => ({
        value: option?.[0]
    })).filter(option => option.value);
}

function parseGoogleForm(rawData) {
    const title = rawData?.[3] ?? "Untitled";
    const description = rawData?.[1]?.[0] ?? "";
    const items = rawData?.[1]?.[1] ?? [];

    const fields = items
        .map((item, index) => {
            const typeCode = item?.[3];
            const entryId = item?.[4]?.[0]?.[0];

            if (!entryId) {
                return null;
            }

            return {
                entryId: String(entryId),
                label: item?.[1] ?? "",
                type: mapGoogleFieldType(typeCode),
                required: Boolean(item?.[4]?.[0]?.[2]),
                options: parseOptions(item),
                sortOrder: index,
                raw: item
            };
        })
        .filter(Boolean);

    return {
        title,
        description,
        fields
    };
}

async function fetchGoogleForm(formUrl) {
    const response = await axios.get(formUrl);

    return response.data;
}

async function syncFormFields(formId, scannedFields) {
    const currentFields = await formFieldRepository.findByFormId(formId);

    const currentFieldMap = new Map(
        currentFields.map(field => [field.entryId, field])
    );

    const scannedEntryIds = new Set(
        scannedFields.map(field => field.entryId)
    );

    for (const scannedField of scannedFields) {
        const existingField = currentFieldMap.get(scannedField.entryId);

        if (existingField) {
            await formFieldRepository.update(existingField.id, scannedField);
        } else {
            await formFieldRepository.create({
                ...scannedField,
                formId
            });
        }
    }

    for (const currentField of currentFields) {
        if (!scannedEntryIds.has(currentField.entryId)) {
            await formFieldRepository.update(currentField.id, {
                required: false,
                raw: {
                    ...currentField.raw,
                    inactive: true
                }
            });
        }
    }
}

export const formScannerService = {
    async scan(formUrl) {
        if (!formUrl) {
            throw new Error("Form URL is required");
        }

        const providerFormId = extractProviderFormId(formUrl);

        if (!providerFormId) {
            throw new Error("Invalid Google Form URL");
        }

        try {
            const html = await fetchGoogleForm(formUrl);
            const rawData = extractGoogleFormRawData(html);
            const parsedForm = parseGoogleForm(rawData);

            const form = await formRepository.upsertByUrl({
                title: parsedForm.title,
                description: parsedForm.description,
                formUrl,
                provider: FORM_PROVIDER.GOOGLE_FORM,
                providerFormId,
                status: FORM_STATUS.ACTIVE,
                scanError: null
            });

            await syncFormFields(
                form.id,
                parsedForm.fields
            );

            const fields = parsedForm.fields.map(field =>
                formFieldMapper.toResponse(field)
            );

            return {
                form: {
                    ...formMapper.toResponse(form),
                    fields
                }

            };
        } catch (error) {
            await formRepository.upsertByUrl({
                title: "Untitled",
                description: "",
                formUrl,
                provider: FORM_PROVIDER.GOOGLE_FORM,
                providerFormId,
                status: FORM_STATUS.ERROR,
                scanError: error.message
            });

            throw error;
        }
    }
};