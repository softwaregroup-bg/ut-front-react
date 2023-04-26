import React from 'react';
import PropTypes from 'prop-types';
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
