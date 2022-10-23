import express from "express";

import sqlite3Module from "sqlite3";
const sqlite3 = sqlite3Module.verbose();

import { loadRoutes, logger } from "../../src/index.js";

const main = async () => {
  const app = express();
  const port = 3001;

  const loadedRoutes = await loadRoutes("./routes");

  // open the database
  const db = new sqlite3.Database(":memory:");

  await db.exec(
    "CREATE TABLE Product (id INTEGER NOT NULL PRIMARY KEY, name TEXT NOT NULL, price REAL NOT NULL)"
  );

  await db.run("INSERT INTO Product VALUES(?,?,?)", 1, "Frozen pizza", 3.4);
  await db.run("INSERT INTO Product VALUES(?,?,?)", 2, "Bread", 1.0);

  app.use((req, res, next) => {
    req.db = db;

    next();
  });

  app.use(express.json());
  app.use("/", loadedRoutes);

  app.listen(port, () => logger.info(`Listening on port ${port}`, "API"));
};

main();
