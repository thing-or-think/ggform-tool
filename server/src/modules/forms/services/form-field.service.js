import { formFieldRepository } from "../repositories/form-field.repository.js";
import { formFieldValidator } from "../validators/form-field.validator.js";
import { formFieldMapper } from "../mappers/form-field.mapper.js";

export const formFieldService = {
    async create(data) {
        formFieldValidator.validateCreate(data);

        const createdField = await formFieldRepository.create(
            formFieldMapper.toCreateData(data)
        );

        return formFieldMapper.toResponse(createdField);
    },

    async createMany(fields) {
        if (!Array.isArray(fields)) {
            throw new Error("Form fields must be an array");
        }

        fields.forEach(field => {
            formFieldValidator.validateCreate(field);
        });

        const createData = fields.map(field =>
            formFieldMapper.toCreateData(field)
        );

        return formFieldRepository.createMany(createData);
    },

    async findById(id) {
        if (!id) {
            throw new Error("Form field id is required");
        }

        const field = await formFieldRepository.findById(id);

        if (!field) {
            throw new Error("Form field not found");
        }

        return formFieldMapper.toResponse(field);
    },

    async findByFormId(formId) {
        if (!formId) {
            throw new Error("Form id is required");
        }

        const fields = await formFieldRepository.findByFormId(formId);

        return fields.map(field =>
            formFieldMapper.toResponse(field)
        );
    },

    async findByEntryId(formId, entryId) {
        if (!formId) {
            throw new Error("Form id is required");
        }

        if (!entryId) {
            throw new Error("Entry id is required");
        }

        const field = await formFieldRepository.findByEntryId(
            formId,
            entryId
        );

        return formFieldMapper.toResponse(field);
    },

    async update(id, data) {
        if (!id) {
            throw new Error("Form field id is required");
        }

        formFieldValidator.validateUpdate(data);

        const updatedField = await formFieldRepository.update(
            id,
            formFieldMapper.toUpdateData(data)
        );

        return formFieldMapper.toResponse(updatedField);
    },

    async delete(id) {
        if (!id) {
            throw new Error("Form field id is required");
        }

        return formFieldRepository.delete(id);
    },

    async deleteByFormId(formId) {
        if (!formId) {
            throw new Error("Form id is required");
        }

        return formFieldRepository.deleteByFormId(formId);
    },

    async replaceByFormId(formId, fields) {
        if (!formId) {
            throw new Error("Form id is required");
        }

        if (!Array.isArray(fields)) {
            throw new Error("Form fields must be an array");
        }

        const createData = fields.map(field => {
            const data = {
                ...field,
                formId
            };

            formFieldValidator.validateCreate(data);

            return formFieldMapper.toCreateData(data);
        });

        await formFieldRepository.deleteByFormId(formId);

        return formFieldRepository.createMany(createData);
    }
};