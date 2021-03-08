import PropTypes from 'prop-types';
import React, { Component } from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import classnames from 'classnames';

import Header from './Header.js';
import Footer from './Footer.js';

import styles from './styles.css';

class PopupInternal extends Component {
    render() {
        const {
            className,
            contentClassName,
            header,
            staticContentTop,
            staticContentBottom,
            footer,
            children,
            closePopup
        } = this.props;

        return (
            <div className={classnames(className)}>
                {header && <Header className={header.className} text={header.text} closePopup={closePopup} closeIcon={header.closeIcon} />}
                {staticContentTop && <div ref={(staticTop) => { this.staticTop = staticTop; }} className={classnames(styles.staticContentTop, staticContentTop.className)}>
                    {staticContentTop.content}
                </div>}
                <div className={classnames(styles.popupContent, contentClassName)}>
                    {children}
                </div>
                {staticContentBottom && <div ref={(staticBottom) => { this.staticBottom = staticBottom; }} className={classnames(styles.staticContentBottom, staticContentBottom.className)}>
                    {staticContentBottom.content}
                </div>}
                {footer && <Footer leftNode={footer.leftNode} rightNode={footer.rightNode} className={footer.className} actionButtons={footer.actionButtons} />}
            </div>
        );
    }
}

PopupInternal.propTypes = {
    className: PropTypes.string,
    contentClassName: PropTypes.string,
    header: PropTypes.shape({
        className: PropTypes.string,
        text: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.object]),
        closeIcon: PropTypes.bool
    }),
    staticContentTop: PropTypes.shape({
        className: PropTypes.string,
        content: PropTypes.node
    }),
    staticContentBottom: PropTypes.shape({
        className: PropTypes.string,
        content: PropTypes.node
    }),
    footer: PropTypes.shape({
        className: PropTypes.string,
        actionButtons: PropTypes.arrayOf(PropTypes.shape({
            className: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
            label: PropTypes.string,
            onClick: PropTypes.func
        })),
        rightNode: PropTypes.node,
        leftNode: PropTypes.node
    }),
    children: PropTypes.any,
    closePopup: PropTypes.func
};

class Popup extends Component {
    render() {
        const { isOpen, fullWidth, closePopup, closeOnOverlayClick } = this.props;

        return (
            <Dialog open={isOpen} fullWidth={fullWidth} onClose={closePopup} disableBackdropClick={!closeOnOverlayClick} maxWidth='xl'>
                <DialogContent>
                    <PopupInternal {...this.props} />
                </DialogContent>
            </Dialog>
        );
    }
}

Popup.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    container: PropTypes.string,
    className: PropTypes.string,
    contentClassName: PropTypes.string,
    hasOverlay: PropTypes.bool,
    closeOnOverlayClick: PropTypes.bool,
    header: PropTypes.shape({
        className: PropTypes.string,
        text: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.object])
    }),
    staticContentTop: PropTypes.shape({
        className: PropTypes.string,
        content: PropTypes.node
    }),
    staticContentBottom: PropTypes.shape({
        className: PropTypes.string,
        content: PropTypes.node
    }),
    footer: PropTypes.shape({
        className: PropTypes.string,
        actionButtons: PropTypes.arrayOf(PropTypes.shape({
            className: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
            label: PropTypes.string,
            onClick: PropTypes.func
        })),
        leftNode: PropTypes.node
    }),
    fullWidth: PropTypes.bool,
    children: PropTypes.any,
    closePopup: PropTypes.func
};

Popup.defaultProps = {
    fullWidth: false,
    hasOverlay: true,
    container: 'controls',
    closeOnOverlayClick: false
};

export default Popup;
