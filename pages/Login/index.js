import PropTypes from 'prop-types';
import React from 'react';
import {Map} from 'immutable';
import { connect } from 'react-redux';
import style from './style.css';
import { Container, Row, Col } from 'reactstrap';
import Box from '../../components/Box';
import { identityCheck, setLoginData } from './actions';
import {UserName, Title, SubmitButton, ErrorSection, Password} from './partials';

class Login extends React.Component {
    static propTypes = {
        identityCheck: PropTypes.func,
        setLoginData: PropTypes.func,
        loginData: PropTypes.object,
        login: PropTypes.object
    }

    static contextTypes = {
        router: PropTypes.object,
        implementationStyle: PropTypes.object,
        mainUrl: PropTypes.string,
        initialLoginFields: PropTypes.object
    }

    static defaultProps = {
        loginData: Map(),
        login: Map()
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.loginData.get('changeId') !== nextProps.loginData.get('changeId')) {
            this.props.identityCheck(nextProps.loginData.get('data').toJS());
        } else if (!this.props.login.get('authenticated') && nextProps.login.get('authenticated') && nextProps.login.get('reqState') === 'finished') {
            this.context.router.history.push(this.context.mainUrl); // TODO give correct route
        }
    }

    getStyle(name) {
        return (this.context.implementationStyle && this.context.implementationStyle[name]) || style[name];
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.refs.username) {
            this.props.setLoginData({key: 'username', value: this.refs.username.getValue()});
        }
        if (this.refs.password) {
            this.props.setLoginData({key: 'password', value: this.refs.password.getValue()});
        }
    }

    getLoginCourse() {
        const loginCourse = this.props.login.get('loginCourse');
        const inputs = {};
        let title = 'Login';

        if (loginCourse) {
            const corseType = loginCourse.get('type').get(2);
            inputs[corseType] = 1;
            switch (corseType) {
                case 'password':
                    title = 'Connect with password';
                    inputs.username = 1;
                    break;
            }
        }
        if (Object.keys(inputs).length === 0) {
            if (this.context.initialLoginFields) {
                const fields = this.context.initialLoginFields;
                if (fields.title) {
                    title = fields.title;
                }
                if (fields.inputs) {
                    Object.assign(inputs, fields.inputs);
                }
            } else {
                inputs.username = 1;
            }
        }
        return {inputs, title};
    }

    renderLoginBody(step) {
        let err;
        if (this.props.login.get('loginResultId')) {
            err = this.props.login.get('error');
        }
        const loginCourse = this.getLoginCourse();
        const {loginData} = this.props;

        return (
            <div>
                {err && <ErrorSection text={err.get('message')} />}
                <Title title={loginCourse.title} />
                {loginCourse && loginCourse.inputs.username && <UserName ref='username' value={loginData && loginData.get('data').get('username')} />}
                {loginCourse && loginCourse.inputs.password && <Password ref='password' />}
                <SubmitButton title='Next' />
            </div>
        );
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <Container>
                    <Row>
                        <Col xs={{size: 6, push: 3}}>
                            <Row className={this.getStyle('loginPageLogo')} />
                            <Row>
                                <Box>
                                    <Row className='row-reset'>
                                        <Col md={{size: 8, offset: 2}} className='col-reset' style={{textAlign: 'center'}}>
                                            {this.renderLoginBody()}
                                        </Col>
                                    </Row>
                                </Box>
                            </Row>
                            <Row className={this.getStyle('footerLogoContainer')} />
                        </Col>
                    </Row>
                </Container>
            </form>
        );
    }
};

export default connect(
    (state, ownProps) => ({
        login: state.login,
        loginData: state.loginData
    }),
    {identityCheck, setLoginData}
)(Login);
