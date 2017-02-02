import React, { PropTypes } from 'react';
import addFilePopupStyles from './styles.css';
import Popup from '../Popup';
import AddFileMenu from '../AddFileMenu';
import FileUpload from '../FileUpload';

const AddFilePopup = ({
    isOpen,
    hasOverlay,
    headerClass,
    headerText,
    footerClass,
    buttonsClass,
    closeOnOverlayClick,
    actionButtons,
    file,
    addFileOption,
    addFile,
    closePopup
}) => (
    <Popup className={addFilePopupStyles.addFilePopup}
      isOpen={isOpen}
      hasOverlay={hasOverlay}
      headerClass={headerClass}
      headerText={headerText}
      footerClass={footerClass}
      buttonsClass={buttonsClass}
      closeOnOverlayClick={closeOnOverlayClick}
      closePopup={closePopup}
      actionButtons={actionButtons}>
        {children}
        {addFileOption === 'initial'? <AddFileMenu onAddFile={addFile} /> :
        <FileUpload file={file} uploadType={addFileOption} />}
    </Popup>
);

AddFilePopup.propTypes = {
    isOpen: PropTypes.bool,
    hasOverlay: PropTypes.bool,
    headerText: PropTypes.string,
    actionButtons: PropTypes.array,
    closePopup: PropTypes.func
};

export default AddFilePopup;
