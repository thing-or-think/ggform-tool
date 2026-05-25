import { jest } from "@jest/globals";

const { default: prisma } = await import(
    "../../src/config/prisma.js"
);

beforeEach(async () => {
    await prisma.formField.deleteMany();
    await prisma.form.deleteMany();

    jest.clearAllMocks();
});

afterAll(async () => {
    await prisma.$disconnect();
});