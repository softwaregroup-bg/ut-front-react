import PropTypes from 'prop-types';
import React from 'react';
import Text from '../../Text';
import styles from './styles.css';

const FormErrorMessage = ({ message }) => {
    return (
        <div className={styles.formError}>
            <div className={styles.errorIcon} />
            <div className={styles.errorMessage}><Text>{message}</Text></div>
        </div>
    );
};

FormErrorMessage.propTypes = {
    message: PropTypes.string.isRequired,
    useNew: PropTypes.bool
};

export default FormErrorMessage;
