import React, { PropTypes } from 'react';
import { Portal } from 'react-overlays';
import classnames from 'classnames';
import Header from './Header.js';
import Footer from './Footer.js';
import styles from './styles.css';

const Popup = ({
    isOpen,
    container,
    className,
    hasOverlay,
    closeOnOverlayClick,
    header,
    footer,
    children,
    closePopup
}) => {
    /* The Portal component renders its children into a new subtree outside of current component hierarchy. */
    /* Its children will be appended to the [container] specified (default: div#controls, located in the Layout component) */
    return (
        <Portal container={() => { return document.getElementById(container); }}>
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
    container: PropTypes.string,
    className: PropTypes.string,
    hasOverlay: PropTypes.bool,
    closeOnOverlayClick: PropTypes.bool,
    header: PropTypes.object,
    footer: PropTypes.object,
    children: PropTypes.oneOfType([
        React.PropTypes.array,
        React.PropTypes.object
    ]),
    closePopup: PropTypes.func
};

Popup.defaultProps = {
    hasOverlay: true,
    container: 'controls',
    closeOnOverlayClick: false
};

export default Popup;
