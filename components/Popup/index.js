import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import classnames from 'classnames';

import Header from './Header.js';
import Footer from './Footer.js';

import styles from './styles.css';

class PopupInternal extends Component {
    constructor() {
        super();
        this.state = {
            contentMaxHeight: '',
            contentMaxWidth: ''
        };
        this.handleWindowResize = debounce(this.handleWindowResize.bind(this), 100);
        this.updateContentDimensions = this.updateContentDimensions.bind(this);
        this.handleEsc = this.handleEsc.bind(this);
    }

    componentWillMount() {
        window.addEventListener('resize', this.handleWindowResize);

        this.zIndexDialog = zIndexDialog++;
        this.zIndexOverlay = zIndexOverlay++;
    }

    componentDidMount() {
        const { closeOnEsc } = this.props;

        if (closeOnEsc) {
            document.addEventListener('keydown', this.handleEsc);
        }
        this.updateContentDimensions();
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleEsc);
        window.removeEventListener('resize', this.handleWindowResize);

        zIndexDialog--;
        zIndexOverlay--;
    }

    handleWindowResize() {
        this.updateContentDimensions();
    }

    updateContentDimensions() {
        let contentMaxHeight = window.innerHeight - POPUP_MIN_OFFSETS - POPUP_HEADER_HEIGHT - POPUP_FOOTER_HEIGHT;
        const contentMaxWidth = window.innerWidth - POPUP_MIN_SIDE_OFFSETS;

        if (this.props.staticContentTop) {
            contentMaxHeight -= this.staticTop.clientHeight;
        }

        if (this.props.staticContentBottom) {
            contentMaxHeight -= this.staticBottom.clientHeight;
        }

        this.setState({
            contentMaxWidth: `${contentMaxWidth}px`,
            contentMaxHeight: `${contentMaxHeight}px`
        });
    }

    handleEsc({ keyCode }) {
        const { closePopup } = this.props;

        if (keyCode === 27) {
            closePopup();
        }
    }

    get contentWidth() {
        const { contentMaxWidth } = this.state;
        const style = {
            maxWidth: contentMaxWidth
        };
        if (this.props.fullWidth) {
            style.minWidth = contentMaxWidth;
        }
        return style;
    }

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
            <div className={classnames(styles.popupContainer, className)}>
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
        const { isOpen, fullWidth, classes, closePopup, closeOnOverlayClick } = this.props;

        return (
            <Dialog open={isOpen} fullWidth={fullWidth} onClose={closePopup} disableBackdropClick={!closeOnOverlayClick} maxWidth='xl'>
                <DialogContent className={classnames(classes.root)}>
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
    classes: PropTypes.object,
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

export default withStyles(({palette}) => ({
    root: {
        padding: 0,
        '&:first-child': {
            paddingTop: 0
        }
    }
}))(Popup);
