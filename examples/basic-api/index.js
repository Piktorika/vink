import express from "express";
import { loadRoutes, logger } from "../../src/index.js";

const main = async () => {
  const app = express();
  const port = 3001;

  const loadedRoutes = await loadRoutes("./routes");

  app.use("/", loadedRoutes);

  app.listen(port, () => logger.info("API", `Listening on port ${port}`));
};

main();
