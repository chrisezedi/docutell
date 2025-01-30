import { NextFunction, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";
import User from "../models/user";

const generateOauth2Client = (): OAuth2Client => {
  return new OAuth2Client({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URL,
  });
};

export const generateGoogleAuthUrl = (_: Request, res: Response) => {
  const oAuth2Client = generateOauth2Client();

  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "openid",
    ],
    prompt: "consent",
  });

  res.json({ url: authorizeUrl });
};

export const getUserData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const oAuth2Client = generateOauth2Client();
    const code = req.query.code as string;
    const { tokens } = await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(tokens);
    const { access_token } = oAuth2Client.credentials;
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      { headers: { Authorization: `Bearer ${access_token}` } }
    );
    const data = await response.data;
    const user = new User({
      firstName: data?.given_name,
      lastName: data?.family_name,
      email: data?.email,
      profileImg: data?.picture,
      isVerified: data?.email_verified
    })
    await user.save();
    res.json({status:200, message:"User created successfully"});
  } catch (error) {
    next({
      service: "google-auth",
      url: (error as any)?.response?.config?.url,
      thirdPartyError: (error as any)?.response?.data,
      method: (error as any)?.response?.config?.method,
    });
  }
};
