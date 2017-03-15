import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import dateFormat from 'date-fns/format';

export class DateFormatter extends Component {
    render() {
        if (this.props.children && this.props.children !== '') {
            let formated = dateFormat(new Date(this.props.children), this.props.format || this.props.userFormat);
            return (<span>{formated}</span>);
        }
        return false;
    }
};

DateFormatter.propTypes = {
    children: PropTypes.string,
    format: PropTypes.string,
    userFormat: PropTypes.string
};

export default connect(
    ({login}) => ({
        userFormat: login.get('result') && login.getIn(['result', 'localisation', 'dateFormat']) ? login.getIn(['result', 'localisation', 'dateFormat']) : 'YYYY-MM-DD'
    })
)(DateFormatter);
