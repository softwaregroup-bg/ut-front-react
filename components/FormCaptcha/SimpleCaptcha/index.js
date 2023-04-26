import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './style.css';
import Button from '../../StandardButton';

class SimpleCaptcha extends Component {
    constructor(props, context) {
        super(props, context);
        this.onValueChange = this.onValueChange.bind(this);
        this.validate = this.validate.bind(this);
        this.reload = this.reload.bind(this);
        this.imageSection = this.imageSection.bind(this);
        this.state = {
            inputValue: '',
            inputDisabled: false,
            isValid: false,
            hasLoaded: false,
            image: '',
            text: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        if ((this.props.text === '' && nextProps.text === '') || (!this.state.hasLoaded && nextProps.text === '')) {
            this.setState(prev => ({
                ...prev,
                inputValue: '',
                inputDisabled: true
            }));
        } else {
            const image = nextProps.image || this.props.image;
            const inputValue = nextProps.inputValue || this.props.inputValue;
            const text = nextProps.text || this.props.text;
            this.setState(prev => ({
                ...prev,
                hasLoaded: true,
                inputDisabled: false,
                inputValue,
                image,
                text
            }));
        }
    }

    onValueChange({ key, value, error, errorMessage }) {
        this.setState(prev => ({
            ...prev,
            inputValue: value
        }));
    }

    validate() {
        const {onValidate} = this.props;
        const {inputValue, text} = this.state;
        const isValid = (inputValue || this.props.inputValue) === text;
        this.setState(prev => ({
            ...prev,
            isValid
        }));
        onValidate(isValid);
    }

    reload() {
        const {onReload} = this.props;
        return Promise.resolve(this.setState(prev => ({
            ...prev,
            inputValue: '',
            image: '',
            inputDisabled: true,
            hasLoaded: false
        })))
            .then(_ => {
                onReload();
            });
    }

    imageSection() {
        const {image, isValid, hasLoaded} = this.state;
        const reload = isValid ? () => {} : this.reload;
        return (
            <div className={style.captchaLoading}>
                <div className={style.captchaBox}>
                    {hasLoaded && <img src={`data:image/svg+xml;utf8,${encodeURIComponent(image)}`} />}
                    {!hasLoaded && <div className={style.loadingLabel}><span>Loading... / Cargando... </span></div>}
                    <div
                        className={isValid ? style.reloadBtnSuccess : style.reloadBtn}
                        onClick={reload}
                        disabled={!hasLoaded || isValid}
                    >
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const {isValid} = this.state;
        const validateLabel = 'Validate / Validar';
        const validate = isValid ? () => {} : this.validate;
        return (
            <div className={style.captchaWrapper}>
                {this.imageSection()}
                <div className={style.captchaInput}>
                    {this.props.children}
                </div>
                <div className={style.captchaBtns}>
                    <Button key='captcha-btn'
                        className='standardBtn loginBtn captchaBtnValidate'
                        type='submit'
                        label={validateLabel}
                        onClick={validate}
                        disabled={isValid}
                    />
                </div>
            </div>
        );
    }
}

SimpleCaptcha.propTypes = {
    text: PropTypes.string,
    inputValue: PropTypes.string,
    image: PropTypes.string,
    onReload: PropTypes.func,
    onValidate: PropTypes.func,
    children: PropTypes.node.isRequired
};

SimpleCaptcha.defaultProps = {
    text: '',
    image: '',
    onReload: () => {},
    onValidate: () => {}
};

export default SimpleCaptcha;
