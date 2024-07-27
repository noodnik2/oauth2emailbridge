/**
 *  @returns random, but consistent "sessionId" string value for a browser user session
 */
export const getSessionId = (): string => {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = 'session-' + Math.random().toString(36);
        sessionStorage.setItem('sessionId', sessionId);
    }

    return sessionId;
};
