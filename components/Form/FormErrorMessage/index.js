import React, { PropTypes } from 'react';
import styles from './styles.css';

const FormErrorMessage = ({ message }) => {
    return (
        <div className={styles.formError}>
            <div className={styles.errorIcon} />
            <div className={styles.errorMessage}>{message}</div>
        </div>
    );
};

FormErrorMessage.propTypes = {
    message: PropTypes.string.isRequired,
    useNew: PropTypes.bool
};

export default FormErrorMessage;
