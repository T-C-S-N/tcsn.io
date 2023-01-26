/** @format */

import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

async function refreshAccessToken(tokenObject) {
  try {
    // Get a new set of tokens with a refreshToken
    const tokenResponse = await axios.post(process.env.WEBSITE_URL + "/auth/refreshToken", {
      token: tokenObject.refreshToken,
    });

    return {
      ...tokenObject,
      accessToken: tokenResponse.data.accessToken,
      accessTokenExpiry: tokenResponse.data.accessTokenExpiry,
      refreshToken: tokenResponse.data.refreshToken,
    };
  } catch (error) {
    return {
      ...tokenObject,
      error: "RefreshAccessTokenError",
    };
  }
}

const providers = [
  CredentialsProvider({
    name: "Credentials",
    authorize: async (user) => {
      try {
        return user ? user : null;
      } catch (e) {
        throw new Error(e);
      }
    },
  }),
];

const callbacks = {
  jwt: async ({ token, user }) => {
    if (user) {
      // This will only be executed at login. Each next invocation will skip this part.
      token.accessToken = user.accessToken;
      token.accessTokenExpiry = user.accessTokenExpiry;
      //token.refreshToken = user.data.refreshToken;
      token.role = user.role;
      token.verified = user.verified;
    }

    // If accessTokenExpiry is 24 hours, we have to refresh token before 24 hours pass.
    const shouldRefreshTime = Math.round(token.tokenExpiry - 60 * 60 * 1000 - Date.now());

    // If the token is still valid, just return it.
    if (shouldRefreshTime > 0) {
      return Promise.resolve(token);
    }

    // If the call arrives after 23 hours have passed, we allow to refresh the token.
    token = refreshAccessToken(token);
    return Promise.resolve(token);
  },
  session: async ({ session, token }) => {
    // Here we pass accessToken to the client to be used in authentication with your API
    session.accessToken = token.accessToken;
    session.accessTokenExpiry = token.accessTokenExpiry;
    session.error = token.error;
    session.email = token.email;
    session.role = token.role;

    return Promise.resolve(session);
  },
};

export const options = {
  providers,
  callbacks,
  pages: {},
  secret: process.env.SECRET,
};

const Auth = (req, res) => NextAuth(req, res, options);
export default Auth;
