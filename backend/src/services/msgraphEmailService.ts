import {Tokens} from "./tokenStorage";
import {getAuthenticatedClient} from "./msgraphAuthService";
import {EmailEntry} from "./authService";

/**
 * sendMsalEmail - sends email on behalf of the authenticated & authorized OAuth2 user.
 * @param to addressee
 * @param subject subject line
 * @param text message body text
 * @param tokens OAuth2 authorization tokens, including the access token
 */
export const sendMsalEmail = async (to: string, subject: string, text: string, tokens: Tokens) => {

    const client = getAuthenticatedClient(tokens.accessToken);

    const email = {
        message: {
            subject: subject,
            body: {
                contentType: 'Text',
                content: text
            },
            toRecipients: [
                {
                    emailAddress: {
                        address: to
                    }
                }
            ]
        },
        saveToSentItems: 'true'
    };

    await client.api('/me/sendMail').post(email);
};

/**
 * listMsalEmails - fetches a "page" of emails on behalf of the authenticated & authorized OAuth2 user.
 * @param pageToken pointer to which "page" should be loaded, or empty to start at first page
 * @param tokens OAuth2 authorization tokens, including the access token
 */
export const listMsalEmails = async (pageToken: string, tokens: Tokens) => {

    console.log(`about to getAuthenticatedClient(${tokens.accessToken})`);
    const client = getAuthenticatedClient(tokens.accessToken);
    console.log(`returned from getAuthenticatedClient => ${JSON.stringify(client)}`);

    const path = pageToken ?? '/me/mailFolders/inbox/messages';
    const msalMessages = await client.api(path).select('subject,from,receivedDateTime').top(10).get();
    const msalNextLink = msalMessages['@odata.nextLink']

    interface ET {
        id: string;
        subject?: string;
        receivedDateTime?: string;
        from?: {
            emailAddress?: {
                name?: string;
                address?: string;
            }
        };
    }

    const messages = msalMessages.value as ET[] || [];

    const emails = await Promise.all(
        messages.map(
            async message => {
                return <EmailEntry>{
                    id: message.id, // email.data.id,
                    from: message.from?.emailAddress?.address,
                    date: message.receivedDateTime,
                    internalDate: message.receivedDateTime, // email.data.internalDate,
                    snippet: message.subject, // email.data.snippet,
                };
            }
        )
    );

    // Sort emails by internalDate in descending order
    emails.sort(
        (a, b) => parseInt(b.internalDate || '0') - parseInt(a.internalDate || '0')
    );

    return {
        emails,
        nextPageToken: msalNextLink,
    };
}
