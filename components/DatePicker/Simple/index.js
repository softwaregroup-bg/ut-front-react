import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import DatePickerInput from 'material-ui/DatePicker/DatePicker';
import { formatIso } from 'material-ui/DatePicker/dateUtils';
import style from '../style.css';

export default class DatePicker extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange() {
        let self = this;
        return (event, date) => {
            self.props.onChange({
                value: formatIso(date)
            });
        };
    }
    render() {
        let {disabled, isValid, errorMessage} = this.props;

        let textFieldStyle = {
            cursor: 'pointer',
            width: '100%',
            height: '30px'
        };

        let hintStyle = {
            margin: '0 0 4px 10px',
            bottom: '0px'
        };

        let zeroHeightStyle = isValid ? style.hh : '';
        let dpStyles = isValid ? style.dpStylesValid : style.dpStylesNonValid;
        let iconDisabledClassname = disabled ? style.datePickerIconDisabled : '';
        let readonlyStyle = disabled ? style.readonlyInput : '';

        return (
            <div className={style.wrap}>
                <div className={classnames(style.datePicker)} style={this.props.wrapperStyles}>
                    <div className={classnames(style.datePickerIcon, iconDisabledClassname)} style={this.props.iconStyles} />
                    <DatePickerInput
                      className={classnames(dpStyles, readonlyStyle)}
                      textFieldStyle={textFieldStyle}
                      DateTimeFormat={this.props.DateTimeFormat}
                      cancelLabel={this.props.cancelLabel}
                      okLabel={this.props.okLabel}
                      container={this.props.container}
                      value={this.props.defaultValue}
                      mode={this.props.mode}
                      onChange={this.handleChange()}
                      firstDayOfWeek={this.props.firstDayOfWeek}
                      minDate={this.props.minDate}
                      maxDate={this.props.maxDate}
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
    hintText: ' '
};
DatePicker.propTypes = {
    defaultValue: PropTypes.object, // accepts new Date() object or empty object or null
    locale: PropTypes.string,
    okLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
    firstDayOfWeek: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6]), // 0 (Sunday) to 6 (Saturday), default is 1
    container: PropTypes.oneOf(['dialog', 'inline']),
    mode: PropTypes.oneOf(['landscape', 'portrait']),
    masterLabel: PropTypes.string,
    labelFrom: PropTypes.string,
    DateTimeFormat: PropTypes.func,
    onChange: PropTypes.func,
    wrapperStyles: PropTypes.object,
    iconStyles: PropTypes.object,
    minDate: PropTypes.object,
    maxDate: PropTypes.object,
    disabled: PropTypes.bool,
    isValid: PropTypes.bool,
    errorMessage: PropTypes.string,
    hintText: PropTypes.string
};

DatePicker.contextTypes = {
    implementationStyle: PropTypes.object
};
