import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Text from '../Text';
/* global atob */
class SsoPage extends Component {
    constructor(props) {
        super(props);
        this.onLoad = this.onLoad.bind(this);
        this.getElement = this.getElement.bind(this);
    }

    onLoad(ssoOrigin, jwtData, originRedirectTo) {
        return function(e) {
            if (e.target && e.target.contentWindow && e.target.contentWindow.postMessage) {
                e.target.contentWindow.postMessage(jwtData.value, ssoOrigin);
                setTimeout(() => {
                    window.location = originRedirectTo;
                }, 2000);
            }
        };
    }

    getElement() {
        const {params: {ssoOrigin, appId}} = this.props.match;
        let result;

        if (!ssoOrigin || !appId || ssoOrigin === 'login' || appId === 'login') {
            result = (
                <div>
                    <h1 style={{textAlign: 'center'}}><Text>Incorrect url params</Text>...</h1>
                </div>
            );
        } else {
            // ssoOrigin should looks like: http://abc:121/redirect/to/here
            const originRedirectTo = atob(ssoOrigin);
            const originHostArr = originRedirectTo.split('//');
            const prefix = originHostArr.shift();
            const sufix = originHostArr.shift().split('/').shift();
            const ssoOriginUrl = `${prefix}//${sufix}/sso/client`;

            result = (
                <div>
                    <h1 style={{textAlign: 'center'}}><Text>Authenticating please wait</Text>...</h1>
                    <iframe style={{width: 0, height: 0, display: 'none'}} onLoad={this.onLoad(ssoOriginUrl, this.props.loginData.jwt, originRedirectTo)} src={ssoOriginUrl}>
                        <p><Text>Your browser does not support iframes.</Text></p>
                    </iframe>
                </div>
            );
        }
        return result;
    }

    render() {
        return (
            (this.props.loginData && this.props.loginData.jwt && this.getElement()) ||
            false
        );
    }
}
SsoPage.propTypes = {
    match: PropTypes.object.isRequired,
    loginData: PropTypes.object
};

SsoPage.contextTypes = {
    implementationStyle: PropTypes.object
};

export default connect(
    ({ login }) => {
        return {
            loginData: login.get('result').toJS()
        };
    },
    {}
)(SsoPage);
