import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import dateFormat from 'date-fns/format';
import Immutable from 'immutable';

export class DateFormatter extends Component {
    render() {
        const date = new Date(this.props.children || 'invalid-date');

        return !isNaN(date.getTime())
            ? (<span>{dateFormat(date, this.props.format || this.props.userFormat)}</span>)
            : false;
    }
}

DateFormatter.propTypes = {
    children: PropTypes.string,
    format: PropTypes.string,
    userFormat: PropTypes.string
};

export default connect(
    ({login}) => {
        if (!(login instanceof Immutable.Map)) {
            login = Immutable.fromJS(login);
        }

        return {
            userFormat: login.getIn(['result', 'localisation', 'dateFormat']) || 'YYYY-MM-DD'
        };
    }
)(DateFormatter);
