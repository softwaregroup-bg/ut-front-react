import React, { PropTypes } from 'react';
import classNames from 'classnames';
import Icon from '../../../components/Icon';
import styles from './styles.css';

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
    message: PropTypes.string.isRequired
};

export default FormErrorMessage;
