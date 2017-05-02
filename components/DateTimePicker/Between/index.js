import React, { Component, PropTypes } from 'react';

import DateTimePicker from '../Simple';

import style from './style.css';

class DateTimePickerBetween extends Component {
    render() {
        let {
            locale,
            labelFrom,
            labelTo,
            okLabel,
            cancelLabel,
            boldLabel,
            firstDayOfWeek,
            onChange,
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
                      onChange={({value}) => { onChange({key: 'from', value: value}); }}
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
                      onChange={({value}) => { onChange({key: 'to', value: value}); }}
                      boldLabel={boldLabel} />
                </div>
            </div>
        );
    }
}

DateTimePickerBetween.propTypes = {
    defaultValue: PropTypes.object,
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
