import { readdir, lstat } from "fs/promises";
import { Router } from "express";

import { ALLOWED_FILE_NAMES } from "./constants.js";
import { warn, info } from "./utils/logger.js";

import requestLogger from "./core/requestLogger.js";

import errorHandler from "./core/errorHandler.js";

import path from "node:path";
import { resolve } from "path";

import parentModule from "parent-module";

const preparedRouter = Router();

const removeGroups = (route) => route.replace(/\/\(.+\)/g, "");

const loadRoutes = async (route, options = { logger: true }) => {
  const parentPath = path.dirname(parentModule()).replace("file://", "");
  const absoluteRoutePath = resolve(`${parentPath}/${route}`);
  const files = !options?.baseRoute
    ? await readdir(absoluteRoutePath)
    : await readdir(route);

  if (options?.logger && !options?.baseRoute) {
    preparedRouter.use(requestLogger);
  }

  let baseRoute = options?.baseRoute ?? absoluteRoutePath;
  let availableMiddleware = options?.availableMiddleware ?? {};

  files.forEach(async (fileName) => {
    const fileRoute = !options?.baseRoute
      ? `${absoluteRoutePath}/${fileName}`
      : `${route}/${fileName}`;
    const fileInfo = await lstat(fileRoute);

    if (fileInfo.isDirectory()) {
      return await loadRoutes(fileRoute, {
        ...options,
        baseRoute,
        availableMiddleware,
      });
    }

    // Middleware definition files
    if (/^.+\.middleware\.js$/.test(fileName)) {
      const { default: middleware } = await import(fileRoute);
      const [middlewareName] = fileName.split(".");

      return (availableMiddleware[middlewareName] = middleware);
    }

    const endpointRoute =
      route.replace(baseRoute, "") === "" ? "/" : route.replace(baseRoute, "");

    const validRoute = removeGroups(endpointRoute)

    // Basic HTTP routes
    if (ALLOWED_FILE_NAMES.includes(fileName.split(".")[0])) {
      const [method] = fileName.split(".");

      try {
        const { default: routeHandler } = await import(fileRoute);

        preparedRouter[method](validRoute, routeHandler);

        return info(`${validRoute} loaded`, method);
      } catch (err) {
        return warn(errorHandler(err, method, validRoute, options), method);
      }
    }

    // Routes with middleware
    if (/^.+\@.+\.js$/.test(fileName)) {
      const [method] = fileName.split("@");
      const [middleware] = fileName.split("@")[1].split(".");

      try {
        const { default: routeHandler } = await import(fileRoute);
        const selectedMiddleware = availableMiddleware[middleware];

        if (!selectedMiddleware) throw Error("middleware does not exist");

        preparedRouter[method](
          removeGroups(route).replace(baseRoute, ""),
          selectedMiddleware,
          routeHandler
        );

        return info(`${validRoute} loaded`, method);
      } catch (err) {
        return warn(errorHandler(err, method, validRoute, options), method);
      }
    }
  });

  return preparedRouter;
};

export default loadRoutes;
