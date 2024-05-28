import { success, error } from "./logger.js";

import interceptor from "express-interceptor";

export default interceptor((req, res) => ({
  isInterceptable: () => true,
  intercept: (body, send) => {
    if (!res.statusCode || res.statusCode < 400 || res.statusCode > 599)
      success(`${req.method}`, req.url.toLowerCase());
    else if (res.statusCode === 404)
      error(req.method, `${req.url}: Not found`, res.statusCode);
    else
      error(
        req.method,
        `${req.url}: ${
          res.get("Content-Type").includes("application/json")
            ? JSON.parse(body).message
            : ""
        }`,
        res.statusCode
      );

    send(body);
  },
}));
