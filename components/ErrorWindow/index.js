import React, { PropTypes } from 'react';
import Popup from '../Popup';

import styles from './style.css';
import formErrorMessageStyles from '../Form/FormErrorMessage/styles.css';
import classnames from 'classnames';

const ErrorWindow = ({open, message, close, title, type, clearLoginState}) => {
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
            clearLoginState();
            this.context.router.push('/login'); // might be a good idea to pass it from outside. However, the http server handles each request, in case of invalid session redirects to the according login page
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
    clearLoginState: PropTypes.func
};

ErrorWindow.defaultProps = {
    open: true,
    title: 'ERROR',
    type: '',
    clearLoginState: () => {}
};

export default ErrorWindow;
