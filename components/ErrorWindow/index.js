import React, { PropTypes } from 'react';
import Popup from '../Popup';

import styles from './style.css';
import formErrorMessageStyles from '../Form/FormErrorMessage/styles.css';
import classnames from 'classnames';

const ErrorWindow = ({open, message, close, title, type}) => {
    let closePopUpHandler = close;
    let header = {text: title};
    let actionButtons = [
        {
            label: 'Close',
            styleType: 'primaryDialog',
            disabled: false,
            onClick: closePopUpHandler
        }
    ];

    if (type === 'identity.invalidCredentials') {
        closePopUpHandler = undefined;
        header.closeIcon = false; // remove close icon
        actionButtons = [
            {
                label: 'Go to login',
                styleType: 'primaryDialog', // secondaryDialog
                href: '/login' // migh be a good idea to pass it from outside. However, the http server handles each request, in case of invalid session redirects to the accroding login page
            }
        ];
    };

    return (
      <Popup
        isOpen={open}
        header={header}
        footer={{ actionButtons: actionButtons }}
        closePopup={closePopUpHandler} >
          <div className={classnames(styles.errorIconWrap, formErrorMessageStyles.errorIcon)} />
          <div className={styles.errorMessageWrap}>
            {message}
          </div>
      </Popup>
    );
};

ErrorWindow.propTypes = {
    open: PropTypes.bool,
    close: PropTypes.func,
    message: PropTypes.node,
    title: PropTypes.string,
    type: PropTypes.string
};

ErrorWindow.defaultProps = {
    open: true,
    title: 'ERROR',
    type: ''
};

export default ErrorWindow;
