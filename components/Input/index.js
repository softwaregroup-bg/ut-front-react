import React, { PropTypes, Component } from 'react';
import { textValidations } from '../../validator/constants';
import inputValidator from './validators/input';

import classnames from 'classnames';
import defaultStyle from './style.css';

const notifyForChangeInterval = 300;

class TextField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
            valid: {isValid: this.props.isValid, errorMessage: this.props.errorMessage},
            isEdited: this.props.isEdited
        };

        this.onChangQueue = [];
        this.initialValue = props.value;

        this.handleChange = this.handleChange.bind(this);
        this.notifyForChange = this.notifyForChange.bind(this);
        this.style = props.customStyle || defaultStyle;
    }

    componentWillReceiveProps({value, isValid, errorMessage, isEdited}) {
        this.initialValue = value;

        if (this.state.value !== value || this.state.valid.isValid !== isValid || this.state.isEdited !== isEdited || this.state.valid.errorMessage !== errorMessage) {
            this.setState({
                value: value,
                valid: {isValid: isValid, errorMessage: errorMessage},
                isEdited: isEdited
            });
        }
    }

    handleChange(e) {
        let newValue = e.target.value;
        this.setState({value: newValue});

        // Add to queue (when user is typing new values fast we want to delay the call of props.onChange() to avoid unnecessary calculations)
        var oldQueue = this.onChangQueue.shift();
        clearTimeout(oldQueue);
        this.onChangQueue.push(setTimeout(() => {
            this.notifyForChange(newValue);
        }, notifyForChangeInterval));
    }

    notifyForChange(newValue) {
        let { validators, keyProp, onChange } = this.props;
        let newState = {value: newValue};
        let objectToPassOnChange = {key: keyProp, value: newValue, initValue: this.initialValue};

        // Perfom validation
        if (validators.length > 0) {
            let valid = inputValidator(newValue, validators);
            if (!valid.isValid) {
                let errorMessage = valid.errors[0].errorMessage;
                objectToPassOnChange.error = true;
                objectToPassOnChange.errorMessage = errorMessage;
                newState.valid = {isValid: false, errorMessage: errorMessage};
            } else if (!this.state.valid.isValid) {
                newState.valid = {isValid: true, errorMessage: ''};
            }
        }
        this.setState(newState);
        onChange(objectToPassOnChange);
    }

    get inputClassName() {
        const { valid, isEdited } = this.state;
        const { readonly } = this.props;
        return classnames(this.style.input, {
            [this.style.editedInputStyle]: isEdited,
            [this.style.error]: !valid.isValid,
            [this.style.readonlyInput]: readonly
        });
    }

    render() {
        let { label, type, placeholder, onClick, onBlur, dependancyDisabledInputTooltipText, inputWrapClassName, wrapperClassName, labelClassName } = this.props;
        let { isValid, errorMessage } = this.state.valid;
        let zeroHeightStyle = isValid ? this.style.hh : '';
        const value = (!this.state.value && this.state.value !== 0) ? '' : this.state.value;

        let input = <input ref='textInput' type={type} className={this.inputClassName} value={value} onClick={onClick} onBlur={onBlur} onChange={this.handleChange} readOnly={this.props.readonly} placeholder={placeholder} />;
        let tooltip = (this.props.readonly && dependancyDisabledInputTooltipText && <span className={this.style.tooltiptext}> {dependancyDisabledInputTooltipText} </span>);
        if (label) {
            return (
                <div className={classnames(this.style.outerWrap, wrapperClassName)}>
                    <div className={classnames(this.style.lableWrap, labelClassName, {[this.style.boldLabel]: this.props.boldLabel})}>
                        {label} {this.props.validators.find(validator => validator.type === textValidations.isRequired) && '*'}
                    </div>
                    <div className={classnames(this.style.inputWrap, inputWrapClassName)}>
                        {input}
                        {tooltip}
                        <div className={classnames(this.style.errorWrap, zeroHeightStyle)}>{!isValid && <div className={this.style.errorMessage}>{errorMessage}</div>}</div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className={classnames(this.style.inputWrap, inputWrapClassName)}>
                    {input}
                    {tooltip}
                    <div className={classnames(this.style.errorWrap, zeroHeightStyle)}>{!isValid && <div className={this.style.errorMessage}>{errorMessage}</div>}</div>
                </div>
            );
        }
    }
}

TextField.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    keyProp: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array
    ]),
    label: PropTypes.node,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    wrapperClassName: PropTypes.string,
    labelClassName: PropTypes.string,
    dependancyDisabledInputTooltipText: PropTypes.string,
    onChange: PropTypes.func,
    readonly: PropTypes.bool,
    boldLabel: PropTypes.bool,
    customStyle: PropTypes.object,
    onClick: PropTypes.func,
    onBlur: PropTypes.func,
    inputWrapClassName: PropTypes.string,

    // Validation
    validators: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.oneOf([textValidations.isRequired, textValidations.length, textValidations.numberOnly, textValidations.decimalOnly, textValidations.email, textValidations.uniqueValue, textValidations.regex]).isRequired,
            values: PropTypes.any,
            errorMessage: PropTypes.string
        })
    ),
    isValid: PropTypes.bool,
    errorMessage: PropTypes.string,

    // Edited
    isEdited: PropTypes.bool
};

TextField.defaultProps = {
    value: '',
    type: 'text',
    tooltipText: '',
    keyProp: '___no_key___',
    validators: [],
    readonly: false,
    boldLabel: false,
    isValid: true,
    errorMessage: '',
    isEdited: false,
    onChange: () => {},
    onBlur: () => {},
    onClick: () => {}
};

export default TextField;
