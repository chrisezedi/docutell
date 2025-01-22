import express from "express";
import config from "../config/index";

const app = express();

app.listen(config.port, () => console.log(`Server running on PORT ${config.port}`))