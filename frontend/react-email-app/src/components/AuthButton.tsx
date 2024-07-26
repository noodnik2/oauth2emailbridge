import React from 'react';
import {getSessionId} from "../services/sessionService";

const backendUrlPrefix = process.env.REACT_APP_BACKEND_URL_PREFIX;

const AuthButton = (props: { providerId: string, className: string }) => {
  const handleAuth = async (providerId: string) => {
    const returnTo = window.location.href;
    const sessionId = getSessionId();
    try {
      window.location.href = backendUrlPrefix + `/api/email/auth-url?returnTo=${returnTo}&sessionId=${sessionId}&provider=${providerId}`;
    } catch (e) {
      console.error('error fetching authorization URL', e);
      alert(`Failed to start authorization process; error(${JSON.stringify(e)})`);
    }
  };

  return (
      <button
        className={props.className}
        onClick={() => handleAuth(props.providerId)}
      >
          Log In
      </button>
  );
};

export default AuthButton;
