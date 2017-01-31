import React, { PropTypes } from 'react';
import Overlay from '../Overlay';
import StandardButton from '../StandardButton';
import popupStyles from './styles.css';
import { Portal } from 'react-overlays';

const Popup = ({
    isOpen,
    headerClass,
    headerText,
    footerClass,
    hasOverlay,
    closeOnOverlayClick,
    actionButtons,
    closePopup,
    children
}) => (
    <Portal container={ () => { return document.getElementById('controls')}}>
        { isOpen ? <div className={popupStyles.modalContainer}>
            { hasOverlay ? <Overlay onClick={closeOnOverlayClick ? closePopup : null}/> : false }
            <div className={popupStyles.popupContainer}>
                <div className={popupStyles.popupHeader + ' ' + headerClass}>
                    <span className={popupStyles.headerText}>{headerText}</span>
                    <StandardButton className={popupStyles.closeBtn} onClick={closePopup}/>
                </div>
                <div className={popupStyles.popupBody}>
                    {children}
                </div>
                <div className={popupStyles.popupFooter}>
                    {actionButtons ? actionButtons : false}
                    <StandardButton className={popupStyles.closePopupBtn} label={'Cancel'} onClick={closePopup}/>
                </div>
            </div>
        </div> : false }
    </Portal>
);

Popup.propTypes = {
    isOpen: PropTypes.bool,
    headerClass: PropTypes.string,
    headerText: PropTypes.string,
    footerClass: PropTypes.string,
    hasOverlay: PropTypes.bool,
    closeOnOverlayClick: PropTypes.bool,
    actionButtons: PropTypes.array,
    closePopup: PropTypes.func,
    children: PropTypes.object
}

export default Popup;
