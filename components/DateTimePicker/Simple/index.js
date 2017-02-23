
import React, { Component, PropTypes } from 'react';
// import classnames from 'classnames';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog';
import {dateTimeFormat, formatIso} from 'material-ui/DatePicker/dateUtils';
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog';
import {formatTime} from 'material-ui/TimePicker/timeUtils';

const noop = () => {};

export default class DatePickerBetween extends Component {
    constructor(props) {
        super(props);
        this.state = props.defaultValue;
        this.handleAccept = this.handleAccept.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.formatDate = this.formatDate.bind(this);
        this.formatTime = this.formatTime.bind(this);
        this.getContextStyles = this.getContextStyles.bind(this);

        this.state = {
            date: null
        };
    }
    componentWillReceiveProps(newProps) {
        this.setState({date: newProps.defaultValue});
    }
    handleOpen(ref) {
        return () => {
            this.refs[`${ref}DialogWindow`].show();
        };
    }
    formatDate(date) {
        if (!date || isNaN(date.valueOf())) {
            return '';
        }
        if (this.props.locale) {
            const DateTimeFormat = this.props.DateTimeFormat || dateTimeFormat;
            return new DateTimeFormat(this.props.locale, {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric'
            }).format(date);
        } else {
            return formatIso(date);
        }
    }
    formatTime(time) {
        if (!time || isNaN(time.valueOf())) {
            return '';
        }
        return formatTime(time, this.props.timeFormat);
    }
    handleAccept(ref) {
        return (d) => {
            let {date} = this.state;
            let newDate = new Date(d);
            if (ref === 'date') {
                if (date && !isNaN(date.valueOf())) {
                    if (isNaN(newDate.valueOf())) {
                        newDate = null;
                    } else {
                        newDate.setHours(date.getHours());
                        newDate.setMinutes(date.getMinutes());
                    }
                }
            } else if (ref === 'time') {
                if (date && !isNaN(date.valueOf())) {
                    if (isNaN(newDate.valueOf())) {
                        newDate = date;
                        newDate.setHours(0);
                        newDate.setMinutes(0);
                    } else {
                        newDate.setFullYear(date.getFullYear());
                        newDate.setMonth(date.getMonth());
                        newDate.setDate(date.getDate());
                    }
                }
            } else {
                return;
            }
            this.setState({
                date: newDate && !isNaN(newDate.valueOf()) ? newDate : null
            });
            if (this.props.onChange) {
                this.props.onChange({key: ref, value: date});
            }
        };
    }
    handleKeyPress(ref) {
        return () => {
            this.handleAccept(ref)(undefined);
        };
    }
    getContextStyles(className) {
        if (this.context.implementationStyle[className]) {
            return this.context.implementationStyle[className];
        }
        return null;
    }
    render() {
        return (
            <div>
                {/* {this.props.label ? (<span className={classnames(style.label)}>{this.props.label}</span>) : ''} */}
                <div>
                    <div>
                        <input value={this.state.date ? this.formatDate(this.state.date) : ''} type='text' onChange={noop} onKeyUp={this.handleKeyPress('date')} />
                        <button onClick={this.handleOpen('date')} />
                    </div>
                    <div>
                        <input value={this.state.date ? this.formatTime(this.state.date) : ''} type='text' onChange={noop} onKeyUp={this.handleKeyPress('time')} />
                        <button onClick={this.handleOpen('time')} />
                    </div>
                </div>
                <DatePickerDialog
                  DateTimeFormat={this.props.DateTimeFormat}
                  cancelLabel={this.props.cancelLabel}
                  okLabel={this.props.okLabel}
                  container={this.props.container}
                  initialDate={this.state.date || new Date()}
                  mode={this.props.mode}
                  onAccept={this.handleAccept('date')}
                  firstDayOfWeek={this.props.firstDayOfWeek}
                  ref='dateDialogWindow' />
                <TimePickerDialog
                  cancelLabel={this.props.cancelLabel}
                  okLabel={this.props.okLabel}
                  initialTime={this.state.date || new Date()}
                  mode={this.props.mode}
                  onAccept={this.handleAccept('time')}
                  firstDayOfWeek={this.props.firstDayOfWeek}
                  format={this.props.timeFormat}
                  ref='timeDialogWindow' />
            </div>
        );
    }
}

DatePickerBetween.defaultProps = {
    firstDayOfWeek: 1,
    mode: 'landscape',
    container: 'dialog',
    timeFormat: '24hr',
    locale: 'en-GB'
};
DatePickerBetween.propTypes = {
    defaultValue: PropTypes.object,
    locale: PropTypes.string,
    okLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    cancelLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    firstDayOfWeek: PropTypes.number,
    container: PropTypes.oneOf(['dialog', 'inline']),
    mode: PropTypes.oneOf(['landscape', 'portrait']),
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    DateTimeFormat: PropTypes.func,
    timeFormat: PropTypes.oneOf(['ampm', '24hr']),
    onChange: PropTypes.func
};

DatePickerBetween.contextTypes = {
    implementationStyle: PropTypes.object
};
