import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import Text from '../../components/Text';
import { cookieCheck, logout } from '../LoginForm/actions.js';
import { fetchTranslations } from './actions';
import { translate, money, df as dateFormat, numberFormat, checkPermission, setPermissions } from './helpers';

class Gate extends Component {
    getChildContext() {
        debugger;
        return {
            translate: translate(this.props),
            dateFormat: dateFormat(this.props),
            numberFormat: numberFormat(this.props),
            checkPermission,
            money
        }
    }

    componentWillMount() {
        let { cookieCheck } = this.props;

        cookieCheck();
    }

    componentWillReceiveProps(nextProps) {
        let { login, fetchTranslations, cookieCheck, logout } =  this.props;

        // TODO: handle the other cases
        if(!login.get('result') && nextProps.login.get('result') && nextProps.login.get('authenticated')) {
            setPermissions(nextProps.login.getIn(['result', 'permission.get']).toJS());

            fetchTranslations({
                languageId: nextProps.login.getIn(['result', 'language', 'languageId']),
                itemTypeName: 'text',
                keyValue: true,
                isEnabled: true,
                pageSize: 10000
            });
        }
    }

    render() {
        return (
            <div>
                { this.props.gate.get('loaded') ? this.props.children : <Text>Please wait...</Text> }
            </div>
        );
    }
}

export default connect(
    ({ login, gate }) => {
        return {
            login,
            gate
        }
    },
    { cookieCheck, fetchTranslations, logout }
)(Gate);

Gate.propTypes = {
    login: PropTypes.object,
    gate: PropTypes.object,
    cookieCheck: PropTypes.func,
    fetchTranslations: PropTypes.func,
    logout: PropTypes.func
};

Gate.defaultProps = {
    gate: Map(),
    login: Map()
};

Gate.childContextTypes = {
    translate: PropTypes.func,
    money: PropTypes.func,
    dateFormat: PropTypes.func,
    numberFormat: PropTypes.func,
    checkPermission: PropTypes.func
};
