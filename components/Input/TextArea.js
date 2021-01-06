import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { textValidations } from '../../validator/constants';
import inputValidator from './validators/input';
import Text from '../Text';
import classnames from 'classnames';
import style from './style.css';

const notifyForChangeInterval = 300;

class TextArea extends Component {
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
    }

    componentWillReceiveProps({value, isValid, errorMessage}) {
        this.initialValue = value;

        if (this.state.value !== value || this.state.valid.isValid !== isValid) {
            this.setState({
                value: value,
                valid: {isValid: isValid, errorMessage: errorMessage}
            });
        }
    }

    handleChange(e) {
        const newValue = e.target.value;
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

        // Perform validation
        if (validators.length > 0) {
            const valid = inputValidator(newValue, validators);
            if (!valid.isValid) {
                const errorMessage = valid.errors[0].errorMessage;
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

    render() {
        const { label, readonly, cssClass } = this.props;
        const { isValid, errorMessage } = this.state.valid;
        const errorTextAreaStyle = !isValid ? style.error : '';
        const zeroHeightStyle = isValid ? style.hh : '';
        const disabledStyle = readonly ? style.readonlyInput : '';

        const textArea = <textarea
            rows='7'
            ref='input'
            className={classnames(style.textarea, errorTextAreaStyle, disabledStyle, cssClass)}
            value={this.state.value || ''}
            onChange={this.handleChange}
            disabled={this.props.disabled}
            readOnly={this.props.readonly}
        />;
        if (label) {
            return (
                <div className={style.outerWrap}>
                    <div className={style.textareaLabelWrap}>
                        <Text>{label}</Text> {this.props.validators.find(validator => validator.type === textValidations.isRequired) && '*'}
                    </div>
                    <div className={style.textareaWrap}>
                        {textArea}
                        <div className={classnames(style.errorWrap, zeroHeightStyle)}>{!isValid && <div className={style.errorMessage}>{errorMessage}</div>}</div>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    {textArea}
                    <div className={classnames(style.errorWrap, zeroHeightStyle)}>{!isValid && <div className={style.errorMessage}>{errorMessage}</div>}</div>
                </div>
            );
        }
    }
}

TextArea.propTypes = {
    value: PropTypes.string,
    keyProp: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array
    ]),
    label: PropTypes.node,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    cssClass: PropTypes.string,

    // Validation
    validators: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.oneOf([textValidations.isRequired, textValidations.length]).isRequired,
            errorMessage: PropTypes.string
        })
    ),
    isValid: PropTypes.bool,
    errorMessage: PropTypes.string
};

TextArea.defaultProps = {
    value: '',
    keyProp: '___no_key___',
    validators: [],
    isValid: true,
    errorMessage: '',
    disabled: false,
    readonly: false,
    onChange: () => {}
};

export default TextArea;
