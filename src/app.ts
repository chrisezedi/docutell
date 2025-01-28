import express from "express";
import config from "../config/index";
import routes from "./routes/auth";
import "dotenv/config";
import { errorHandler } from "./middlewares/error";
import { serve, setup } from "swagger-ui-express";
import { load } from "js-yaml";
import { readFileSync } from "fs";
import { join } from "path";
import swaggerJSDoc, { Options } from "swagger-jsdoc";

const filePath = join(__dirname, "../docs/openapi.yaml");
const swaggerDefinition: any = load(readFileSync(filePath, "utf-8"));
const options: Options = { swaggerDefinition, apis: ["'./routes/*.ts'"] };
const specs = swaggerJSDoc(options);

const app = express();

app.use("/docs", serve, setup(specs));
app.use("/auth", routes);

app.use(errorHandler);

app.listen(config.port, () =>
  console.log(`Server running on PORT ${config.port}`)
);
