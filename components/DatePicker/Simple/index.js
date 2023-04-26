import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import DatePickerInput from 'material-ui/DatePicker/DatePicker';
// import { formatIso } from 'material-ui/DatePicker/dateUtils';
import style from '../style.css';
import Text from '../../Text';

export default class DatePicker extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange() {
        const self = this;
        return (event, date) => {
            self.props.onChange({
                // value: date
                value: date && date.toISOString() // formatIso(date)
            });
        };
    }

    render() {
        const {disabled, isValid, errorMessage, label, boldLabel, withVerticalClass, labelWrap} = this.props;

        const textFieldStyle = {
            cursor: 'pointer',
            width: '100%',
            height: '30px'
        };

        const hintStyle = {
            margin: '0 0 4px 10px',
            bottom: '0px'
        };

        const zeroHeightStyle = isValid ? style.hh : '';
        const dpStyles = isValid ? style.dpStylesValid : style.dpStylesNonValid;
        const iconDisabledClassname = disabled ? style.datePickerIconDisabled : '';
        const readonlyStyle = disabled ? style.readonlyInput : '';
        const datePickerLabeled = label ? style.datePickerLabeled : '';
        const labelStyle = withVerticalClass ? style.labelWrap : style.labelWrapHorizontal;

        const dateVal = this.props.defaultValue && new Date(this.props.defaultValue);
        const minDate = new Date(new Date().setMonth(new Date().getMonth() - 12));
        const maxDate = new Date(new Date().setMonth(new Date().getMonth() + 6));
        return (
            <div className={classnames(style.wrap, this.props.wrapperClassName)}>
                {label ? (<span className={classnames(labelStyle, labelWrap, {[style.boldLabel]: boldLabel})}><Text>{label}</Text></span>) : ''}
                <div className={classnames(style.datePicker, datePickerLabeled)} style={this.props.wrapperStyles}>
                    <div className={classnames(style.datePickerIcon, iconDisabledClassname)} style={this.props.iconStyles} />
                    <DatePickerInput
                        className={classnames(dpStyles, readonlyStyle)}
                        textFieldStyle={textFieldStyle}
                        DateTimeFormat={this.props.DateTimeFormat}
                        cancelLabel={this.props.cancelLabel}
                        okLabel={this.props.okLabel}
                        container={this.props.container}
                        value={dateVal}
                        mode={this.props.mode}
                        onChange={this.handleChange()}
                        firstDayOfWeek={this.props.firstDayOfWeek}
                        minDate={minDate}
                        maxDate={maxDate}
                        disabled={this.props.disabled}
                        hintText={this.props.hintText}
                        hintStyle={hintStyle}
                    />
                    <div className={classnames(style.errorWrap, zeroHeightStyle)}>{!isValid && <div className={style.errorMessage}>{errorMessage}</div>}</div>
                </div>
            </div>
        );
    }
}

DatePicker.defaultProps = {
    firstDayOfWeek: 1,
    mode: 'landscape',
    container: 'dialog',
    isValid: true,
    hintText: ' ',
    boldLabel: true,
    label: '',
    withVerticalClass: false
};
DatePicker.propTypes = {
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]), // accepts new Date() object or string
    // locale: PropTypes.string,
    okLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
    firstDayOfWeek: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6]), // 0 (Sunday) to 6 (Saturday), default is 1
    container: PropTypes.oneOf(['dialog', 'inline']),
    mode: PropTypes.oneOf(['landscape', 'portrait']),
    // masterLabel: PropTypes.string,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    boldLabel: PropTypes.bool,
    DateTimeFormat: PropTypes.func,
    // onChange: PropTypes.func,
    wrapperClassName: PropTypes.string,
    wrapperStyles: PropTypes.object,
    iconStyles: PropTypes.object,
    // minDate: PropTypes.object,
    // maxDate: PropTypes.object,
    disabled: PropTypes.bool,
    isValid: PropTypes.bool,
    errorMessage: PropTypes.string,
    hintText: PropTypes.string,
    withVerticalClass: PropTypes.bool,
    labelWrap: PropTypes.string
};

DatePicker.contextTypes = {
    implementationStyle: PropTypes.object
};
