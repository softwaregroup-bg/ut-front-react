import React, { PropTypes } from 'react';
import { Portal } from 'react-overlays';
import classnames from 'classnames';
import Header from './Header.js';
import Footer from './Footer.js';
import styles from './styles.css';

const Popup = ({
    isOpen,
    className,
    hasOverlay,
    closeOnOverlayClick,
    header,
    footer,
    children,
    closePopup
}) => {
    return (
        <Portal container={() => { return document.getElementById('controls'); }}>
            { isOpen ? <div className={styles.modalContainer}>
                { hasOverlay ? <div className={styles.modalOverlay} onClick={closeOnOverlayClick ? closePopup : null} /> : false }
                <div className={classnames(styles.popupContainer, className)}>
                    { header ? <Header className={header.className} text={header.text} closePopup={closePopup} /> : false }
                    { children }
                    { footer ? <Footer className={footer.className} actionButtons={footer.actionButtons} /> : false }
                </div>
            </div> : false }
        </Portal>
    );
};

Popup.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    className: PropTypes.string,
    hasOverlay: PropTypes.bool,
    closeOnOverlayClick: PropTypes.bool,
    header: PropTypes.object,
    footer: PropTypes.object,
    children: PropTypes.array,
    closePopup: PropTypes.func
};

Popup.defaultProps = {
    hasOverlay: true,
    closeOnOverlayClick: false
};

export default Popup;
