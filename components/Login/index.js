import PropTypes from 'prop-types';
import React from 'react';
import Username from './Username';
import Password from './Password';
import Otp from './Otp';
import Bio from './Bio';

class Login extends React.Component {
    static propTypes = {
        loginInProgress: PropTypes.bool,
        loginRequest: PropTypes.func,
        errorWindowToggle: PropTypes.func,
        prefetchWindowClose: PropTypes.func,
        enroll: PropTypes.func,
        enrollVerify: PropTypes.func,
        switchTo: PropTypes.func,
        response: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
        requestMethod: PropTypes.string,
        loginType: PropTypes.string,
        reqState: PropTypes.string,
        values: PropTypes.object,
        loginPolicy: PropTypes.array,
        captured: PropTypes.bool
    };

    loginWithUserPass = () => {
        this.props.loginRequest({
            username: this.props.values.username,
            password: this.refs.password.getValue()
        });
    };

    loginWithUser = () => {
        this.props.loginRequest({
            username: this.refs.username.getValue()
        });
    };

    loginWithOtp = () => {
        this.props.loginRequest({
            username: this.props.values.username,
            password: this.props.values.password,
            otp: this.refs.otp.getValue()
        });
    };

    loginWithBio = () => {
        this.props.loginRequest({
            username: this.refs.username.getValue(),
            bio: this.refs.password.getValue()
        });
    };

    switchTo = (to, transfer) => {
        return () => {
            if ((to === 'bio' || to === 'otp' || to === 'password') && this.refs.username.getValue() === '') {
                return this.props.errorWindowToggle({message: 'Username is required'});
            }
            return this.props.switchTo(to, transfer);
        };
    };

    enroll = (params) => {
        this.props.enroll(params);
    };

    shouldComponentUpdate(nextProps) {
        if (!nextProps.loginInProgress) {
            if (nextProps.loginPolicy && nextProps.loginPolicy.length > 0) { // login policy just returned
                if (this.props.loginType === nextProps.loginType) {
                    let nextStep = 1;
                    let val = {};
                    if (nextProps.loginType) {
                        const currentStep = nextProps.loginPolicy.filter((el) => (el.type === nextProps.loginType)).reduce((cur, el) => (el), {});
                        nextStep = nextProps.loginPolicy.filter((el) => (el.step > currentStep.step)).reduce((cur, el) => (el.step), 0);
                        val[currentStep.type] = this.refs[currentStep.type].getValue(currentStep.type);
                    } else {
                        val = {username: this.refs.username.getValue()};
                    }
                    if (nextStep) {
                        return this.props.switchTo(
                            nextProps.loginPolicy.filter((el) => (el.step === nextStep)).reduce((cur, el) => (el.type), ''),
                            val
                        );
                    }
                }
            }
        }
        // if (nextProps.loginType === 'bio') {
        //     if (!nextProps.captured) {
        //         if (typeof (nextProps.reqState) === 'undefined') {
        //             this.enroll();
        //         } else if (nextProps.reqState === 'finished') {
        //             if (nextProps.response.code === '-54') {
        //                 if (nextProps.bioReenroll < 3) {
        //                     this.enroll({prefetchWindowText: 'Enroll timeout, please enroll your finger!'});
        //                 } else {
        //                     this.props.prefetchWindowClose();
        //                     this.props.switchTo('userpass');
        //                 }
        //             } else {
        //                 this.props.prefetchWindowClose();
        //                 this.props.errorWindowToggle({message: JSON.stringify(nextProps.response)});
        //             }
        //         }
        //     } else if (!nextProps.loginInProgress && nextProps.captured) {
        //         if (!nextProps.error && !nextProps.identity) {
        //             this.props.enrollVerify({
        //                 fingerprints: [
        //                     {data: nextProps.response.fingerprint}
        //                 ],
        //                 username: nextProps.values.username
        //             });
        //         } else if (nextProps.error) {
        //             this.props.errorWindowToggle({message: nextProps.error.message});
        //             this.props.switchTo('userpass');
        //         }
        //         return false;
        //     }
        // }
        return true;
    }

    passwordLogIn = (e) => {
        if ((!e || !e.keyCode || e.keyCode === 13) && (this.refs.password.getValue().length > 0)) {
            this.loginWithUserPass();
        }
    };

    userLogIn = (e) => {
        if ((!e || !e.keyCode || e.keyCode === 13) && (this.refs.username.getValue().length > 0)) {
            this.loginWithUser();
        }
    };

    otpLogIn = (e) => {
        if ((!e || !e.keyCode || e.keyCode === 13) && (this.refs.otp.getValue().length > 0)) {
            this.loginWithOtp();
        }
    };

    render() {
        let r;
        switch (this.props.loginType) {
            case 'bio':
                r = <Bio />;
                break;
            case 'otp':
                r = <Otp submit={this.otpLogIn} ref='otp' />;
                break;
            case 'password':
                r = <Password submit={this.passwordLogIn} ref='password' />;
                break;
            default:
                r = <Username submit={this.userLogIn} ref='username' />;
        }

        return r;
    }
}

export default Login;
