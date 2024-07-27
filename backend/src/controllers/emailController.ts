import {Request, Response} from 'express';
import {getProviderTokens, saveProviderTokens} from "../services/tokenStorage";
import {parseJson} from "../utils/parsers";
import {actor, getSequencer} from "../services/sequencer";
import {getEmailService} from "../services/emailService";
import {getAuthService} from "../services/authService";

/**
 * oauthCallback - responds to the "back channel" callback from OAuth2, and requires:
 * - the `state` parameter to contain a JSON formatted string with `returnTo`
 *   and `sessionId` values used to complete the normal OAuth2 flow.
 * - the normal `code` value used by OAuth2 to retrieve its authentication tokens.
 */
export const oauthCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const state = req.query.state as string;
  const { provider, returnTo, sessionId } = parseJson(state);

  if (!provider || !returnTo || !sessionId) {
    res.status(500).json({ error: `missing required parameter value(s) in 'state=${state}'` });
    return;
  }

  try {

    getSequencer()
        .response(actor.SP, actor.U, `redirect to OAuth2 callback`)
        .deactivate(actor.SP)
        .activate(actor.U)
        .message(actor.U, actor.C, `OAuth2 callback`)
        .activate(actor.C)
        .message(actor.C, actor.SP, `fetch tokens`)
        .activate(actor.C);

    const tokens = await getAuthService(provider).getOAuthTokens(code);

    getSequencer().message(actor.C, actor.C, `save tokens`);

    saveProviderTokens(sessionId, { provider, tokens});

    getSequencer()
        .deactivate(actor.C)
        .response(actor.C, actor.U, `redirect ${returnTo}`)
        .deactivate(actor.C, actor.U)
        .noteOver(`user is now authenticated by ${provider}`, actor.U, actor.SP);

    res.redirect(returnTo);

  } catch (e) {
    console.error("exception", e);

    getSequencer()
        .response(actor.C, actor.U, `callback returned error`)
        .deactivate(actor.C);

    res.status(500).json({ error: 'Failed to get tokens' });
  } finally {

    getSequencer().deactivate(actor.C, actor.SP);

  }

  // The browser was redirected to the callback, so when it returns the user's request completes.
  getSequencer().deactivate(actor.U);

};

/**
 * sendEmail - responds to an HTTP POST with the:
 * - 'sessionId' header used to look up the OAuth2 authentication tokens from storage
 * - request body containing the 'to', 'subject' and 'text' fields for the message to be sent
 */
export const sendEmail = async (req: Request, res: Response) => {

  const sessionId = req.header("sessionId") as string;
  if (!sessionId) {
    res.status(500).json({ error: `header attribute missing: 'sessionId'` });
    return;
  }

  getSequencer()
      .message(actor.U, actor.C, `send email`)
      .activate(actor.U, actor.C)
      .message(actor.C, actor.C, `lookup access token`);

  const providerTokens = getProviderTokens(sessionId);
  if (!providerTokens?.tokens?.accessToken) {

    getSequencer()
        .response(actor.C, actor.U, "Unauthorized")
        .deactivate(actor.C, actor.U);

    res.status(401).json({});
    return;
  }

  try {

    getSequencer()
        .message(actor.C, actor.SP, `send email with access token`)
        .activate(actor.SP);

    const { to, subject, text } = req.body;
    await getEmailService(providerTokens.provider)
        .sendOAuthEmail(to, subject, text, providerTokens.tokens);

    res.json({ message: 'Email sent successfully' });

  } catch (e) {

    getSequencer().response(actor.C, actor.U, `could not send email`);

    console.error('error sending email:', e);
    res.status(500).json({ error: `failed to send email: error(${JSON.stringify(e)})` });

  } finally {

    getSequencer().deactivate(actor.SP, actor.C, actor.U);

  }
};

/**
 * getAuthUrl - responds to an HTTP GET call having `returnTo` and `sessionId` query parameters used to
 *              initiate the authentication segment of the OAuth2 flow.  Upon success, the caller will
 *              be redirected to the authentication page of the Service Provider (e.g., Gmail).
 */
export const getAuthUrl = async (req: Request, res: Response) => {
  const returnTo = req.query.returnTo as string;
  const sessionId = req.query.sessionId as string;
  const provider = req.query.provider as string;
  if (!returnTo || !sessionId || !provider) {
    res.status(500).json({ error: " missing query parameter(s)" });
    return;
  }

  getSequencer().
    message(actor.U, actor.C, `get authorization`).
    activate(actor.U, actor.C).
    message(actor.C, actor.SP, `get ${provider} authorization URL`);

  const authUrl = await getAuthService(provider).getOAuthUrl({ provider, returnTo, sessionId });
  console.debug(`redirecting to OAuthUrl(${authUrl})`);

  getSequencer().response(actor.C, actor.U, `redirect to ${provider} for auth`);

  res.redirect(authUrl);

  // Depict a simplified approval dialog between the user and the Service Provider...
  getSequencer()
    .deactivate(actor.C, actor.U)
    .message(actor.U, actor.SP, `request authorization`)
    .activate(actor.U, actor.SP)
    .response(actor.SP, actor.U, `are you sure?`)
    .deactivate(actor.SP, actor.U)
    .message(actor.U, actor.SP, `yes, I'm sure`)
    .activate(actor.U, actor.SP)
    .message(actor.SP, actor.SP, `Record authorization`)
};

/**
 * listEmails - fetches and returns information about the next page of selected emails for the
 *              authenticated user.  The 'pageToken' parameter is used to select the starting
 *              offset of the page to be returned.  The value of the subsequent page (if any)
 *              is returned in the response's 'nextPageToken' attribute.
 */
export const listEmails = async (req: Request, res: Response) => {

  const sessionId = req.header("sessionId") as string;
  if (!sessionId) {
    res.status(500).json({ error: `header attribute missing: 'sessionId'` });
    return;
  }

  getSequencer()
    .message(actor.U, actor.C, `fetch emails`)
    .activate(actor.U, actor.C)
    .message(actor.C, actor.C, `lookup access token`);

  const providerTokens = getProviderTokens(sessionId);
  if (!providerTokens?.tokens?.accessToken) {

    getSequencer()
        .response(actor.C, actor.U, "Unauthorized")
        .deactivate(actor.C, actor.U);

    res.status(401).json({});
    return;
  }

  try {

    getSequencer()
        .message(actor.C, actor.SP, `fetch emails`)
        .activate(actor.C, actor.SP);

    const { pageToken} = req.query;
    console.log(`fetching emails(pageToken=${pageToken})`);

    const r = await getEmailService(providerTokens.provider)
      .listOAuthEmails(pageToken as string, providerTokens.tokens);

    res.json({
      emails: r.emails,
      nextPageToken: r.nextPageToken,
    });

  } catch (error) {

    console.error('Error fetching emails:', error);
    res.status(500).send(`Error fetching emails: ${JSON.stringify(error)}`);

    getSequencer().response(actor.SP, actor.C, "Error");

  } finally {

    getSequencer().deactivate(actor.SP, actor.C, actor.C, actor.U);

  }
};
