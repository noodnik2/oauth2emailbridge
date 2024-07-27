import {Credentials, OAuth2Client} from "google-auth-library";
import {Tokens} from "./tokenStorage";
import {AuthService} from "./authService";

// see: https://developers.google.com/identity/protocols/oauth2/scopes
const SCOPES = [
    'https://mail.google.com/',
    'email'
];

// newGoogleOAuth2Client creates and returns an initialized Google OAuth2 client
export const newGoogleOAuth2Client = (): OAuth2Client => {
  return new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
  );
}

// getGoogleAuthUrl generates the URL to the authentication page of the Service Provider (e.g., Gmail).
// state - used to carry context forward, passed to the callback as JSON
const getGoogleAuthUrl = (state: any): string => {
  return newGoogleOAuth2Client().generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent',    // TODO remove this when no longer useful; forces user to provide "consent" on each request
      state: JSON.stringify(state),
  });
};

// getGoogleTokens returns the tokens resulting from the completed authentication step.
const getGoogleTokens = async (code: string): Promise<Credentials> => {
    const gtr = await newGoogleOAuth2Client().getToken(code);
    return gtr.tokens;
};

export class GoogleAuthService implements AuthService {

    async getOAuthUrl(state: any): Promise<string> {
        return getGoogleAuthUrl(state);
    }

    async getOAuthTokens(code: string): Promise<Tokens> {
        const gt = await getGoogleTokens(code);
        return <Tokens>{
            refreshToken: gt.refresh_token,
            accessToken: gt.access_token,
            expiryDate: gt.expiry_date!,
            tokenType: gt.token_type!,
            scope: gt.scope,
        };
    }

}
