import React, { useState } from 'react';
import axios from 'axios';
import {getSessionId} from "../services/sessionService";

const backendUrlPrefix = process.env.REACT_APP_BACKEND_URL_PREFIX;

const getCurrentTimestamp = (): string => {
  const timeNow = new Date();
  return timeNow.toLocaleTimeString();
}

const EmailForm: React.FC = () => {

  const timeNow = getCurrentTimestamp();
  const messageSubject = 'test e-mail at ' + timeNow;
  const messageBody = `
Hello,

This e-mail is simply being sent as a test on behalf of the sending user.

It is likely one of many you will receive.

This particular message was sent at ${timeNow}

Thank you for your understanding and patience.
  `;

  const [to, setTo] = useState('noodnik2@gmail.com');
  const [subject, setSubject] = useState(messageSubject);
  const [text, setText] = useState(messageBody.trim());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    const backendUrl = backendUrlPrefix + '/api/email/send';
    const sessionId = getSessionId();
    try {
      await axios.post(
        backendUrl,
        { to, subject, text },
        { headers: { 'sessionId': sessionId }}
      );
      alert('Email sent successfully!');
    } catch (e) {
      console.error('error sending email', e);
      alert(`Failed to send email; error(${e})`);
    }
  };

  return (
      <form onSubmit={handleSubmit}>
        <div className="row">
          <label htmlFor="to">To:</label>
          <div className="row">
            <input
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="To"
                required
            />
          </div>
          <label htmlFor="subject">Subject:</label>
          <div className="row">
            <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                required
            />
          </div>
          <label htmlFor="text">Message:</label>
          <div className="row">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Message"
                required
            />
          </div>
          <div className="row">
            <span>
              <button type="submit" id="sendEmail">Send Email</button>
            </span>
          </div>
        </div>
      </form>
  );
};

export default EmailForm;
