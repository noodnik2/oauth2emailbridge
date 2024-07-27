import {Tokens} from "./tokenStorage";
import {MsgraphEmailService} from "./msgraphEmailService";
import {GoogleEmailService} from "./googleEmailService";

export interface EmailEntry {
    id: string;
    from?: string;
    date?: string;
    internalDate: string;
    subject?: string;
    snippet?: string;
}

export interface Emails {
    emails: Awaited<EmailEntry[]>,
    nextPageToken: string | null | undefined;
}

export interface EmailService {
    sendOAuthEmail(to: string, subject: string, text: string, tokens: Tokens): Promise<void>;
    listOAuthEmails(pageToken: string, tokens: Tokens): Promise<Emails>;
}

export const getEmailService = (providerId: string): EmailService => {
    switch(providerId) {
        case 'google':
            return new GoogleEmailService();
        case 'msal':
            return new MsgraphEmailService();
    }

    throw new Error(`unknown token provider(${providerId}`);
}
