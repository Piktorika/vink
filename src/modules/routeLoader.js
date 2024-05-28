import { readdir, lstat } from "fs/promises";
import { Router } from "express";

import path from "node:path";
import { resolve } from "path";

import parentModule from "parent-module";

import { requestLogger, errorHandler, logger } from "#modules";

const { warn, info } = logger;

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

  await Promise.all(
    files.map(async (fileName) => {
      const fileRoute = !options?.baseRoute
        ? `${absoluteRoutePath}/${fileName}`
        : `${route}/${fileName}`;
      const fileInfo = await lstat(fileRoute);

      if (fileInfo.isDirectory())
        return await loadRoutes(fileRoute, {
          ...options,
          baseRoute,
          availableMiddleware,
        });

      // Middleware definition files
      if (/^.+\.middleware\.js$/.test(fileName)) {
        const { default: middleware } = await import(fileRoute);
        const [middlewareName] = fileName.split(".");

        return (availableMiddleware[middlewareName] = middleware);
      }

      const endpointRoute =
        route.replace(baseRoute, "") === ""
          ? "/"
          : route.replace(baseRoute, "");

      const validRoute = removeGroups(endpointRoute);

      try {
        // Basic HTTP routes
        if (/^(post|get|put|patch|delete)\.js$/.test(fileName)) {
          const [method] = fileName.split(".");

          const { default: routeHandler } = await import(fileRoute);

          preparedRouter[method](validRoute, routeHandler);

          return info(method, `${validRoute} loaded`);
        }

        // Routes with middleware
        if (/^(get|post|delete|put|patch)\@.+\.js$/.test(fileName)) {
          const [method] = fileName.split("@");
          const [middlewareName] = fileName.split("@")[1].split(".");

          const { default: routeHandler } = await import(fileRoute);
          const selectedMiddleware = availableMiddleware[middlewareName];

          if (!selectedMiddleware)
            throw Error(
              "the specified middleware (" + middlewareName + ") does not exist"
            );

          preparedRouter[method](
            validRoute.replace(baseRoute, ""),
            selectedMiddleware,
            routeHandler
          );

          return info(method, `${validRoute} loaded`);
        }
      } catch (err) {
        return warn(method, errorHandler(err, method, validRoute, options));
      }
    })
  );

  return preparedRouter;
};

export default loadRoutes;
