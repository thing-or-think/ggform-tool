import { formRepository } from "../repositories/form.repository.js";
import { formFieldRepository } from "../repositories/form-field.repository.js";
import { formValidator } from "../validators/form.validator.js";
import { formMapper } from "../mappers/form.mapper.js";

export const formService = {
    async create(data) {
        formValidator.validateCreate(data);

        const existingForm = await formRepository.findByUrl(data.formUrl);

        if (existingForm) {
            throw new Error("Form URL already exists");
        }

        const createData = formMapper.toCreateData(data);

        const form = await formRepository.create(createData);

        return formMapper.toResponse(form);
    },

    async findById(id) {
        if (!id) {
            throw new Error("Form id is required");
        }

        const form = await formRepository.findById(id);

        if (!form) {
            throw new Error("Form not found");
        }

        return formMapper.toResponse(form);
    },

    async findByUrl(formUrl) {
        if (!formUrl) {
            throw new Error("Form URL is required");
        }

        const form = await formRepository.findByUrl(formUrl);

        if (!form) {
            throw new Error("Form not found");
        }

        return formMapper.toResponse(form);
    },

    async findMany() {
        const forms = await formRepository.findMany();

        return forms.map(form =>
            formMapper.toResponse(form)
        )
    },

    async update(id, data) {
        if (!id) {
            throw new Error("Form id is required");
        }

        formValidator.validateUpdate(data);

        const existingForm = await formRepository.findById(id);

        if (!existingForm) {
            throw new Error("Form not found");
        }

        const updateData = formMapper.toUpdateData(data);

        const updatedForm = await formRepository.update(id, updateData);

        return formMapper.toResponse(updatedForm);
    },

    async softDelete(id) {
        if (!id) {
            throw new Error("Form id is required");
        }

        const existingForm = await formRepository.findById(id);

        if (!existingForm) {
            throw new Error("Form not found");
        }

        await formFieldRepository.deleteByFormId(id);

        const deletedForm = await formRepository.softDelete(id);

        return formMapper.toResponse(deletedForm);
    },

    async upsertByUrl(data) {
        formValidator.validateCreate(data);

        const createData = formMapper.toCreateData(data);

        const form = await formRepository.upsertByUrl(createData);

        return formMapper.toResponse(form);
    }
};