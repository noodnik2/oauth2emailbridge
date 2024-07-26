import {getGoogleAuthUrl, getGoogleTokens} from "./googleAuthService";
import {Tokens} from "./tokenStorage";
import {listGoogleEmails, sendGoogleEmail} from "./googleEmailService";
import {getMsalAuthUrl, getMsalTokens} from "./msgraphAuthService";
import {listMsalEmails, sendMsalEmail} from "./msgraphEmailService";

export const getOAuthUrl = async (state: any) => {
    switch(state.provider) {
        case 'google':
            return getGoogleAuthUrl(state);
        case 'msal':
            return getMsalAuthUrl(state);
    }

    throw new Error(`unknown token provider(${state.provider}`);
}

export const getOAuthTokens = async (provider: string, code: string) => {
    switch(provider) {
        case 'google':
            const googleTokens = await getGoogleTokens(code);
            return <Tokens>{
                provider: provider,
                accessToken: googleTokens.access_token,
                refreshToken: googleTokens.refresh_token,
                scope: googleTokens.scope,
                tokenType: googleTokens.token_type!,
                expiryDate: googleTokens.expiry_date!,
            };
        case 'msal':
            const response = await getMsalTokens(code);
            // TODO refactor so that these 'get{Google,Msal}Tokens' functions return a `Tokens` structure
            console.log(`getMsalTokens returned(${JSON.stringify(response)})`);
            return <Tokens>{
                provider: provider,
                userId: response.account?.homeAccountId,
                accessToken: response.accessToken,
                // refreshToken: googleTokens.refresh_token,
                // scope: googleTokens.scope,
                // tokenType: googleTokens.token_type!,
                expiryDate: response.expiresOn?.getTime(),
            };
    }

    throw new Error(`unknown token provider(${provider}`)
}

export const sendOAuthEmail = (to: string, subject: string, text: string, tokens: Tokens) => {
    switch(tokens.provider) {
        case 'google':
            return sendGoogleEmail(to, subject, text, tokens);
        case 'msal':
            return sendMsalEmail(to, subject, text, tokens);
    }

    throw new Error(`unknown token provider(${tokens.provider}`);
}

export interface EmailEntry {
    id: string;
    from?: string;
    date?: string;
    internalDate: string;
    subject?: string;
    snippet?: string;
}

export const listOAuthEmails = async (pageToken: string, tokens: Tokens): Promise<{emails: Awaited<EmailEntry>[], nextPageToken: string | null | undefined}> => {
    switch(tokens.provider) {
        case 'google':
            return listGoogleEmails(pageToken, tokens);
        case 'msal':
            return listMsalEmails(pageToken, tokens);
    }

    throw new Error(`unknown token provider(${tokens.provider}`);
}