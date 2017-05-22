import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
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
        let {params: {ssoOrigin}} = this.props;
        // ssoOrigin should looks like: http://abc:121/redirect/to/here
        let originRedirectTo = atob(ssoOrigin);
        let originHostArr = originRedirectTo.split('//');
        let prefix = originHostArr.shift();
        let sufix = originHostArr.shift().split('/').shift();
        let ssoOriginUrl = `${prefix}//${sufix}/sso/client`;

        return (
            <div>
                <h1 style={{textAlign: 'center'}}>Authenticating please wait...</h1>
                <iframe style={{width: 0, height: 0, display: 'none'}} onLoad={this.onLoad(ssoOriginUrl, this.props.loginData.jwt, originRedirectTo)} src={ssoOriginUrl}>
                    <p>Your browser does not support iframes.</p>
                </iframe>
            </div>
        );
    }
    render() {
        return (
            (this.props.loginData && this.props.loginData.jwt && this.getElement()) ||
            false
        );
    }
}
SsoPage.propTypes = {
    params: PropTypes.object,
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
