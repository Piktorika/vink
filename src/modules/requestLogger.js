import { success, error } from "./logger.js";

import interceptor from "express-interceptor";

export default interceptor((req, res) => ({
  isInterceptable: () => true,
  intercept: (body, send) => {
    if (!res.statusCode || res.statusCode < 400 || res.statusCode > 599)
      success(req.url, `${req.method} REQUEST`);
    else if (res.statusCode === 404)
      error(`${req.url}: Not found`, `${req.method} REQUEST`, res.statusCode);
    else
      error(
        `${req.url}: ${
          res.get("Content-Type").includes("application/json")
            ? JSON.parse(body).message
            : ""
        }`,
        `${req.method} REQUEST`,
        res.statusCode
      );

    send(body);
  },
}));
