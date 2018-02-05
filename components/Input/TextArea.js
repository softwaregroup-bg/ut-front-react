import React, { PropTypes, Component } from 'react';
import { textValidations } from '../../validator/constants';
import inputValidator from './validators/input';

import classnames from 'classnames';
import style from './style.css';

const notifyForChangeInterval = 300;

class TextArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
            valid: {isValid: this.props.isValid, errorMessage: this.props.errorMessage},
            isEdited: props.isEdited
        };

        this.onChangQueue = [];
        this.initialValue = props.value;

        this.handleChange = this.handleChange.bind(this);
        this.notifyForChange = this.notifyForChange.bind(this);
    }

    componentWillReceiveProps({value, isValid, errorMessage, isEdited}) {
        this.initialValue = value;

        if (this.state.value !== value || this.state.valid.isValid !== isValid || this.state.isEdited !== isEdited) {
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

        // Perform validation
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

    render() {
        let { label, readonly } = this.props;
        let { isValid, errorMessage } = this.state.valid;
        let errorTextAreaStyle = !isValid ? style.error : '';
        let zeroHeightStyle = isValid ? style.hh : '';
        let editedInputStyle = this.state.isEdited ? style.editedInputStyle : '';
        let disabledStyle = readonly ? style.readonlyInput : '';

        let textArea = <textArea
          rows='7'
          ref='input'
          className={classnames(style.textarea, errorTextAreaStyle, editedInputStyle, disabledStyle)}
          value={this.state.value || ''}
          onChange={this.handleChange}
          disabled={this.props.disabled}
          readOnly={this.props.readonly}
        />;
        if (label) {
            return (
                <div className={style.outerWrap}>
                    <div className={style.textareaLabelWrap}>
                        {label} {this.props.validators.length > 0 && '*'}
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
    keyProp: PropTypes.string,
    label: PropTypes.node,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,

    // Validation
    validators: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.oneOf([textValidations.isRequired, textValidations.length]).isRequired,
            errorMessage: PropTypes.string
        })
    ),
    isValid: PropTypes.bool,
    errorMessage: PropTypes.string,

    // Edited
    isEdited: PropTypes.bool
};

TextArea.defaultProps = {
    value: '',
    keyProp: '___no_key___',
    validators: [],
    isValid: true,
    errorMessage: '',
    isEdited: false,
    disabled: false,
    readonly: false,
    onChange: () => {}
};

export default TextArea;
