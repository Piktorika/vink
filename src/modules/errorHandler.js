import { DEFAULT_ERROR_MESSAGE, ERROR_MESSAGES } from "../constants.js";

const errorHandler = (error, method, route, options) => {
  if (!options.logger) throw error;

  const [detectedError] = ERROR_MESSAGES.filter((errorMessage) =>
    error.message.includes(errorMessage.expectedString)
  );

  if (detectedError) {
    return detectedError.message.replace("%s", route);
  }

  return DEFAULT_ERROR_MESSAGE.replace("%s", route).replace(
    "%s",
    error.message
  );
};

export default errorHandler;
