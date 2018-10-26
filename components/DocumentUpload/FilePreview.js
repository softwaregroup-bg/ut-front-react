import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import UploadFileButton from './UploadFileButton';
import AddFileButton from './AddFileButton';
import Cropper from './Cropper';
import PreviewItem from './PreviewItem';
import styles from './styles.css';

// The component is a class because a ref is needed. Please do not change it.
export default class FilePreview extends Component {
    get changeFileButton() {
        const { uploadMethod, changeMode, onFileLoaded, allowedFileTypes } = this.props;

        if (uploadMethod === 'take') {
            return (
                <AddFileButton
                    className={styles.changeFileBtn}
                    label='Retake'
                    icon={styles.changeBtn}
                    onClick={() => { changeMode('takePhoto'); }} />
            );
        }

        return (
            <UploadFileButton
                className={styles.changeFileBtn}
                acceptType={allowedFileTypes}
                label='Change'
                icon={styles.changeBtn}
                onFileLoaded={onFileLoaded} />
        );
    }

    get cropButton() {
        const { showCrop, crop } = this.props;

        return (
            showCrop && <AddFileButton
                className={styles.cropButton}
                icon={styles.cropIcon}
                label='Crop'
                onClick={crop} />
        );
    }

    render() {
        const {
            className,
            file,
            fileExtension,
            fileDimensions,
            originalFilename,
            showCrop,
            onCrop,
            cropDimensions
        } = this.props;

        return (
            <div className={classnames(styles.filePreviewContainer, className)}>
                { showCrop ? <Cropper
                    ref='editPhoto'
                    file={file}
                    fileDimensions={fileDimensions}
                    cropDimensions={cropDimensions}
                    onCrop={onCrop} /> : <PreviewItem
                        file={file}
                        fileExtension={fileExtension}
                        originalFilename={originalFilename}
                        previewBoxWidth={fileDimensions.width}
                        previewBoxHeight={fileDimensions.height} />
                }
                <div className={classnames(styles.imageButtonsContainer)}>
                    { this.changeFileButton }
                    { this.cropButton }
                </div>
            </div>
        );
    }
};

FilePreview.propTypes = {
    className: PropTypes.string,
    file: PreviewItem.propTypes.file,
    fileExtension: PreviewItem.propTypes.fileExtension,
    originalFilename: PreviewItem.propTypes.fileExtension,
    showCrop: PropTypes.bool,
    fileDimensions: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    cropDimensions: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    uploadMethod: PropTypes.string,
    onFileLoaded: PropTypes.func,
    changeMode: PropTypes.func,
    crop: PropTypes.func,
    allowedFileTypes: UploadFileButton.propTypes.acceptType,
    onCrop: PropTypes.func
};
