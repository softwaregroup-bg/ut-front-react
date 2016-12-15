import React, { PropTypes } from 'react';
import {Map} from 'immutable';
import { connect } from 'react-redux';
import dateFormat from 'date-fns/format';
import {cookieCheck, logout} from '../Login/actions';
import Text from '../../components/Text';
import {fetchTranslations} from './actions';

var checkPermission = function() {
    return false;
};

var setPermissions = function(permissions) {
    var cache = {};
    var regExp = new RegExp(permissions.map(function(permission) {
        return ['^', permission.actionId.replace('%', '(.+?)'), '$'].join('');
    }).join('|'));
    checkPermission = function(action) {
        if (cache[action] === undefined) {
            cache[action] = regExp.test(action);
        }
        return cache[action];
    };
};

var translate = (props) => (text, language) => {
    if (!props.gate.getIn(['texts', text])) {
        return text;
    }
    return props.gate.getIn(['texts', text]);
};

var money = (amount, currency, locale) => {
    if (!currency) currency = 'EUR';
    if (!locale) locale = 'en-UK';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    }).format(amount);
};

var df = (props) => (date, format) => {
    if (!format) format = props.login.get('result') && props.login.getIn(['result', 'localisation', 'dateFormat']) || 'YYYY-MM-DD';
    return dateFormat(new Date(date), format);
};

var numberFormat = (props) => (num, format) => {
    if (!format) format = props.login.get('result') && props.login.getIn(['result', 'localisation', 'numberFormat']) || '2|.|';
    var parts = format.split('|');
    if (parts.length !== 3) return num;
    num = parseInt(num).toFixed(parseInt(parts[0]));
    if (parts[1]) num = num.toString().replace('.', parts[1]);
    num = num.toString().replace(/\B(?=(\d{3})+\b)/g, parts[2]);
    return num;
};

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
            return <div><Text>Please wait...</Text></div>;
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
