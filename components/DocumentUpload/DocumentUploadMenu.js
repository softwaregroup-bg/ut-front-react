import React, { PropTypes } from 'react';
import classnames from 'classnames';
import UploadFileButton from './UploadFileButton';
import AddFileButton from './AddFileButton';
import styles from './styles.css';

const DocumentUploadMenu = ({
    className,
    onFileLoaded,
    onAddFile
}) => {
    return (
        <div className={classnames(styles.menuContainer, className)}>
            <UploadFileButton
              icon={styles.galleryIcon}
              label='Upload photo'
              acceptType='image/*, application/pdf'
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
    onAddFile: PropTypes.func
};

export default DocumentUploadMenu;
