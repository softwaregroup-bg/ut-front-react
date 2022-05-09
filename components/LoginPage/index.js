import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import LoginForm from '../../containers/LoginForm';
import { getClass } from '../../utils/helpers';
import styles from './styles.css';

class LoginPage extends Component {
    render() {
        return (
            <div className={styles.loginContainer}>
                <div className={classnames(this.context.implementationStyle.loginLogoHeader, getClass(styles, 'loginLogo loginPageHeader'))} />
                <LoginForm routerParams={this.props.match && this.props.match.params} history={this.props.history} />
                <div className={classnames(this.context.implementationStyle.loginLogoFooter, getClass(styles, 'loginLogo loginPageFooter'))} />
            </div>
        );
    }
}
LoginPage.propTypes = {
    match: PropTypes.object,
    history: PropTypes.history
};

LoginPage.contextTypes = {
    implementationStyle: PropTypes.object
};

export default LoginPage;
