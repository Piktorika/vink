import { readdir, lstat } from "fs/promises";
import { Router } from "express";

import { ALLOWED_FILE_NAMES } from "./constants.js";
import { warn, info, success, error } from "./utils/logger.js";

import interceptor from "express-interceptor";

const preparedRouter = Router();

preparedRouter.use(
  interceptor((req, res) => ({
    isInterceptable: () => /application\/json/.test(res.get("Content-Type")),
    intercept: (body, send) => {
      if (!res.statusCode || res.statusCode === 200)
        success(req.url, `INCOMING ${req.method}`);
      else
        error(`${req.url}: ${JSON.parse(body).message}`, `INCOMING ${req.method}`);

      send(body);
    },
  }))
);

const loadRoutes = async (route, baseRoute = "", availableMiddleware = {}) => {
  const files = await readdir(route);

  if (!baseRoute) baseRoute = route;

  files.forEach(async (fileName) => {
    const fileRoute = `${route}/${fileName}`;
    const fileInfo = await lstat(fileRoute);

    if (fileInfo.isDirectory()) {
      return await loadRoutes(fileRoute, baseRoute, availableMiddleware);
    }

    if (/^.+\.middleware\.js$/.test(fileName)) {
      const { default: middleware } = await import(fileRoute);
      const [middlewareName] = fileName.split(".");

      return (availableMiddleware[middlewareName] = middleware);
    }

    const endpointRoute = route.replace(baseRoute, "");

    if (ALLOWED_FILE_NAMES.includes(fileName.split(".")[0])) {
      const [method] = fileName.split(".");

      try {
        const { default: routeHandler } = await import(fileRoute);

        preparedRouter[method](endpointRoute, routeHandler);

        return info(`${endpointRoute} added`, method);
      } catch (err) {
        if (err.message.includes("Cannot find module"))
          return warn(
            "Endpoint " +
              endpointRoute +
              " contains import errors. Ommitting...",
            method
          );

        return warn(
          `Endpoint ${endpointRoute} is missing a default export definition. Omitting route...`,
          method
        );
      }
    }

    if (/^.+\@.+\.js$/.test(fileName)) {
      const [method] = fileName.split("@");
      const [middleware] = fileName.split("@")[1].split(".");

      try {
        const { default: routeHandler } = await import(fileRoute);
        const selectedMiddleware = availableMiddleware[middleware];

        if (!selectedMiddleware) throw Error("middleware does not exist");

        preparedRouter[method](
          route.replace(baseRoute, ""),
          selectedMiddleware,
          routeHandler
        );

        return info(`${endpointRoute} added`, method);
      } catch (err) {
        console.log(err);
        if (err.message === "middleware does not exist")
          return warn(
            `The selected middleware applied on ${endpointRoute} does not exist. Ommitting creation...`,
            method
          );

        if (err.message.includes("Cannot find module"))
          return warn(
            "Endpoint " +
              endpointRoute +
              " contains import errors. Ommitting...",
            method
          );

        warn(
          `Endpoint ${endpointRoute} is missing a default export definition`,
          method
        );
      }
    }
  });

  return preparedRouter;
};

export default loadRoutes;
