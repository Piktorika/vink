import loadRoutesFn from "./modules/routeLoader.js";
import { info, success, warn, error } from "./modules/logger.js";

export const loadRoutes = loadRoutesFn;
export const logger = {
  error,
  info,
  success,
  warn,
};
