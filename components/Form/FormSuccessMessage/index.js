import React, { PropTypes } from 'react';
import styles from './styles.css';
import Text from '../../Text';

const FormSuccessMessage = ({ message }) => {
    return (
        <div className={styles.formSuccess}>
            <div className={styles.successIcon} />
            <div className={styles.successMessage}><Text>{message}</Text></div>
        </div>
    );
};

FormSuccessMessage.propTypes = {
    message: PropTypes.string.isRequired,
    useNew: PropTypes.bool
};

export default FormSuccessMessage;
