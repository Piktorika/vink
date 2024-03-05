import { expect, describe, test } from "vitest";

import errorHandler from "./errorHandler";
import { ERROR_MESSAGES } from "../constants";

describe("errorHandler", () => {
  test.each(ERROR_MESSAGES)(
    "$expectedString returns a custom message",
    ({ expectedString, message }) => {
      const route = "/error_route";
      const customMessage = errorHandler(
        { message: expectedString },
        "GET",
        route,
        {
          logger: false,
        }
      );

      expect(customMessage).toStrictEqual(message.replace("%s", route));
    }
  );
});
