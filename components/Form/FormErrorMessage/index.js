import React, { PropTypes } from 'react';
import Icon from '../../../components/Icon';
import styles from './styles.css';
import { getClass } from '../../../utils/helpers';

// TODO: refactor
const FormErrorMessage = ({ message, useNew }) => {
    return (
        <div className={getClass(styles, useNew ? 'formErrorNew' : 'formError')}>
            {!useNew ? <div className={styles.iconWrapper}>
                            <Icon icon='error' />
                        </div> : false }
            <div className={getClass(styles, useNew ? 'errorMessageNew' : 'errorMessage')}>{message}</div>
        </div>
    );
};

FormErrorMessage.propTypes = {
    message: PropTypes.string.isRequired,
    useNew: PropTypes.bool
};

export default FormErrorMessage;
