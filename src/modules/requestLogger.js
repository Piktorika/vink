import { success, error } from "./logger.js";

import interceptor from "express-interceptor";

export default interceptor((req, res) => ({
  isInterceptable: () => true,
  intercept: (body, send) => {
    if (!res.statusCode || res.statusCode < 400 || res.statusCode > 599)
      success(`${req.method}`, req.url.toLowerCase());
    else if (res.statusCode === 404)
      error(res.statusCode, `${req.url}: Not found`);
    else error(res.statusCode, `${req.url}: ${
      res.get("Content-Type").includes("application/json")
        ? JSON.parse(body).message
        : ""
    }`);

    send(body);
  },
}));
