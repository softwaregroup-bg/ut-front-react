import React, { PropTypes} from 'react';
import styles from './styles.css';
import { getClass } from '../../utils/helpers';

const FormInput = ({
    type,
    label,
    placeholder,
    className,
    onBlur,
    onChange,
    onFocus
}) => (
    <div className={getClass(styles, className)}>
        { label ? <label className='label' placeholder={placeholder}>{label}</label> : false }
        <input type={type} onChange={onChange} onFocus={onFocus} onBlur={onBlur} />
    </div>

);

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
