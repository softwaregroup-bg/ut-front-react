import React, { PropTypes } from 'react';
import Popup from '../Popup';

import styles from './style.css';
import formErrorMessageStyles from '../Form/FormErrorMessage/styles.css';
import classnames from 'classnames';

const ErrorWindow = ({open, message, close, title, type, logout}) => {
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
        let goToLoginHandler = () => {
            logout();
        };
        actionButtons = [
            {
                label: 'Go to login',
                styleType: 'primaryDialog', // secondaryDialog
                disabled: false,
                onClick: goToLoginHandler
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

ErrorWindow.contextTypes = {
    router: PropTypes.object
};

ErrorWindow.propTypes = {
    open: PropTypes.bool,
    message: PropTypes.node,
    title: PropTypes.string,
    type: PropTypes.string,
    close: PropTypes.func,
    logout: PropTypes.func
};

ErrorWindow.defaultProps = {
    open: true,
    title: 'ERROR',
    type: '',
    logout: () => {}
};

export default ErrorWindow;
