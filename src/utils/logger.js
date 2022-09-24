import chalk from "chalk";

const loggerHandler = (color, msg, type, method) =>
  console.log(
    chalk[color](
      `${chalk[color + "Bright"](
        new Date().toISOString().replace("Z", "")
      )}: [${method}] [${chalk[color + "Bright"](type.toUpperCase())}] ${chalk[
        color + "Bright"
      ](msg)}`
    )
  );

export const info = (msg, type) => loggerHandler("blue", msg, type, "INFO");
export const warn = (msg, type) => loggerHandler("yellow", msg, type, "WARN");
export const error = (msg, type, statusCode = null) => loggerHandler("red", msg, type, `ERROR${statusCode ? `:${statusCode}` : ""}`);
export const success = (msg, type) => loggerHandler("green", msg, type, "OK");
