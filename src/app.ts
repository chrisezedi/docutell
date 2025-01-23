import express from "express";
import config from "../config/index";
import routes from "./routes/auth";
import 'dotenv/config';

const app = express();

app.use("/auth", routes)

app.listen(config.port, () => console.log(`Server running on PORT ${config.port}`))