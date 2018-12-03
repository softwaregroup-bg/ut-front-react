import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import debounce from 'lodash.debounce';
import RenderToLayer from './RenderToLayer';
import Header from './Header.js';
import Footer from './Footer.js';
import {
    POPUP_MIN_OFFSETS,
    POPUP_HEADER_HEIGHT,
    POPUP_FOOTER_HEIGHT,
    POPUP_MIN_SIDE_OFFSETS
} from './config';

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
    }

    handleWindowResize() {
        this.updateContentDimensions();
    }

    updateContentDimensions() {
        const contentMaxHeight = window.innerHeight - POPUP_MIN_OFFSETS - POPUP_HEADER_HEIGHT - POPUP_FOOTER_HEIGHT;
        const contentMaxWidth = window.innerWidth - POPUP_MIN_SIDE_OFFSETS;

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
        var style = {
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
            hasOverlay,
            closeOnOverlayClick,
            header,
            footer,
            children,
            closePopup
        } = this.props;

        return (
            <div className={styles.modalContainer}>
                { hasOverlay && <div className={styles.modalOverlay} onClick={closeOnOverlayClick ? closePopup : null} /> }
                <div style={this.contentWidth} className={classnames(styles.popupContainer, className)}>
                    { header && <Header className={header.className} text={header.text} closePopup={closePopup} closeIcon={header.closeIcon} /> }
                    <div style={{maxHeight: this.state.contentMaxHeight}} className={classnames(styles.popupContent, contentClassName)}>
                        { children }
                    </div>
                    { footer && <Footer leftNode={footer.leftNode} className={footer.className} actionButtons={footer.actionButtons} /> }
                </div>
            </div>
        );
    }
}

PopupInternal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    container: PropTypes.string,
    className: PropTypes.string,
    contentClassName: PropTypes.string,
    hasOverlay: PropTypes.bool,
    closeOnOverlayClick: PropTypes.bool,
    closeOnEsc: PropTypes.bool,
    header: PropTypes.shape({
        className: PropTypes.string,
        text: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.object]),
        closeIcon: PropTypes.bool
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

PopupInternal.defaultProps = {
    fullWidth: false,
    hasOverlay: true,
    container: 'controls',
    closeOnOverlayClick: false
};

class Popup extends Component {
    constructor() {
        super();

        this.renderLayer = this.renderLayer.bind(this);
    }

    renderLayer() {
        return <PopupInternal {...this.props} />;
    }

    render() {
        const { isOpen } = this.props;

        return (
            <RenderToLayer render={this.renderLayer} open={isOpen} />
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
