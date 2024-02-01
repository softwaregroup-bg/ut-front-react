import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import {DatePicker as DatePickerInput} from '@material-ui/pickers';
import style from '../style.css';

export default class DatePicker extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange() {
        return date => {
            this.props.onChange({
                value: date && date.toISOString()
            });
        };
    }

    render() {
        const {disabled, isValid, errorMessage, label, boldLabel, withVerticalClass, labelWrap} = this.props;
        const zeroHeightStyle = isValid ? style.hh : '';
        const dpStyles = isValid ? style.dpStylesValid : style.dpStylesNonValid;
        const iconDisabledClassname = disabled ? style.datePickerIconDisabled : '';
        const readonlyStyle = disabled ? style.readonlyInput : '';
        const datePickerLabeled = label ? style.datePickerLabeled : '';
        const labelStyle = withVerticalClass ? style.labelWrap : style.labelWrapHorizontal;

        const dateVal = this.props.defaultValue && new Date(this.props.defaultValue);

        return (
            <div className={classnames(style.wrap, this.props.wrapperClassName)}>
                {label ? (<span className={classnames(labelStyle, labelWrap, {[style.boldLabel]: boldLabel})}>{label}</span>) : ''}
                <div className={classnames(style.datePicker, dpStyles, datePickerLabeled)} style={this.props.wrapperStyles}>
                    <div className={classnames(style.datePickerIcon, iconDisabledClassname)} style={this.props.iconStyles} />
                    <DatePickerInput
                        className={readonlyStyle}
                        cancelLabel={this.props.cancelLabel}
                        okLabel={this.props.okLabel}
                        clearText={this.props.clearText}
                        clearable={this.props.clearable}
                        container={this.props.container}
                        color='secondary'
                        value={dateVal}
                        mode={this.props.mode}
                        onChange={this.handleChange()}
                        minDate={this.props.minDate}
                        maxDate={this.props.maxDate}
                        disabled={this.props.disabled}
                        InputProps={this.props.InputProps}
                        fullWidth={this.props.fullWidth || true}
                        format={this.props.format}
                    />
                </div>
                <div className={classnames(style.errorWrap, zeroHeightStyle)}>{!isValid && <div className={style.errorMessage}>{errorMessage}</div>}</div>
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
    locale: PropTypes.string,
    okLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
    clearText: PropTypes.string,
    clearable: PropTypes.bool,
    firstDayOfWeek: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6]), // 0 (Sunday) to 6 (Saturday), default is 1
    container: PropTypes.oneOf(['dialog', 'inline']),
    mode: PropTypes.oneOf(['landscape', 'portrait']),
    masterLabel: PropTypes.string,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    boldLabel: PropTypes.bool,
    DateTimeFormat: PropTypes.func,
    onChange: PropTypes.func,
    wrapperClassName: PropTypes.string,
    wrapperStyles: PropTypes.object,
    iconStyles: PropTypes.object,
    minDate: PropTypes.object,
    maxDate: PropTypes.object,
    disabled: PropTypes.bool,
    isValid: PropTypes.bool,
    errorMessage: PropTypes.string,
    hintText: PropTypes.string,
    withVerticalClass: PropTypes.bool,
    labelWrap: PropTypes.string,
    InputProps: PropTypes.object,
    fullWidth: PropTypes.bool,
    format: PropTypes.string
};

DatePicker.contextTypes = {
    implementationStyle: PropTypes.object
};
