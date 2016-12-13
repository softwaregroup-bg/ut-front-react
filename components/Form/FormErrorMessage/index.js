import React, { PropTypes } from 'react';
import Icon from '../../../components/Icon';
import styles from './styles.css';

// TODO: refactor
const FormErrorMessage = ({ message, useNew }) => {
    return (
      useNew ?
        <div className={styles.formErrorNew}>
            <div className={styles.errorMessageNew}>{ message }</div>
        </div> :
        <div className={styles.formError}>
            <div className={styles.iconWrapper}>
                <Icon icon='error' />
            </div>
            <div className={styles.errorMessage}>{message}</div>
        </div>
    );
};

FormErrorMessage.propTypes = {
    message: PropTypes.string.isRequired,
    useNew: PropTypes.bool
};

export default FormErrorMessage;
