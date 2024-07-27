import {GoogleAuthService} from "./googleAuthService";
import {Tokens} from "./tokenStorage";
import {MsgraphAuthService} from "./msgraphAuthService";

export interface AuthService {
    getOAuthUrl(state: any): Promise<string>;
    getOAuthTokens(code: string): Promise<Tokens>;
}

export const getAuthService = (providerId: string): AuthService => {
    switch(providerId) {
        case 'google':
            return new GoogleAuthService();
        case 'msal':
            return new MsgraphAuthService();
    }

    throw new Error(`unknown token provider(${providerId}`);
}
