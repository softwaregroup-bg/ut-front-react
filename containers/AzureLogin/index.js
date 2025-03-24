import React, { Component } from 'react';
import style from './style.css';

class AzureLogin extends Component {
    onButtonClick() {
        const url = `${window.location.origin}/rpc/login/oidc/initiate/azure`;
        window.location = url;
    }

    render() {
        return (
            <button className={style.azureLoginbButton} onClick={this.onButtonClick}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 21 21"
                    className="microsoftLogo"
                >
                    {/* Microsoft logo - four squares */}
                    <rect x="1" y="1" width="9" height="9" fill="#ffffff" />
                    <rect x="11" y="1" width="9" height="9" fill="#ffffff" />
                    <rect x="1" y="11" width="9" height="9" fill="#ffffff" />
                    <rect x="11" y="11" width="9" height="9" fill="#ffffff" />
                </svg>
                Sign in with Azure AD
            </button>
        );
    }
}

export default AzureLogin;
