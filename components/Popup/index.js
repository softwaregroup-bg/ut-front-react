import React, { Component, PropTypes } from 'react';
import RenderToLayer from './RenderToLayer';
import classnames from 'classnames';
import Header from './Header.js';
import Footer from './Footer.js';
import styles from './styles.css';

const PopupInternal = ({
    isOpen,
    container,
    className,
    contentClassName,
    hasOverlay,
    closeOnOverlayClick,
    header,
    footer,
    children,
    closePopup
}) => {
    return (
        <div className={styles.modalContainer}>
            { hasOverlay && <div className={styles.modalOverlay} onClick={closeOnOverlayClick ? closePopup : null} /> }
            <div className={classnames(styles.popupContainer, className)}>
                { header && <Header className={header.className} text={header.text} closePopup={closePopup} /> }
                { children }
                { footer && <Footer className={footer.className} actionButtons={footer.actionButtons} /> }
            </div>
        </div>
    );
};

PopupInternal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    container: PropTypes.string,
    className: PropTypes.string,
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
    hasOverlay: PropTypes.bool,
    closeOnOverlayClick: PropTypes.bool,
    header: PropTypes.shape({
        className: PropTypes.string,
        text: PropTypes.string,
        closePopup: PropTypes.func
    }),
    contentClassName: PropTypes.string,
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

Popup.defaultProps = {
    hasOverlay: true,
    container: 'controls',
    closeOnOverlayClick: false
};

export default Popup;
