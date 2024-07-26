import React, {EventHandler, useState} from 'react';
import styles from './MenuBar.module.css';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import AuthButton from "./AuthButton";
import {getProvider, getProviders} from "../services/providerService";

const MenuBar = (props: { providerId: string, onChange: (newProvider: string) => void }) => {
    const [providerDropdownVisible, setProviderDropdownVisible] = useState(false);
    const toggleProviderDropdown = () => setProviderDropdownVisible(!providerDropdownVisible);

    const [aboutDropdownVisible, setAboutDropdownVisible] = useState(false);
    const toggleAboutDropdown = () => setAboutDropdownVisible(!providerDropdownVisible);

    const handleProviderSelect = (newProviderId: string) => {
        props.onChange(newProviderId);
        setProviderDropdownVisible(false);
    };

    return (
        <nav className={styles.menu_bar}>
            <div className={styles.container}>
                <span className={styles.left}>
                    <a href="/" className={styles.logo}>
                        <img src="oauth2emailbridge-logo.png" alt="OAuth2 Email Bridge" />
                    </a>
                    <ul className={styles.nav_links}>
                        <li onClick={toggleAboutDropdown}>
                            About
                            {aboutDropdownVisible && (
                                <p>PoC of using OAuth2 for authorizing delegation of access to email providers.</p>
                            )}
                        </li>
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
                    <UnauthenticatedTemplate>
                        <AuthButton className={styles.login_button} providerId={props.providerId} />
                    </UnauthenticatedTemplate>
                    <AuthenticatedTemplate>
                        <button className={styles.profile_button}>
                            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                              <image href="user-profile-icon.svg" height="20" width="20" />
                            </svg>
                        </button>
                    </AuthenticatedTemplate>
                </span>
            </div>
        </nav>
    );
};

export default MenuBar;
