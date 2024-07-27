import React, {useEffect, useState} from 'react';
import styles from './HomePage.module.css';
import MenuBar from "./MenuBar";
import EmailForm from "./EmailForm";
import EmailList from "./EmailList";
import {getDefaultProvider} from "../services/providerService";

const HomePage = () => {
    const [providerId, setProviderId] = useState(
        () => {
            const lastProviderId = sessionStorage.getItem('provider');
            return lastProviderId !== null ? lastProviderId : getDefaultProvider().id
        }
    );

    useEffect(() => {
        sessionStorage.setItem('provider', providerId)
    }, [providerId]);

    return (
        <div>
            <MenuBar providerId={providerId} onChange={newProviderId => setProviderId(newProviderId)}/>
            <main className={styles.content}>

                <h2>Access Email on Behalf of Authenticated User</h2>

                <h3>Send Email</h3>
                <div className="inner-container">
                    <EmailForm/>
                </div>

                <h3>Retrieve Email</h3>
                <div className="inner-container">
                    <EmailList/>
                </div>

            </main>
        </div>
    );
};

export default HomePage;
