import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';
import { textValidations, customValidations } from '../../validator/constants';
import inputValidator from './validators/input';
import Text from '../Text';

import classnames from 'classnames';
import defaultStyle from './style.css';

const notifyForChangeInterval = 300;

class TextField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
            valid: {isValid: this.props.isValid, errorMessage: this.props.errorMessage}
        };

        this.onChangQueue = [];
        this.initialValue = props.value;

        this.handleChange = this.handleChange.bind(this);
        this.notifyForChange = this.notifyForChange.bind(this);
        this.translate = this.translate.bind(this);
        this.style = props.customStyle || defaultStyle;
    }

    static contextTypes = {
        checkPermission: PropTypes.func,
        translate: PropTypes.func,
        portalName: PropTypes.string
    };

    componentWillReceiveProps({value, isValid, errorMessage}) {
        this.initialValue = value;
        if (this.state.value !== value || this.state.valid.isValid !== isValid || this.state.valid.errorMessage !== errorMessage) {
            this.setState({
                value,
                valid: {isValid, errorMessage}
            });
        }
    }

    handleChange(e) {
        const { renderText } = this.props;
        let newValue = e.target.value;
        if (this.props.capitalize) {
            newValue = newValue.toUpperCase();
        }
        if (renderText) {
            newValue = newValue.replace(/,/g, '');
        }
        this.setState({value: newValue});

        // Add to queue (when user is typing new values fast we want to delay the call of props.onChange() to avoid unnecessary calculations)
        const oldQueue = this.onChangQueue.shift();
        clearTimeout(oldQueue);
        this.onChangQueue.push(setTimeout(() => {
            this.notifyForChange(newValue);
        }, notifyForChangeInterval));
    }

    notifyForChange(newValue) {
        const { validators, keyProp, onChange } = this.props;
        const newState = {value: newValue};
        const objectToPassOnChange = {key: keyProp, value: newValue, initValue: this.initialValue};

        // Perfom validation
        if (validators.length > 0) {
            const valid = inputValidator(newValue, validators);
            if (!valid.isValid) {
                const errorMessage = valid.errors[0].errorMessage;
                objectToPassOnChange.error = true;
                objectToPassOnChange.errorMessage = errorMessage;
                newState.valid = {isValid: false, errorMessage};
            } else if (!this.state.valid.isValid) {
                newState.valid = {isValid: true, errorMessage: ''};
            }
        }
        this.setState(newState);
        onChange(objectToPassOnChange);
    }

    get inputClassName() {
        const { valid } = this.state;
        const { readonly } = this.props;
        return classnames(this.style.input, {
            [this.style.error]: !valid.isValid,
            [this.style.readonlyInput]: readonly
        });
    }

    translate(stringToTranslate) {
        return this.context && this.context.translate ? this.context.translate(stringToTranslate) : stringToTranslate;
    }

    render() {
        const { label, type, placeholder, onClick, onBlur, dependancyDisabledInputTooltipText, inputWrapClassName, wrapperClassName, labelClassName, renderText } = this.props;
        const { isValid, errorMessage } = this.state.valid;
        const zeroHeightStyle = isValid ? this.style.hh : '';
        const value = this.state.value !== undefined && this.state.value !== null ? this.state.value : '';

        const inputType = type === 'money' ? 'number' : type;

        let input = <input ref='textInput' type={inputType} className={classnames(this.inputClassName, this.props.classes.border)} value={renderText ? renderText(value) : value } onClick={onClick} onBlur={onBlur} onChange={this.handleChange} readOnly={this.props.readonly} placeholder={this.translate(placeholder)} />;

        if (type === 'money' && this.props.currency) {
            input = <div className={defaultStyle.horizontalWrapper}>
                <div>
                    {input}
                </div>
                <div className={classnames(defaultStyle.currencyWrapper, defaultStyle.readonlyInput)}>
                    <span>
                        {this.props.currency}
                    </span>
                </div>
            </div>;
        }

        let helpText = this.props.helpText;
        helpText = <div className={classnames(this.style.errorWrap)}>{isValid && !!helpText && <div className={this.style.helpText}><Text>{helpText}</Text></div>}</div>;

        const tooltip = (this.props.readonly && dependancyDisabledInputTooltipText && <span className={this.style.tooltiptext}> <Text>{dependancyDisabledInputTooltipText}</Text> </span>);
        if (label) {
            return (
                <div className={classnames(this.style.outerWrap, wrapperClassName)}>
                    <div className={classnames(this.style.lableWrap, labelClassName, {[this.style.boldLabel]: this.props.boldLabel})}>
                        <Text>{label}</Text> {this.props.validators.find(validator => validator.type === textValidations.isRequired) && '*'}
                    </div>
                    <div className={classnames(this.style.inputWrap, inputWrapClassName)}>
                        {input}
                        {tooltip}
                        <div className={classnames(this.style.errorWrap, zeroHeightStyle)}>{!isValid && <div className={this.style.errorMessage}><Text>{errorMessage}</Text></div>}</div>
                        {helpText}
                    </div>
                </div>
            );
        } else {
            return (
                <div className={classnames(this.style.inputWrap, inputWrapClassName)}>
                    {input}
                    {tooltip}
                    <div className={classnames(this.style.errorWrap, zeroHeightStyle)}>{!isValid && <div className={this.style.errorMessage}>{errorMessage}</div>}</div>
                    {helpText}
                </div>
            );
        }
    }
}

TextField.propTypes = {
    classes: PropTypes.object,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    keyProp: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array
    ]),
    label: PropTypes.node,
    currency: PropTypes.node,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    wrapperClassName: PropTypes.string,
    labelClassName: PropTypes.string,
    dependancyDisabledInputTooltipText: PropTypes.string,
    capitalize: PropTypes.bool,
    onChange: PropTypes.func,
    readonly: PropTypes.bool,
    boldLabel: PropTypes.bool,
    customStyle: PropTypes.object,
    onClick: PropTypes.func,
    onBlur: PropTypes.func,
    inputWrapClassName: PropTypes.string,
    renderText: PropTypes.func,

    // Validation
    validators: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.oneOf([textValidations.integerOnly, textValidations.integerRange, textValidations.isRequired, textValidations.length, textValidations.numberOnly, textValidations.decimalOnly, textValidations.email, textValidations.uniqueValue, textValidations.regex, customValidations.function]).isRequired,
            values: PropTypes.any,
            errorMessage: PropTypes.string
        })
    ),
    isValid: PropTypes.bool,
    errorMessage: PropTypes.string,
    helpText: PropTypes.string
};

TextField.defaultProps = {
    value: '',
    type: 'text',
    tooltipText: '',
    keyProp: '___no_key___',
    capitalize: false,
    validators: [],
    readonly: false,
    boldLabel: true,
    isValid: true,
    errorMessage: '',
    onChange: () => {},
    onBlur: () => {},
    renderText: null,
    onClick: () => {}
};

export default withStyles(({palette}) => ({
    border: {
        borderColor: palette.divider
    }
}))(TextField);
