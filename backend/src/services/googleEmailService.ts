import nodemailer from 'nodemailer';
import {newGoogleOAuth2Client} from "./googleAuthService";
import {gmail_v1, google} from "googleapis";
import {Tokens} from "./tokenStorage";
import {EmailEntry, EmailService, Emails} from "./emailService";

/**
 * sendGoogleEmail - sends email on behalf of the authenticated & authorized OAuth2 user.
 * @param to addressee
 * @param subject subject line
 * @param text message body text
 * @param tokens OAuth2 authorization tokens, including the access token
 */
const sendGoogleEmail = async (to: string, subject: string, text: string, tokens: Tokens) => {

    const { email } = await newGoogleOAuth2Client().getTokenInfo(tokens.accessToken);

    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: email,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: tokens.refreshToken,
            accessToken: tokens.accessToken,
        }
    });

    await transport.sendMail({ from: email, to, subject, text, });
};

/**
 * listGoogleEmails - fetches a "page" of emails on behalf of the authenticated & authorized OAuth2 user.
 * @param pageToken pointer to which "page" should be loaded, or empty to start at first page
 * @param tokens OAuth2 authorization tokens, including the access token
 */
const listGoogleEmails = async (pageToken: string, tokens: any): Promise<Emails> => {

    // TODO unify with creation of client elsewhere
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
        access_token: tokens?.accessToken,
        refresh_token: tokens?.refreshToken,
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const response = await gmail.users.messages.list({
        userId: 'me',
        labelIds: ['INBOX'],
        q: '-in:sent',
        pageToken: pageToken as string,
        maxResults: 10, // Adjust the number of results per page
    });

    const messages = response.data.messages || [];

    const emails = await Promise.all(
        messages.map(
            async message => {
                const email = await gmail.users.messages.get({
                    userId: 'me',
                    id: message.id!,
                });

                const getHeadValue = (headers: gmail_v1.Schema$MessagePartHeader[] | undefined, name: string): string | null | undefined => {
                    return headers?.find(h => h.name === name)?.value;
                }

                return <EmailEntry>{
                    id: email.data.id,
                    from: getHeadValue(email.data.payload?.headers, "From"),
                    date: getHeadValue(email.data.payload?.headers, "Date"),
                    internalDate: email.data.internalDate,
                    snippet: email.data.snippet,
                };
            }
        )
    );

    // Sort emails by internalDate in descending order
    emails.sort(
        (a, b) => parseInt(b.internalDate || '0') - parseInt(a.internalDate || '0')
    );

    return <Emails>{
        emails,
        nextPageToken: response.data.nextPageToken,
    };

}

export class GoogleEmailService implements EmailService {

    async sendOAuthEmail(to: string, subject: string, text: string, tokens: Tokens): Promise<void> {
        await sendGoogleEmail(to, subject, text, tokens);
    }

    async listOAuthEmails(pageToken: string, tokens: Tokens): Promise<Emails> {
        return listGoogleEmails(pageToken, tokens);
    }

}

