
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

        let { locale, dateFormat, transformDate } = this.props;

        if (transformDate) {
            return transformDate(date, dateFormat, locale);
        }

        return formatIso(date);
    }
    formatTime(time) {
        if (!time || isNaN(time.valueOf())) {
            return '';
        }

        let { locale, timeFormat, transformTime } = this.props;

        if (transformTime) {
            return transformTime(time, timeFormat, locale);
        }

        return formatTime(time);
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
                        newDate.setSeconds(date.getSeconds());
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
        let { timeFormat, label, boldLabel, okLabel, cancelLabel, mode, firstDayOfWeek, container } = this.props;
        let { date } = this.state;

        let outerWrapStyle = label ? style.outerWrap : style.outerWrapNoLabel;
        let boldLabelStyle = boldLabel ? style.boldLabel : '';

        let format = timeFormat.indexOf('HH') > -1 ? '24hr' : 'ampm';

        let dateVal = (date)
            ? new Date(date)
            : new Date();

        return (
            <div className={outerWrapStyle}>
                 {label ? (<span className={classnames(style.labelWrap, boldLabelStyle)}>{label}</span>) : ''}
                <div className={style.innerWrap}>
                    <div className={style.inputWrap}>
                        <input value={date ? this.formatDate(dateVal) : ''} type='text' onChange={noop} onKeyUp={this.handleKeyPress('date')} />
                        <button className={style.dateButton} onClick={this.handleOpen('date')} />
                    </div>
                    <div className={style.inputWrap}>
                        <input value={date ? this.formatTime(dateVal) : ''} type='text' onChange={noop} onKeyUp={this.handleKeyPress('time')} />
                        <button className={style.timeButton} onClick={this.handleOpen('time')} />
                    </div>
                    <DatePickerDialog
                      cancelLabel={cancelLabel}
                      okLabel={okLabel}
                      container={container}
                      initialDate={dateVal}
                      mode={mode}
                      onAccept={this.handleAccept('date')}
                      firstDayOfWeek={firstDayOfWeek}
                      ref='date' />
                    <TimePickerDialog
                      cancelLabel={cancelLabel}
                      okLabel={okLabel}
                      initialTime={dateVal}
                      mode={mode}
                      onAccept={this.handleAccept('time')}
                      format={format}
                      ref='time' />
                </div>
            </div>
        );
    }
}

DatePickerBetween.defaultProps = {
    firstDayOfWeek: 1,
    mode: 'landscape',
    container: 'dialog',
    timeFormat: 'HH:mm',
    dateFormat: 'YYYY-MM-DD'
};
DatePickerBetween.propTypes = {
    defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    locale: PropTypes.string,
    okLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    cancelLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    firstDayOfWeek: PropTypes.number,
    container: PropTypes.oneOf(['dialog', 'inline']),
    mode: PropTypes.oneOf(['landscape', 'portrait']),
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    timeFormat: PropTypes.string,
    dateFormat: PropTypes.string,
    onChange: PropTypes.func,
    boldLabel: PropTypes.bool,
    transformDate: PropTypes.func,
    transformTime: PropTypes.func
};

DatePickerBetween.contextTypes = {
    implementationStyle: PropTypes.object
};
