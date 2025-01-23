import express from "express";
import { generateGoogleAuthUrl, getUserData } from "../controllers/auth";
const router = express.Router();

router.get("/getGoogleAuthUrl", generateGoogleAuthUrl);

router.get("/oauth", getUserData)

export default router;