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
import session from "express-session";
import { RedisStore } from "connect-redis";
import { Redis } from "ioredis";

const filePath = join(__dirname, "../docs/openapi.yaml");
const swaggerDefinition: any = load(readFileSync(filePath, "utf-8"));
const options: Options = { swaggerDefinition, apis: ["'./routes/*.ts'"] };
const specs = swaggerJSDoc(options);
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const redisClient = new Redis(redisUrl)
const redisStore = new RedisStore({
  client:redisClient,
  prefix:"docutell"
})

const app = express();

app.use("/docs", serve, setup(specs));
app.use(errorHandler);
app.use(session({
  name:"sid",
  store:redisStore,
  resave:false,
  saveUninitialized:false,
  secret: process.env.REDIS_SESSION_SECRET as string,
  cookie: {
    secure:true,
    httpOnly:true,
    maxAge:1000 * 60 * 60 * 24 * 7
  }
}))

dbConnection();

app.use("/auth", routes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on PORT ${process.env.PORT}`)
);
