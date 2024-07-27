import {AuthenticationResult, ConfidentialClientApplication, Configuration, LogLevel} from '@azure/msal-node';
import {Client} from '@microsoft/microsoft-graph-client';
import 'isomorphic-fetch';
import {AuthService} from "./authService";
import {Tokens} from "./tokenStorage";

// Initialize the MSAL application object
export const getMsalConfig = (): Configuration => {
    return {
        auth: {
            clientId: process.env.MICROSOFT_CLIENT_ID ?? '',
            authority: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}`,
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        },
        system: {
            loggerOptions: {
                loggerCallback(_, message, containsPii) {
                    if (!containsPii) console.log(message);
                },
                piiLoggingEnabled: false,
                logLevel: LogLevel.Verbose,
            }
        }
    };
};

// see: https://learn.microsoft.com/en-us/entra/identity-platform/scopes-oidc
// TODO - set to minimum required
const SCOPES = [
    "Mail.Send",
    "Mail.Send.Shared",
    "offline_access",
    "user.read",
    "mail.read",
    "mail.readwrite",
    'email',    // access to user's primary email address
    'openid',   // access to the 'UserInfo' endpoint
    'profile',  // information about the user
];

const newMsalClient = (): ConfidentialClientApplication => {
    return new ConfidentialClientApplication(getMsalConfig());
}

export const getAuthenticatedClient = (accessToken: any) => {
    return Client.init({
        debugLogging: true,
        authProvider: (done: any) => {
            done(null, accessToken); // Pass the access token to the auth provider
        },
    });
}

const getMsalAuthUrl = async (state: any): Promise<string> => {

    // TODO validate parameters & return error

    const authCodeUrlParameters = {
        scopes: SCOPES,
        redirectUri: process.env.MICROSOFT_REDIRECT_URI ?? '',
        state: JSON.stringify(state),
    };

    return await newMsalClient().getAuthCodeUrl(authCodeUrlParameters);
};

/**
 * getMsgraphTokens returns the tokens resulting from the completed authentication step.
 * @param code - authorization code for which tokens are desired
 */
const getMsgraphTokens = async (code: string): Promise<AuthenticationResult> => {
    const tokenRequest = {
        code: code,
        scopes: SCOPES,
        redirectUri: process.env.MICROSOFT_REDIRECT_URI ?? '',
    };

    console.debug(`acquireTokenByCode(${JSON.stringify(tokenRequest)})`);
    const ar = await newMsalClient().acquireTokenByCode(tokenRequest);
    console.debug(` --> (${JSON.stringify(ar)})`);
    return ar;
};

export class MsgraphAuthService implements AuthService {

    async getOAuthUrl(state: any): Promise<string> {
        return await getMsalAuthUrl(state);
    }

    async getOAuthTokens(code: string): Promise<Tokens> {
        const msgt = await getMsgraphTokens(code);
        console.debug(`getMsalTokens returned(${JSON.stringify(msgt)})`);
        return <Tokens>{
            userId: msgt.account?.homeAccountId,
            accessToken: msgt.accessToken,
            expiryDate: msgt.expiresOn?.getTime(),
        };
    }

}
