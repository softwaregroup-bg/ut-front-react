
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import {DatePicker, TimePicker} from '@material-ui/pickers';
import Dropdown from './../../Input/Dropdown';
import Text from '../../Text';
import { timeValues24HrFormat, timeValues12HrFormat } from './defaultValues';

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

        const { locale, dateFormat, transformDate } = this.props;

        if (transformDate) {
            return transformDate(date, dateFormat, locale);
        }

        return date.toISOString();
    }

    formatTime(time) {
        if (!time || isNaN(time.valueOf())) {
            return '';
        }

        const { locale, timeFormat, transformTime } = this.props;

        if (transformTime) {
            return transformTime(time, timeFormat, locale);
        }

        return time.toISOString().substr(11, 5);
    }

    handleAccept(ref) {
        const {defaultValue, timeType} = this.props;
        const currentDate = new Date(defaultValue);
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
                const timeSet = function() {
                    let time;
                    if (newDate.value.indexOf('am') > -1 || newDate.value.indexOf('pm') > -1) {
                        const newTime = newDate ? newDate.value.split(' ') : [];
                        time = newTime.length ? newTime[0].split(':') : [];
                        time[0] = newTime[1] === 'am' ? time[0] < 12 ? time[0] : parseInt(time[0]) - 12 : newTime[1] === 'pm' ? time[0] < 12 ? parseInt(time[0]) + 12 : time[0] : '';
                    } else {
                        time = newDate ? newDate.value.split(':') : [];
                    }
                    newDate = new Date();
                    newDate.setHours(time[0]);
                    newDate.setMinutes(time[1] || 0);
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
        const { timeFormat, label, boldLabel, okLabel, cancelLabel, mode, firstDayOfWeek, container, innerWrapperClassName } = this.props;
        const { defaultValue, timeType } = this.props;

        const outerWrapStyle = label ? style.outerWrap : style.outerWrapNoLabel;
        const boldLabelStyle = boldLabel ? style.boldLabel : '';

        const format = timeFormat.indexOf('HH') > -1 ? '24h' : 'ampm';
        const defaultDate = new Date().setHours(0, 0, 0, 0);
        const dropdownData = format === '24h'
            ? timeValues24HrFormat
            : format === 'ampm' ? timeValues12HrFormat : '';

        const date = defaultValue
            ? new Date(defaultValue)
            : new Date(defaultDate);

        let innerWrap = style.innerWrap;
        let labelWrap = style.labelWrap;

        if (timeType === 'timePicker') {
            innerWrap = style.innerWrapTP;
            labelWrap = style.labelWrapTP;
        }

        return (
            <div className={outerWrapStyle}>
                {label ? (<span className={classnames(labelWrap, boldLabelStyle)}><Text>{label}</Text></span>) : ''}
                <div className={classnames(innerWrap, innerWrapperClassName)}>
                    <div className={style.inputWrap}>
                        <DatePicker
                            value={date}
                            onChange={noop}
                            onKeyUp={this.handleKeyPress('date')}
                            cancelLabel={cancelLabel}
                            okLabel={okLabel}
                            container={container}
                            initialDate={date}
                            mode={mode}
                            onAccept={this.handleAccept('date')}
                            firstDayOfWeek={firstDayOfWeek}
                            variant='dialog'
                            ref='date'
                            InputProps={{disableUnderline: true}}
                        />
                        <button className={style.dateButton} onClick={this.handleOpen('date')} />
                    </div>
                    {timeType === 'timePicker' ? <div className={style.inputWrap}>
                        <input value={defaultValue ? this.formatTime(date) : ''} type='text' onChange={noop} onKeyUp={this.handleKeyPress('time')} />
                        <button className={style.timeButton} onClick={this.handleOpen('time')} />
                    </div> : timeType === 'timeDropdown'
                        ? <div className={style.ddframe}>
                            <Dropdown
                                data={dropdownData}
                                keyProp='time'
                                onSelect={this.handleAccept('time')}
                                defaultSelected={defaultValue ? this.formatTime(date) : ''}
                            />
                        </div> : ''}
                    {timeType === 'timePicker' ? <TimePicker
                        cancelLabel={cancelLabel}
                        okLabel={okLabel}
                        initialTime={date}
                        mode={mode}
                        onAccept={this.handleAccept('time')}
                        format={format}
                        variant='dialog'
                        ref='time'
                    /> : ''}
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
    dateFormat: 'yyyy-MM-dd',
    data: timeValues24HrFormat
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
