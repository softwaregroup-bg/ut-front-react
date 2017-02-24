import React, { Component, PropTypes } from 'react';

import DateTimePicker from '../Simple';

class DateTimePickerBetween extends Component {
    render() {
        let {
            DateTimeFormat,
            locale,
            labelFrom,
            labelTo,
            okLabel,
            cancelLabel,
            firstDayOfWeek,
            onChange,
            defaultValue
        } = this.props;

        return (
            <div>
                <div>
                    <DateTimePicker
                      defaultValue={defaultValue.from}
                      DateTimeFormat={DateTimeFormat}
                      locale={locale}
                      label={labelFrom}
                      okLabel={okLabel}
                      cancelLabel={cancelLabel}
                      firstDayOfWeek={firstDayOfWeek}
                      onChange={({value}) => { onChange({key: 'from', value: value}); }}
                      boldLabel={this.props.boldLabel} />
                </div>
                <div>
                    <DateTimePicker
                      defaultValue={defaultValue.to}
                      DateTimeFormat={DateTimeFormat}
                      locale={locale}
                      label={labelTo}
                      okLabel={okLabel}
                      cancelLabel={cancelLabel}
                      firstDayOfWeek={firstDayOfWeek}
                      onChange={({value}) => { onChange({key: 'to', value: value}); }}
                      boldLabel={this.props.boldLabel} />
                </div>
            </div>
        );
    }
}

DateTimePickerBetween.propTypes = {
    defaultValue: PropTypes.object,
    locale: PropTypes.string,
    okLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    cancelLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    firstDayOfWeek: PropTypes.number,
    withVerticalClass: PropTypes.bool,
    labelFrom: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    labelTo: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    DateTimeFormat: PropTypes.func,
    onChange: PropTypes.func,
    boldLabel: PropTypes.bool
};

export default DateTimePickerBetween;
