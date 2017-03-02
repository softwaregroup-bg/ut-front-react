
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog';
import { formatIso } from 'material-ui/DatePicker/dateUtils';
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog';
import { formatTime } from 'material-ui/TimePicker/timeUtils';

import style from './style.css';

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

    componentWillMount() {
        this.setState({date: this.props.defaultValue});
    }

    componentWillReceiveProps(newProps) {
        this.setState({date: newProps.defaultValue});
    }
    handleOpen(ref) {
        return () => {
            this.refs[ref].show();
        };
    }
    formatDate(date) {
        if (!date || isNaN(date.valueOf())) {
            return '';
        }

        let { locale, dateFormat } = this.props;
        if (locale) {
            return date.toLocaleDateString(locale, dateFormat);
        }

        return formatIso(date);
    }
    formatTime(time) {
        if (!time || isNaN(time.valueOf())) {
            return '';
        }

        let { locale, timeFormat } = this.props;
        if (locale) {
            return time.toLocaleTimeString(locale, timeFormat);
        }
        let format = timeFormat && timeFormat.hour12 ? 'ampm' : '24hr';

        return formatTime(time, format);
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
                        newDate.setSeconds(0);
                    } else {
                        newDate.setFullYear(date.getFullYear());
                        newDate.setMonth(date.getMonth());
                        newDate.setDate(date.getDate());
                    }
                }
            } else {
                return;
            }

            newDate = (newDate && !isNaN(newDate.valueOf())) ? newDate : null;

            this.setState({
                date: newDate
            });
            if (this.props.onChange) {
                this.props.onChange({value: newDate});
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
        let { timeFormat } = this.props;
        let { date } = this.state;

        let outerWrapStyle = this.props.label ? style.outerWrap : style.outerWrapNoLabel;
        let boldLabelStyle = this.props.boldLabel ? style.boldLabel : '';

        let format = timeFormat && timeFormat.hour12 ? 'ampm' : '24hr';

        return (
            <div className={outerWrapStyle}>
                 {this.props.label ? (<span className={classnames(style.labelWrap, boldLabelStyle)}>{this.props.label}</span>) : ''}
                <div className={style.innerWrap}>
                    <div className={style.inputWrap}>
                        <input value={date ? this.formatDate(date) : ''} type='text' onChange={noop} onKeyUp={this.handleKeyPress('date')} />
                        <button className={style.dateButton} onClick={this.handleOpen('date')} />
                    </div>
                    <div className={style.inputWrap}>
                        <input value={date ? this.formatTime(date) : ''} type='text' onChange={noop} onKeyUp={this.handleKeyPress('time')} />
                        <button className={style.timeButton} onClick={this.handleOpen('time')} />
                    </div>
                </div>
                <DatePickerDialog
                  cancelLabel={this.props.cancelLabel}
                  okLabel={this.props.okLabel}
                  container={this.props.container}
                  initialDate={date || new Date()}
                  mode={this.props.mode}
                  onAccept={this.handleAccept('date')}
                  firstDayOfWeek={this.props.firstDayOfWeek}
                  ref='date' />
                <TimePickerDialog
                  cancelLabel={this.props.cancelLabel}
                  okLabel={this.props.okLabel}
                  initialTime={date || new Date()}
                  mode={this.props.mode}
                  onAccept={this.handleAccept('time')}
                  firstDayOfWeek={this.props.firstDayOfWeek}
                  format={format}
                  ref='time' />
            </div>
        );
    }
}

DatePickerBetween.defaultProps = {
    firstDayOfWeek: 1,
    mode: 'landscape',
    container: 'dialog',
    timeFormat: '24hr'
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
    timeFormat: PropTypes.object,
    dateFormat: PropTypes.object,
    onChange: PropTypes.func,
    boldLabel: PropTypes.bool
};

DatePickerBetween.contextTypes = {
    implementationStyle: PropTypes.object
};
