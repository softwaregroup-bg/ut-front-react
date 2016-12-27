import React, { PropTypes } from 'react';
import style from './style.css';

const RadioInput = ({label, onChange, defaultValue, options, disabled}) => (
    <div className={style.outerWrap}>
        <div className={style.lableWrap}>
            {label}
        </div>
        <div className={style.inputWrap}>
            {options.map(({id, name, label, value}) => {
                let handleChange = () => onChange({id, key: name, label, value});
                return (
                    <span className={style.radio} key={id}>
                        <input disabled={disabled} onChange={handleChange} checked={defaultValue === value} id={id} type='radio' name={name} />
                        <label htmlFor={id}>{label}</label>
                    </span>
                );
            })}
        </div>
    </div>
);

RadioInput.propTypes = {
    label: PropTypes.string,
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    disabled: PropTypes.bool
};

RadioInput.defaultProps = {
    onChange: function() {}
};

export default RadioInput;
