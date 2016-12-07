import React, { PropTypes } from 'react';
import styles from './styles.css';

export default const FormErrorMessage = ({ message }) => {
    return (
        <div className={styles.formError}>
            <div className={styles.errorImage}></div>
            <span className={styles.errorMessage}>{message}</span>
        </div>
    );
}
