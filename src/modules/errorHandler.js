import { DEFAULT_ERROR_MESSAGE, ERROR_MESSAGES } from "../constants.js";

export default (error, method, route) => {
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
