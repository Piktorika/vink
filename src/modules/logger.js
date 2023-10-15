import chalk from "chalk";

const colorIndex = {
  info: "blue",
  error: "red",
  warn: "yellow",
  ok: "green",
};

const buildLog = (type, method, msg) => {
  const color = colorIndex[type];
  const timestamp = new Date().toISOString().replace("Z", "");

  const colorFn = chalk[color];
  const brightColorFn = chalk[`${color}Bright`];

  return colorFn(
    `${colorFn(timestamp)}: [${type.toUpperCase()}] [${brightColorFn(
      method.toUpperCase()
    )}] ${brightColorFn(msg)}`
  );
};

const print = (type, method, msg) => {
  console.log(buildLog(type, method, msg));
};

export const info = (method, message) => print("info", method, message);
export const warn = (method, message) => print("warn", method, message);
export const error = (statusCode, message) => {
  const method = `ERROR${statusCode ? `:${statusCode}` : ""}`;

  print("error", method, message);
};
export const success = (method, message) => print("ok", method, message);
