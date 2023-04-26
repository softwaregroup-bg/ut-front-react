import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Title from '../Title';
import FormInput from '../FormInput';
import Button from '../StandardButton';
import FormErrorMessage from './FormErrorMessage';
import FormSuccessMessage from './FormSuccessMessage';
import styles from './styles.css';
import SimpleCaptcha from './SimpleCaptcha';
import { getClass } from '../../utils/helpers';

export default class Form extends Component {
    constructor(props) {
        super(props);
        this.renderInputs = this.renderInputs.bind(this);
        this.renderButtons = this.renderButtons.bind(this);
        this.focusNextInput = this.focusNextInput.bind(this);
        this.captchaComponet = this.captchaComponet.bind(this);
    }

    componentDidMount() {
        this.focusNextInput();
    }

    captchaComponet(inputComponent, inputValue) {
        const {
            onCaptchaReload,
            onCaptchaValidate,
            captchaText,
            captchaImage
        } = this.props;

        const captcha = (
            <SimpleCaptcha
                key={'captcha-id'}
                text={captchaText}
                image={captchaImage}
                onReload={onCaptchaReload}
                onValidate={onCaptchaValidate}
                inputValue={inputValue}
            >
                {inputComponent}
            </SimpleCaptcha>
        );
        return captcha;
    }

    renderInputs() {
        const { inputs, onChange, isValidCaptcha } = this.props;
        const inputNodes = [];
        const inputsObject = inputs.toJS();
        Object.keys(inputsObject).forEach((key, index) => {
            const item = inputsObject[key];
            const baseInputProps = {
                key: index,
                ref: item.name,
                className: 'loginInput',
                type: item.type,
                value: item.value,
                label: item.label,
                tabIndex: item.tabIndex,
                name: item.name,
                onChange
            };
            if (item.name === 'captcha') {
                const captchaInputProps = {
                    ...baseInputProps,
                    error: isValidCaptcha ? '' : item.error,
                    disabled: isValidCaptcha
                };
                /*
                    Note: Due to current react version 15.x, For the current login form flow we cannot have
                    an input inside captcha component.
                    We cannot manipulate the input at that level when accessing this.refs object at FormCaptcha component.
                    because we cannot forward reference from FormCaptcha component to captcha component with the new React APIs.
                    The workaround is to pass the input as children of captcha component to keep the reference
                    at Formcaptcha component level.
                */
                const input = (<FormInput {...captchaInputProps} />);
                inputNodes.push(this.captchaComponet(input, item.value));
            } else {
                const inputProps = {
                    ...baseInputProps,
                    error: item.error,
                    hidden: item.hidden,
                    disabled: item.disabled,
                    placeholder: item.placeholder
                };
                inputNodes.push(<FormInput {...inputProps} />);
            }
        });
        return inputNodes;
    }

    renderButtons() {
        const { buttons } = this.props;
        return buttons.map((button, index) => <Button key={index} {...button} />);
    }

    focusNextInput() {
        const { inputs, isValidCaptcha } = this.props;
        // find the first input which doesn't have value
        const nextInput = inputs.find(input => {
            return !input.get('value') && !input.get('hidden');
        });

        if (nextInput && isValidCaptcha) {
            this.refs[nextInput.get('name')].refs.inputNode.focus();
        }

        return nextInput;
    }

    componentDidUpdate(prevProps) {
        // if the previous and the newly added input differ, focus the new one
        // if (prevProps.inputs.last().get('name') !== this.props.inputs.last().get('name')) {
        //     this.focusNextInput();
        // }
    }

    render() {
        const { className, title, error, onSubmit } = this.props;

        return (
            <div className={getClass(styles, className)}>
                { title ? <Title style={{marginBottom: '5px !important'}} className={title.className} text={title.text} /> : false }
                { error ? (error.includes('Email sent') ? <FormSuccessMessage useNew message={error} /> : <FormErrorMessage useNew message={error} />) : false }
                <form className={styles.formContainer} onSubmit={onSubmit} autoComplete='off'>
                    <div className={styles.formBody}>
                        { this.renderInputs() }
                        { this.renderButtons() }
                    </div>
                </form>
            </div>
        );
    }
};

Form.propTypes = {
    className: PropTypes.string,
    title: PropTypes.object,
    error: PropTypes.string,
    message: PropTypes.string,
    inputs: PropTypes.object,
    buttons: PropTypes.array,
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onCaptchaReload: PropTypes.func.isRequired,
    onCaptchaValidate: PropTypes.func.isRequired,
    captchaImage: PropTypes.string,
    captchaText: PropTypes.string,
    isValidCaptcha: PropTypes.bool
};
