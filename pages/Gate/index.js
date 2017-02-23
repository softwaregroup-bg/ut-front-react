import React, { PropTypes } from 'react';
import {Map} from 'immutable';
import { connect } from 'react-redux';
import {cookieCheck, logout} from '../../containers/LoginForm/actions';
import Text from '../../components/Text';
import {fetchTranslations} from './actions';
import {translate, money, numberFormat, df, checkPermission, setPermissions} from '../../helpers.js';
import Loader from '../../components/Loader';

const Gate = React.createClass({
    propTypes: {
        login: PropTypes.object,
        checkIdentity: PropTypes.func,
        logout: PropTypes.func,
        children: PropTypes.object,
        fetchTranslations: PropTypes.func,
        gate: PropTypes.object
    },
    contextTypes: {
        router: PropTypes.object
    },
    getChildContext() {
        return {
            translate: translate(this.props),
            money,
            dateFormat: df(this.props),
            numberFormat: numberFormat(this.props),
            checkPermission: checkPermission
        };
    },
    defaultProps: {
        gate: Map(),
        login: Map()
    },
    componentWillReceiveProps(newProps) {
        if (newProps.login.get('reqState') === 'finished' && (newProps.login.get('cookieCheckResultId') !== this.props.login.get('cookieCheckResultId'))) {
            if (!newProps.login.get('authenticated')) {
                this.context.router.push('/login');
            } else if (!newProps.gate.get('reqState')) {
                setPermissions(newProps.login.getIn(['result', 'permission.get']).toJS());
                this.props.fetchTranslations({
                    languageId: newProps.login.getIn(['result', 'language', 'languageId']),
                    itemTypeName: 'text',
                    keyValue: true,
                    isEnabled: true,
                    pageSize: 10000
                });
            }
        } else if (newProps.login.get('logOutResultId') !== this.props.login.get('logOutResultId')) {
            this.props.checkIdentity();
        } else if (newProps.gate.get('forceLogOut') && this.props.gate.get('forceLogOut') === false) {
            this.context.router.push('/login');
            this.props.logout();
        }
    },
    componentWillMount() {
        this.props.checkIdentity();
    },
    render() {
        if (this.props.login.get('result') && this.props.login.get('authenticated') && this.props.gate.get('loaded')) {
            return this.props.children;
        } else {
            return <Loader />
        }
    }
});

const mapStateToProps = (state, ownProps) => ({login: state.login, gate: state.gate});

export default connect(
    mapStateToProps,
    {
        checkIdentity: cookieCheck,
        fetchTranslations: fetchTranslations,
        logout
    }
)(Gate);

Gate.childContextTypes = {
    translate: PropTypes.func,
    money: PropTypes.func,
    dateFormat: PropTypes.func,
    numberFormat: PropTypes.func,
    checkPermission: PropTypes.func
};
