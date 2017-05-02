import React, { PropTypes } from 'react';
import classnames from 'classnames';
import UploadFileButton from './UploadFileButton';
import AddFileButton from './AddFileButton';
import styles from './styles.css';

const DocumentUploadMenu = ({
    className,
    onFileLoaded,
    allowedFileTypes,
    onAddFile,
    uploadType
}) => {
    let allowedTypes = allowedFileTypes.join(',');
    return (
        <div className={classnames(styles.menuContainer, className)}>
            <UploadFileButton
              icon={styles.galleryIcon}
              label='Upload photo'
              acceptType={allowedTypes}
              onFileLoaded={onFileLoaded} />
            <AddFileButton
              label={'Take photo'}
              onClick={onAddFile}
              icon={styles.takePhotoIcon} />
        </div>
    );
};

DocumentUploadMenu.propTypes = {
    className: PropTypes.string,
    onFileLoaded: PropTypes.func,
    allowedFileTypes: PropTypes.array,
    uploadType: PropTypes.oneOf(['documents', 'photos', 'both']),
    onAddFile: PropTypes.func
};

export default DocumentUploadMenu;
