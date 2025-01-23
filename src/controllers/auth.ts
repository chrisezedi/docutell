import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";

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

export const getUserData = async (req: Request, res: Response) => {
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
    // {"sub":"109398518582898527261","name":"Ekene Ezedi","given_name":"Ekene","family_name":"Ezedi","picture":"https://lh3.googleusercontent.com/a/ACg8ocKbAGFv-WeYMPZak-M7TFwFuy0NSPXaDQGInYEuHIC_ANFIdc4=s96-c","email":"ekenechrisezedi@gmail.com","email_verified":true}
    res.send(data);
  } catch (error: any) {
    console.log(error);
    res.send(error);
  }
};
