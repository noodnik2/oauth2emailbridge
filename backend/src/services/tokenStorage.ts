

export interface Tokens {
    userId?: string; // TODO remove this?  Only used now for msal
    accessToken: string;
    refreshToken?: string;
    scope?: string;
    tokenType?: string;
    expiryDate?: number;
}

export interface ProviderTokens {
    provider: string;
    tokens: Tokens;
}

const tokenStore: { [key: string]: ProviderTokens } = {};

export const saveProviderTokens = (userId: string, providerTokens: ProviderTokens): void => {
    tokenStore[userId] = providerTokens;
};

export const getProviderTokens = (userId: string): ProviderTokens | undefined => {
    return tokenStore[userId];
};
