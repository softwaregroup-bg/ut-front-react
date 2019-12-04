import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import LoginForm from '../../containers/LoginForm';
import { getClass } from '../../utils/helpers';
import styles from './styles.css';

class LoginPage extends Component {
    render() {
        return (
            <div className={styles.loginContainer}>
                <div className={classnames(this.context.implementationStyle.loginLogoHeader, getClass(styles, 'loginLogo loginPageHeader'))} />
                <LoginForm routerParams={this.props.params} />
                <div className={classnames(this.context.implementationStyle.loginLogoFooter, getClass(styles, 'loginLogo loginPageFooter'))} />
            </div>
        );
    }
}
LoginPage.propTypes = {
    params: PropTypes.object
};

LoginPage.contextTypes = {
    implementationStyle: PropTypes.object
};

export default LoginPage;
