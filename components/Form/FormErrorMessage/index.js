import React, { PropTypes } from 'react';
import Icon from '../../../components/Icon';
import styles from './styles.css';
import { getClass } from '../../../utils/helpers';

// TODO: refactor
const FormErrorMessage = ({ message }) => {
    return (
        <div className={styles.formError}>
            <div className={styles.errorIcon}></div>
            <div className={styles.errorMessage}>{message}</div>
        </div>
    );
};

FormErrorMessage.propTypes = {
    message: PropTypes.string.isRequired,
    useNew: PropTypes.bool
};

export default FormErrorMessage;
