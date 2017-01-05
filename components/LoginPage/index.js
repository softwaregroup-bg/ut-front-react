import React from 'react';
import LoginForm from '../../containers/LoginForm';
import { getClass } from '../../utils/helpers';
import styles from './styles.css';

const LoginPage = () => (
    <div className={styles.loginContainer}>
        <div className={getClass(styles, 'loginLogo loginPageHeader')} />
        <LoginForm />
        <div className={getClass(styles, 'loginLogo loginPageFooter')} />
    </div>
);

export default LoginPage;
