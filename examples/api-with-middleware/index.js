import express from "express";
import { loadRoutes, logger } from "../../src/index.js";

import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const resolvedPath = resolve(__dirname, "./routes");

const main = async () => {
  const app = express();
  const port = 3001;

  const loadedRoutes = await loadRoutes(resolvedPath);

  app.use("/", loadedRoutes);

  app.listen(port, () => logger.info(`Listening on port ${port}`, "API"));
};

main();
