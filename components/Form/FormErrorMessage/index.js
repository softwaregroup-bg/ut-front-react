import React, { PropTypes } from 'react';
import Icon from '../../../components/Icon';
import styles from './styles.css';

const FormErrorMessage = ({ message }) => {
    return (
        <div className={styles.formError}>
            <div className={styles.iconWrapper}>
                <Icon icon='error' />
            </div>
            <div className={styles.errorMessage}>{message}</div>
        </div>
    );
};

FormErrorMessage.propTypes = {
    message: PropTypes.string.isRequired
};

export default FormErrorMessage;
