import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {getSessionId} from "../services/sessionService";

interface Email {
    id: string;
    date: string;
    from: string;
    snippet: string;
}

interface EmailResponse {
    emails: Email[];
    nextPageToken: string;
}

const backendUrlPrefix = process.env.REACT_APP_BACKEND_URL_PREFIX;

const EmailList: React.FC = () => {
    const [emails, setEmails] = useState<Email[]>([]);
    const [nextPageToken, setNextPageToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchEmails = async (pageToken: string | null = null) => {
        setLoading(true);

        const backendUrl = backendUrlPrefix + '/api/email/list';
        const sessionId = getSessionId();
        try {
            const response = await axios.post<EmailResponse>(
                backendUrl,
                { },
                {
                    params: { pageToken },
                    headers: { 'sessionId': sessionId },
                }
            );
            setEmails(prevEmails => [...prevEmails, ...response.data.emails]);
            setNextPageToken(response.data.nextPageToken);
            // alert('Email fetched successfully!');
        } catch (e) {
            console.error('error fetching email', e);
            // alert(`Failed to fetch email; error(${e})`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmails();
    }, []);

    return (
        <div>
            <table>
                <thead>
                <tr>
                    <th>From</th>
                    <th>Date</th>
                    <th>Snippet</th>
                </tr>
                </thead>
                <tbody>
                    {emails.map(email => (
                        <tr>
                            <td>{email.from}</td>
                            <td>{email.date}</td>
                            <td>{email.snippet}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {nextPageToken && (
                <button onClick={() => fetchEmails(nextPageToken)} disabled={loading}>
                    {loading ? 'Loading...' : 'Next'}
                </button>
            )}
        </div>
    );
};

export default EmailList;
