import React, { PropTypes} from 'react';
import styles from './styles.css';

const FormInput = ({
    type,
    className,
    onBlur,
    onChange,
    onFocus
}) => (
    <input type={type}
           className={styles[className]}
           onChange={onChange}
           onFocus={onFocus}
           onBlur={onBlur}/>
)
