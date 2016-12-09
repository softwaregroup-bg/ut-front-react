import React, { Component } from 'react';
import LoginForm from '../../containers/LoginForm';
import { getClass } from '../../utils/helpers';
import styles from './styles.css';

export default class StandardLogin extends Component {
    // this is done in order to center the form responsively
    componentWillMount() {
        document.body.className += ' ' + styles.loginOpen;

        document.getElementsByTagName('html')[0].style.height = '100%';

        document.getElementById('utApp').style.height = '100%';
    }

    componentWillUnmount() {
        document.body.className = 'ut5';

        document.getElementsByTagName('html')[0].style = '';

        document.getElementById('utApp').style.height = '';
    }

    render() {
        return (
            <div className={styles.loginContainer}>
                <div className={getClass(styles, 'loginLogo loginPageHeader')} />
                <LoginForm />
                <div className={getClass(styles, 'loginLogo loginPageFooter')} />
            </div>
        );
    };
}
