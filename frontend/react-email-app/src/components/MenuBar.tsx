import React, {useState} from 'react';
import styles from './MenuBar.module.css';
import AuthButton from "./AuthButton";
import {getProvider, getProviders} from "../services/providerService";

const MenuBar = (props: { providerId: string, onChange: (newProvider: string) => void }) => {
    const [providerDropdownVisible, setProviderDropdownVisible] = useState(false);
    const toggleProviderDropdown = () => setProviderDropdownVisible(!providerDropdownVisible);

    const handleProviderSelect = (newProviderId: string) => {
        props.onChange(newProviderId);
        setProviderDropdownVisible(false);
    };

    const handleAbout = () => {
        alert(`PoC of using OAuth2 for authorizing delegation of access to email providers.`);
    }

    const handleProfileInfo = () => {
        // TODO - implement the implied functionality
        alert(`TBD - currently we don't have a generalized mechanism (across all Service Providers) `
            + `to retrieve the state, or the credentials of the authenticated user`);
    }

    return (
        <nav className={styles.menu_bar}>
            <div className={styles.container}>
                <span className={styles.left}>
                    <a href="/" className={styles.logo}>
                        <img src="/oauth2emailbridge-logo.png" alt="OAuth2 Email Bridge" />
                    </a>
                    <ul className={styles.nav_links}>
                        <li onClick={handleAbout} className={styles.dropdown_trigger}>About</li>
                        <li onClick={toggleProviderDropdown} className={styles.dropdown_trigger}>
                            Provider: {getProvider(props.providerId).name}
                            {providerDropdownVisible && (
                                <ul className={styles.dropdown}>{
                                    getProviders().map(provider => {
                                        return <li onClick={() => handleProviderSelect(provider.id)}>
                                            {provider.name}
                                        </li>
                                    })
                                }</ul>
                            )}
                        </li>
                    </ul>
                </span>
                <span className={styles.right}>
                    <AuthButton className={styles.login_button} providerId={props.providerId} />
                    <button onClick={handleProfileInfo} className={styles.profile_button}>
                        <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                          <image href="user-profile-icon.svg" height="20" width="20" />
                        </svg>
                    </button>
                </span>
            </div>
        </nav>
    );
};

export default MenuBar;
