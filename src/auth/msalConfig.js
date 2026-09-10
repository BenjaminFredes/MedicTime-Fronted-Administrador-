import { PublicClientApplication } from '@azure/msal-browser';

const clientId = "9b818c2c-efc8-487d-9610-5dd0d940f18b";
const tenantId = "12d06913-6cce-486f-a7a4-d6202dc5bf6a";

export const msalConfig = {
  auth: {
    clientId: clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri: "http://localhost:3000/",
    postLogoutRedirectUri: "http://localhost:3001/login", // Apunta al puerto 3001
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true,
  }
};

export const loginRequest = {
  scopes: [
    "openid",
    "profile",
    `api://${clientId}/access_as_user`
  ]
};

export const msalInstance = new PublicClientApplication(msalConfig);