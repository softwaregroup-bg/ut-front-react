import React from 'react';
import LoginForm from '../../containers/LoginForm';
import { getClass } from '../../utils/helpers';
import styles from './styles.css';

const LoginPage = () => {
    let bottomLogoClasses = 'loginLogo loginPageFooter';
    if (window.location.href.indexOf('usp.html') !== -1) {
        bottomLogoClasses = 'loginLogo loginPageFooterUSP';
    }
    return (
        <div className={styles.loginContainer}>
            <div className={getClass(styles, 'loginLogo loginPageHeader')} />
            <LoginForm />
            <div className={getClass(styles, bottomLogoClasses)} />
        </div>
    );
};

export default LoginPage;
