import React, { PropTypes } from 'react';
import style from './style.css';
import classnames from 'classnames';

const RadioInput = ({ label, boldLabel, errorMessage, isValid, onChange, defaultValue, options, disabled, optionClassName }) => {
    let zeroHeightStyle = isValid ? style.hh : '';
    return (
        <div className={style.outerWrap}>
            {label && <div className={classnames(style.lableWrap, {[style.boldLabel]: boldLabel})}>
                {label}
            </div>}
            <div className={style.inputWrap}>
                {options.map(({id, name, label, value}) => {
                    let handleChange = () => onChange({id, key: name, label, value});
                    return (
                        <span className={classnames(style.radio, optionClassName)} key={id}>
                            <input disabled={disabled} onChange={handleChange} checked={defaultValue === value} id={id} type='radio' name={name} />
                            <label htmlFor={id}>{label}</label>
                        </span>
                    );
                })}
                {errorMessage && <div className={classnames(style.errorWrap, zeroHeightStyle)}>{!isValid && <div className={style.errorMessage}>{errorMessage}</div>}</div>}
            </div>
        </div>
    );
};

RadioInput.propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    boldLabel: PropTypes.bool,
    optionClassName: PropTypes.string,
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    isValid: PropTypes.bool,
    errorMessage: PropTypes.string
};

RadioInput.defaultProps = {
    onChange: function() {},
    boldLabel: true,
    isValid: true
};

export default RadioInput;
