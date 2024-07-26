

export interface Tokens {
    provider: string;
    userId?: string; // TODO remove this?  Only used now for msal
    accessToken: string;
    refreshToken?: string;
    scope?: string;
    tokenType?: string;
    expiryDate?: number;
}

const tokenStore: { [key: string]: Tokens } = {};

export const saveTokens = (userId: string, tokens: Tokens): void => {
    tokenStore[userId] = tokens;
};

export const getTokens = (userId: string): Tokens | undefined => {
    return tokenStore[userId];
};
