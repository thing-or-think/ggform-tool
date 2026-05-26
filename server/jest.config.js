export default {
    testEnvironment: "node",

    setupFilesAfterEnv: [
        "<rootDir>/tests/setup/integration.setup.js"
    ],

    maxWorkers: 1,

    transform: {},

    clearMocks: true,

    verbose: true
};