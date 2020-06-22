import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import UploadFileButton from './UploadFileButton';
import AddFileButton from './AddFileButton';
import styles from './styles.css';

const DocumentUploadMenu = ({
    menuItems,
    className,
    onFileLoaded,
    allowedFileTypes,
    onAddFile,
    uploadType
}) => {
    let allowedTypes = allowedFileTypes.join(',');
    let btnPhoto = (
        <UploadFileButton
            icon={classnames(styles.uploadMenuIcon, styles.galleryIcon)}
            label='Upload photo'
            acceptType={allowedTypes}
            onFileLoaded={onFileLoaded} />
    );
    let btnFile = (
        <UploadFileButton
            icon={classnames(styles.uploadMenuIcon, styles.uploadFileIcon)}
            label='Upload file'
            acceptType={allowedTypes}
            onFileLoaded={onFileLoaded} />
    );
    let btnCamera = (
        <AddFileButton
            label={'Take photo'}
            onClick={onAddFile}
            icon={classnames(styles.uploadMenuIcon, styles.takePhotoIcon)} />
    );
    let buttons;
    if (menuItems && menuItems.length > 0) {
        buttons = menuItems.map((menuItemName, index) => {
            let btn;
            switch (menuItemName) {
                case 'photo':
                    btn = btnPhoto;
                    break;
                case 'file':
                    btn = btnFile;
                    break;
                case 'camera':
                    btn = btnCamera;
                    break;
            }
            return (
                <div className={styles.menuButton} key={index}>
                    {btn}
                </div>
            );
        });
    }
    return (
        <div className={classnames(styles.menuContainer, className)}>
            {buttons}
        </div>
    );
};

DocumentUploadMenu.propTypes = {
    menuItems: PropTypes.arrayOf(
        PropTypes.oneOf(['photo', 'file', 'camera'])
    ).isRequired,
    className: PropTypes.string,
    onFileLoaded: PropTypes.func,
    allowedFileTypes: PropTypes.array,
    uploadType: PropTypes.oneOf(['documents', 'photos', 'both']),
    onAddFile: PropTypes.func
};

export default DocumentUploadMenu;
