
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog';
import { formatIso } from 'material-ui/DatePicker/dateUtils';
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog';
import { formatTime } from 'material-ui/TimePicker/timeUtils';
import Dropdown from './../../Input/Dropdown';
import { defaultTimeValues } from './defaultValues';

import style from './style.css';

const noop = () => {};

class DateTimePicker extends Component {
    constructor(props) {
        super(props);

        this.handleAccept = this.handleAccept.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.formatDate = this.formatDate.bind(this);
        this.formatTime = this.formatTime.bind(this);
        this.getContextStyles = this.getContextStyles.bind(this);
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
        let {defaultValue, timeType} = this.props;
        let currentDate = new Date(defaultValue);
        return (newDate) => {
            if (newDate === currentDate) {
                return;
            }
            if (ref === 'date') {
                if (currentDate && !isNaN(currentDate.valueOf())) {
                    if (!newDate || isNaN(newDate.valueOf())) {
                        newDate = undefined;
                    } else {
                        newDate.setHours(currentDate.getHours());
                        newDate.setMinutes(currentDate.getMinutes());
                        newDate.setSeconds(currentDate.getSeconds());
                    }
                }
            } else if (ref === 'time' && timeType === 'timePicker') {
                if (currentDate && !isNaN(currentDate.valueOf())) {
                    if (!newDate || isNaN(newDate.valueOf())) {
                        newDate = currentDate;
                        newDate.setHours(0);
                        newDate.setMinutes(0);
                        newDate.setSeconds(0);
                    } else {
                        newDate.setFullYear(currentDate.getFullYear());
                        newDate.setMonth(currentDate.getMonth());
                        newDate.setDate(currentDate.getDate());
                    }
                }
            } else if (ref === 'time' && timeType === 'timeDropdown') {
                var timeSet = function() {
                    var time = newDate ? newDate.value.split(':') : [];
                    newDate = new Date();
                    newDate.setHours(time[0]);
                    newDate.setMinutes(time[1]);
                    return newDate;
                };
                if (currentDate && !isNaN(currentDate.valueOf())) {
                    if (newDate.value === newDate.initValue) {
                        return;
                    } else if (newDate && newDate.value) {
                        timeSet();
                        newDate.setFullYear(currentDate.getFullYear());
                        newDate.setMonth(currentDate.getMonth());
                        newDate.setDate(currentDate.getDate());
                    }
                } else {
                    timeSet();
                }
            } else {
                return;
            }
            this.props.onChange({
                value: newDate
            });
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
        let { timeFormat, label, boldLabel, okLabel, cancelLabel, mode, firstDayOfWeek, container, innerWrapperClassName } = this.props;
        let { defaultValue, timeType } = this.props;

        let outerWrapStyle = label ? style.outerWrap : style.outerWrapNoLabel;
        let boldLabelStyle = boldLabel ? style.boldLabel : '';

        let format = timeFormat.indexOf('HH') > -1 ? '24hr' : 'ampm';

        let date = defaultValue
            ? new Date(defaultValue)
            : new Date();

        return (
            <div className={outerWrapStyle}>
                 {label ? (<span className={classnames(style.labelWrap, boldLabelStyle)}>{label}</span>) : ''}
                <div className={classnames(style.innerWrap, innerWrapperClassName)}>
                    <div className={style.inputWrap}>
                        <input value={defaultValue ? this.formatDate(date) : ''} type='text' onChange={noop} onKeyUp={this.handleKeyPress('date')} />
                        <button className={style.dateButton} onClick={this.handleOpen('date')} />
                    </div>
                    {timeType === 'timePicker' ? <div className={style.inputWrap}>
                        <input value={defaultValue ? this.formatTime(date) : ''} type='text' onChange={noop} onKeyUp={this.handleKeyPress('time')} />
                        <button className={style.timeButton} onClick={this.handleOpen('time')} />
                    </div> : timeType === 'dropdown'
                    ? <div className={style.ddframe}>
                        <Dropdown
                          data={this.props.data}
                          keyProp='time'
                          onSelect={this.handleAccept('time')}
                          defaultSelected={defaultValue ? this.formatTime(date) : ''} />
                        </div> : ''}
                     <DatePickerDialog
                       cancelLabel={cancelLabel}
                       okLabel={okLabel}
                       container={container}
                       initialDate={date}
                       mode={mode}
                       onAccept={this.handleAccept('date')}
                       firstDayOfWeek={firstDayOfWeek}
                       ref='date' />
                    {timeType === 'timePicker' ? <TimePickerDialog
                      cancelLabel={cancelLabel}
                      okLabel={okLabel}
                      initialTime={date}
                      mode={mode}
                      onAccept={this.handleAccept('time')}
                      format={format}
                      ref='time' /> : ''}
                </div>
            </div>
        );
    }
}

DateTimePicker.defaultProps = {
    timeType: 'timePicker',
    firstDayOfWeek: 1,
    mode: 'landscape',
    container: 'dialog',
    timeFormat: 'HH:mm',
    dateFormat: 'YYYY-MM-DD',
    data: defaultTimeValues
};
DateTimePicker.propTypes = {
    defaultValue: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
    locale: PropTypes.string,
    okLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    cancelLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    firstDayOfWeek: PropTypes.number,
    container: PropTypes.oneOf(['dialog', 'inline']),
    mode: PropTypes.oneOf(['landscape', 'portrait']),
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    timeFormat: PropTypes.string,
    dateFormat: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    boldLabel: PropTypes.bool,
    transformDate: PropTypes.func,
    transformTime: PropTypes.func,
    timeType: PropTypes.oneOf(['timeDropdown', 'timePicker']),
    innerWrapperClassName: PropTypes.string,
    data: PropTypes.array
};

DateTimePicker.contextTypes = {
    implementationStyle: PropTypes.object
};

export default DateTimePicker;
