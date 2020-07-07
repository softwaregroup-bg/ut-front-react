import PropTypes from 'prop-types';
import React from 'react';
import Popup from '../Popup';

import styles from './style.css';
import formErrorMessageStyles from '../Form/FormErrorMessage/styles.css';
import classnames from 'classnames';

class ErrorWindow extends React.Component {
    render() {
        const {open, message, close, title, type, clearLoginState} = this.props;
        let closePopUpHandler = close;
        const header = {text: title};
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
            const goToLoginHandler = () => {
                clearLoginState();
                this.context.router.history.push('/login'); // might be a good idea to pass it from outside. However, the http server handles each request, in case of invalid session redirects to the according login page
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
                closePopup={closePopUpHandler}
            >
                <div className={classnames(styles.errorIconWrap, formErrorMessageStyles.errorIcon)} />
                <div className={styles.errorMessageWrap}>
                    {message}
                </div>
            </Popup>
        );
    };

    static contextTypes = {
        router: PropTypes.object
    };

    static propTypes = {
        open: PropTypes.bool,
        message: PropTypes.node,
        title: PropTypes.string,
        type: PropTypes.string,
        close: PropTypes.func,
        clearLoginState: PropTypes.func
    };

    static defaultProps = {
        open: true,
        title: 'ERROR',
        type: '',
        clearLoginState: () => {}
    };
}

export default ErrorWindow;
