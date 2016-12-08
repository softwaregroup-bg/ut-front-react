import React, { Component } from 'react';
import LoginForm from '../../containers/LoginForm';
import styles from './styles.css';

export default class StandardLogin extends Component {
    componentWillMount() {
        document.body.className += ' ' + styles.loginOpen;
    }

    render() {
        return (
            <div className={styles.loginContainer}>
                <div className='header'>Header and logo</div>
                <LoginForm />
                <div className='footer'>Footer and logo</div>
            </div>
        );
    };
}
