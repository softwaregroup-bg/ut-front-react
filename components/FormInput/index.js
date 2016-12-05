import React, { PropTypes} from 'react';
import styles from './styles.css';
import { getClass } from '../../utils/helpers';

const FormInput = ({
    type,
    label,
    name,
    placeholder,
    className,
    onBlur,
    onChange,
    onFocus
}) => {
    return (
        <div className={getClass(styles, className)}>
            { label ? <label className='label' placeholder={placeholder}>{label}</label> : false }
            <input name={name} type={type} onChange={onChange} onFocus={onFocus} onBlur={onBlur} />
        </div>
    )
}

FormInput.defaultProps = {
    className: "formInput"
}

FormInput.propTypes = {
    type: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func
};

export default FormInput;
