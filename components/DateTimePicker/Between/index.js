import PropTypes from 'prop-types';
import React, { Component } from 'react';

import DateTimePicker from '../Simple';

import style from './style.css';

class DateTimePickerBetween extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(ref, value) {
        const { onChange } = this.props;
        let newDate = new Date(value);
        if (ref === 'to' || (newDate.getHours() === 23 && newDate.getMinutes() === 59)) {
            newDate.setSeconds(59);
            newDate.setMilliseconds(999);
        } else {
            newDate.setSeconds(0);
            newDate.setMilliseconds(0);
        }
        if (newDate && !isNaN(newDate.valueOf())) {
            if (ref === 'from') {
                if (!this.props.defaultValue.to) {
                    const defaultToDate = new Date(value);
                    defaultToDate.setHours(23);
                    defaultToDate.setMinutes(59);
                    defaultToDate.setSeconds(59);
                    defaultToDate.setMilliseconds(999);
                    onChange({
                        key: 'to',
                        value: defaultToDate
                    });
                }
            } else if (ref === 'to') {
                if (!this.props.defaultValue.from) {
                    const defaultFromDate = new Date(value);
                    defaultFromDate.setHours(0);
                    defaultFromDate.setMinutes(0);
                    defaultFromDate.setSeconds(0);
                    defaultFromDate.setMilliseconds(0);
                    onChange({
                        key: 'from',
                        value: defaultFromDate
                    });
                }
                if (!this.props.defaultValue.to && newDate.getHours() === 0) {
                    newDate.setHours(23);
                    newDate.setMinutes(59);
                }
            }
        } else {
            newDate = undefined;
        }
        onChange({
            key: ref,
            value: newDate
        });
    }

    render() {
        const {
            locale,
            maxDate,
            labelFrom,
            labelTo,
            okLabel,
            cancelLabel,
            boldLabel,
            firstDayOfWeek,
            defaultValue,
            withVerticalClass,
            dateFormat,
            timeFormat,
            transformDate,
            transformTime,
            innerWrapperClassName,
            timeType,
            dateTimeCombined,
            timeDropDownData
        } = this.props;
        const layoutClassName = withVerticalClass ? style.verticalAlign : style.horizontalAlign;
        return (
            <div className={layoutClassName}>
                <DateTimePicker
                    defaultValue={defaultValue.from}
                    dateFormat={dateFormat}
                    timeFormat={timeFormat}
                    transformDate={transformDate}
                    innerWrapperClassName={innerWrapperClassName}
                    transformTime={transformTime}
                    locale={locale}
                    label={labelFrom}
                    okLabel={okLabel}
                    cancelLabel={cancelLabel}
                    firstDayOfWeek={firstDayOfWeek}
                    timeType={timeType}
                    data={timeDropDownData}
                    onChange={({value}) => { this.handleChange('from', value); }}
                    boldLabel={boldLabel}
                    maxDate={maxDate}
                    dateTimeCombined={dateTimeCombined}
                />
                <DateTimePicker
                    defaultValue={defaultValue.to}
                    dateFormat={dateFormat}
                    timeFormat={timeFormat}
                    transformDate={transformDate}
                    innerWrapperClassName={innerWrapperClassName}
                    transformTime={transformTime}
                    locale={locale}
                    label={labelTo}
                    okLabel={okLabel}
                    cancelLabel={cancelLabel}
                    firstDayOfWeek={firstDayOfWeek}
                    timeType={timeType}
                    data={timeDropDownData}
                    onChange={({value}) => { this.handleChange('to', value); }}
                    boldLabel={boldLabel}
                    maxDate={maxDate}
                    dateTimeCombined={dateTimeCombined}
                />
            </div>
        );
    }
}

DateTimePickerBetween.propTypes = {
    defaultValue: PropTypes.shape({
        from: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
        to: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string])
    }),
    locale: PropTypes.string,
    maxDate: PropTypes.string,
    timeFormat: PropTypes.string,
    dateFormat: PropTypes.string,
    okLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    cancelLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    firstDayOfWeek: PropTypes.number,
    withVerticalClass: PropTypes.bool,
    labelFrom: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    labelTo: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    onChange: PropTypes.func.isRequired,
    boldLabel: PropTypes.bool,
    transformDate: PropTypes.func,
    transformTime: PropTypes.func,
    innerWrapperClassName: PropTypes.string,
    timeType: PropTypes.string,
    timeDropDownData: PropTypes.array,
    dateTimeCombined: PropTypes.bool
};

export default DateTimePickerBetween;
