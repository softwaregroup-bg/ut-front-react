import React, { Component, PropTypes } from 'react';
import RenderToLayer from './RenderToLayer';
import classnames from 'classnames';
import Header from './Header.js';
import Footer from './Footer.js';
import styles from './styles.css';

class PopupInternal extends Component {
    constructor() {
        super();

        this.handleEsc = this.handleEsc.bind(this);
    }

    componentDidMount() {
        const { closeOnEsc } = this.props;

        if (closeOnEsc) {
            document.addEventListener('keydown', this.handleEsc);
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleEsc);
    }

    handleEsc(e) {
        const { keyCode } = e;
        const { closePopup } = this.props;

        if (keyCode === 27) {
            closePopup();
        }
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
                <div className={classnames(styles.popupContainer, className)}>
                    { header && <Header className={header.className} text={header.text} closePopup={closePopup} /> }
                    <div className={classnames(styles.popupContent, contentClassName)}>
                        { children }
                    </div>
                    { footer && <Footer className={footer.className} actionButtons={footer.actionButtons} /> }
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
        text: PropTypes.string,
        closePopup: PropTypes.func
    }),
    footer: PropTypes.shape({
        className: PropTypes.string,
        actionButtons: PropTypes.arrayOf(PropTypes.shape({
            className: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
            label: PropTypes.string,
            onClick: PropTypes.func
        }))
    }),
    children: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]),
    closePopup: PropTypes.func
};

PopupInternal.defaultProps = {
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
        text: PropTypes.string,
        closePopup: PropTypes.func
    }),
    footer: PropTypes.shape({
        className: PropTypes.string,
        actionButtons: PropTypes.arrayOf(PropTypes.shape({
            className: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
            label: PropTypes.string,
            onClick: PropTypes.func
        }))
    }),
    children: PropTypes.any,
    closePopup: PropTypes.func
};

Popup.defaultProps = {
    hasOverlay: true,
    container: 'controls',
    closeOnOverlayClick: false
};

export default Popup;
