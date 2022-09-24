import loadRoutesFn from "./loadRoutes.js";
import { info, success, warn, error } from "./utils/logger.js";

export const loadRoutes = loadRoutesFn;
export const logger = {
  error,
  info,
  success,
  warn,
};
