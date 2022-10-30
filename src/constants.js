export const DEFAULT_ERROR_MESSAGE = "Endpoint %s has some errors: %s. Ommitting route...";
export const ERROR_MESSAGES = [
    {
        expectedString: "Cannot find module",
        message: "Endpoint %s contains import errors. Ommitting..."
    },
    {
        expectedString: "requires a callback function",
        message: "Endpoint %s is missing a default export definition. Ommitting route..."
    },
    {
        expectedString: "middleware does not exist",
        message: "The selected middleware applied on %s does not exist. Ommitting creation..."
    }
]