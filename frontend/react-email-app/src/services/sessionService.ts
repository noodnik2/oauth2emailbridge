
// getSessionId returns a random, but consistent "sessionId" string value for a browser user session
export const getSessionId = (): string => {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = 'session-' + Math.random().toString(36);
        localStorage.setItem('sessionId', sessionId);
    }

    return sessionId;
};
