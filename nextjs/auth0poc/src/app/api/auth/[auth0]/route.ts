import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";

// see https://auth0.github.io/nextjs-auth0/interfaces/handlers_login.LoginOptions.html
export const GET = handleAuth({
  login: handleLogin({
    returnTo: "/profile",
  }),
});