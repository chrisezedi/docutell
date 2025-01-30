import express from "express";
import routes from "./routes/auth";
import "dotenv/config";
import { errorHandler } from "./middlewares/error";
import { serve, setup } from "swagger-ui-express";
import { load } from "js-yaml";
import { readFileSync } from "fs";
import { join } from "path";
import swaggerJSDoc, { Options } from "swagger-jsdoc";
import dbConnection from "../config/db";

const filePath = join(__dirname, "../docs/openapi.yaml");
const swaggerDefinition: any = load(readFileSync(filePath, "utf-8"));
const options: Options = { swaggerDefinition, apis: ["'./routes/*.ts'"] };
const specs = swaggerJSDoc(options);

const app = express();

app.use("/docs", serve, setup(specs));
app.use("/auth", routes);

app.use(errorHandler);

dbConnection();

app.listen(process.env.PORT, () =>
  console.log(`Server running on PORT ${process.env.PORT}`)
);
