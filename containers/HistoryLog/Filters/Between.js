import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Between from '../../../components/DateTimePicker/Between';
import { changeFilter, updateFilterErrors } from '../actions';
import Popup from '../../../components/Popup';
import style from '../style.css';
export class DateTimeBetween extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleTouchTap = this.handleTouchTap.bind(this);
        this.state = { pop: true };
    }
    handleChange(record) {
        this.props.changeFilter({'key': record.key + 'Date', value: record.value});
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ pop: true });
    }
    handleTransform(time, timeFormat, locale) {
        if (timeFormat === 'HH:mm' && time) {
            var hours = time.getHours().toString();
            var mins = time.getMinutes().toString();
            if (hours.length < 2) hours = '0' + hours;
            if (mins.length < 2) mins = '0' + mins;
            return hours + ':' + mins;
        }
    }
    handleTouchTap(record) {
        this.setState({ pop: false });
        this.props.updateFilterErrors({value: this.props.errors});
    }
    render() {
        let {from, to, errors} = this.props;
        return (
            <div>
              <Between
                labelFrom={'From'}
                labelTo={'To'}
                timeType={'timeDropdown'}
                onChange={this.handleChange}
                transformTime={this.handleTransform}
                defaultValue={{'from': from, 'to': to}}
              />
            <Popup
              isOpen={errors.get('error') ? this.state.pop : false}
              header={{text: 'Invalid Time Period', className: style.popupContentWrap}}
              footer={{
                  actionButtons: [{
                      label: 'Close',
                      styleType: 'secondaryDialog',
                      onClick: this.handleTouchTap
                  }],
                  className: style.popupContentWrap
              }}
              closePopup={this.handleTouchTap}
              contentClassName={style.popupContent}
              >
                <div>Please enter a valid time period: {errors.get('error')}</div>
            </Popup>
            </div>
        );
    }
}

DateTimeBetween.propTypes = {
    changeFilter: PropTypes.func.isRequired,
    from: PropTypes.any,
    to: PropTypes.any,
    errors: PropTypes.object,
    updateFilterErrors: PropTypes.func
};
export default connect(
    (state) => {
        let { objectId, objectName } = state.historyContainer.get('config').toJS();
        return {
            from: state.historyContainer.getIn([objectName, objectId, 'filters', 'fromDate']),
            to: state.historyContainer.getIn([objectName, objectId, 'filters', 'toDate']),
            errors: state.historyContainer.getIn([objectName, objectId, 'errors'])
        };
    },
    {changeFilter, updateFilterErrors}
)(DateTimeBetween);
