import React, { Component, PropTypes } from 'react';

import DateTimePicker from '../Simple';

import style from './style.css';

class DateTimePickerBetween extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(ref, value) {
        let { onChange } = this.props;

        let date = new Date(value);
        let result;

        if (date && !isNaN(date.valueOf())) {
            if (ref === 'from') {
                date.setSeconds(0);
                date.setMilliseconds(0);
            } else if (ref === 'to') {
                date.setSeconds(59);
                date.setMilliseconds(999);
            }

            result = (new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000))
                .toISOString()
                .replace('T', ' ')
                .substr(0, 23);
        }

        onChange({
            key: ref,
            value: result
        });
    }

    render() {
        let {
            locale,
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
            transformTime
        } = this.props;

        let layoutClassName = withVerticalClass ? style.verticalAlign : style.horizontalAlign;

        return (
            <div className={layoutClassName}>
                <div>
                    <DateTimePicker
                      defaultValue={defaultValue.from}
                      dateFormat={dateFormat}
                      timeFormat={timeFormat}
                      transformDate={transformDate}
                      transformTime={transformTime}
                      locale={locale}
                      label={labelFrom}
                      okLabel={okLabel}
                      cancelLabel={cancelLabel}
                      firstDayOfWeek={firstDayOfWeek}
                      onChange={({value}) => { this.handleChange('from', value); }}
                      boldLabel={boldLabel} />
                </div>
                <div>
                    <DateTimePicker
                      defaultValue={defaultValue.to}
                      dateFormat={dateFormat}
                      timeFormat={timeFormat}
                      transformDate={transformDate}
                      transformTime={transformTime}
                      locale={locale}
                      label={labelTo}
                      okLabel={okLabel}
                      cancelLabel={cancelLabel}
                      firstDayOfWeek={firstDayOfWeek}
                      onChange={({value}) => { this.handleChange('to', value); }}
                      boldLabel={boldLabel} />
                </div>
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
    timeFormat: PropTypes.string,
    dateFormat: PropTypes.string,
    okLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    cancelLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    firstDayOfWeek: PropTypes.number,
    withVerticalClass: PropTypes.bool,
    labelFrom: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    labelTo: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    onChange: PropTypes.func,
    boldLabel: PropTypes.bool,
    transformDate: PropTypes.func,
    transformTime: PropTypes.func
};

export default DateTimePickerBetween;
