import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Popup from '../Popup';
import DocumentUploadMenu from './DocumentUploadMenu';
import Camera from './Camera';
import FilePreview from './FilePreview';
import { POPUP_MIN_OFFSETS, POPUP_HEADER_HEIGHT, POPUP_FOOTER_HEIGHT, POPUP_PADDING } from '../Popup/config';
import { DEFAULT_ASPECT_RATIO } from './config';
import { getFileDimensions, getViewport } from '../../utils/image';
import styles from './styles.css';
import { getFileExtension } from './helpers';

export default class DocumentUpload extends Component {
    constructor() {
        super();

        this.initialState = {
            mode: 'initial',
            uploadMethod: '',
            screenshot: null,
            fileExtension: '',
            fileSize: null,
            fileDimensions: {},
            showCrop: false,
            hasCropped: false,
            shouldUse: false,
            isUploading: false,
            errorUpload: null
        };

        this.state = this.initialState;

        this.changeMode = this.changeMode.bind(this);

        this.setUploadMethod = this.setUploadMethod.bind(this);

        this.takePhoto = this.takePhoto.bind(this);

        this.onAddFile = this.onAddFile.bind(this);

        this.onUploadFile = this.onUploadFile.bind(this);

        this.onfileUse = this.onfileUse.bind(this);

        this.getFileDimensions = this.getFileDimensions.bind(this);

        this.crop = this.crop.bind(this);

        this.onCrop = this.onCrop.bind(this);

        this.uploadFile = this.uploadFile.bind(this);

        this.setError = this.setError.bind(this);
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (this.props.isOpen && !nextProps.isOpen) {
            this.setState(this.initialState);
        }
    }

    changeMode(mode) {
        this.setState({
            mode
        });
    }

    setUploadMethod(uploadMethod) {
        this.setState({
            uploadMethod
        });
    }

    onAddFile() {
        // calculate camera dimensions
        const fileDimensions = this.getFileDimensions();

        this.setState({
            fileDimensions,
            uploadMethod: 'take',
            mode: 'takePhoto'
        });
    }

    onUploadFile(file, fileObj) {
        const fileDimensions = this.getFileDimensions(file);
        const extension = getFileExtension(fileObj.name);

        // This is done so the crop gets umnounteted (in cases where an image is loaded and then changed without cropping)
        this.setState({
            showCrop: false
        }, () => {
            this.setState({
                screenshot: file,
                fileExtension: extension,
                originalFilename: fileObj.name,
                fileSize: fileObj.size,
                uploadMethod: 'upload',
                mode: 'preview',
                fileDimensions,
                showCrop: !this.props.hideCrop && true
            });
        });
    }

    takePhoto() {
        const screenshot = this.refs.takePhoto.getScreenshot();

        // This is done so the crop gets umnounteted (in cases where an image is loaded and then changed without cropping)
        this.setState({
            showCrop: false
        }, () => {
            this.setState({
                uploadMethod: 'take',
                mode: 'preview',
                showCrop: !this.props.hideCrop && true,
                fileExtension: 'png',
                screenshot
            });
        });
    }

    onfileUse() {
        const { screenshot, hasCropped } = this.state;

        // If the user has cropped, use the file, otherwise crop the visible area first and then use the file
        if (this.props.hideCrop || hasCropped) {
            this.uploadFile(screenshot, this.props.uploadURL);
        } else {
            this.crop();

            this.setState({
                shouldUse: true
            });
        }
    }

    getFileDimensions(file) {
        const fileDimensions = getFileDimensions(file);
        const { aspectRatio } = fileDimensions;
        const scaleRatio = aspectRatio || DEFAULT_ASPECT_RATIO;
        const height = window.innerHeight - POPUP_MIN_OFFSETS - POPUP_HEADER_HEIGHT - POPUP_FOOTER_HEIGHT - 2 * POPUP_PADDING;

        return {
            width: height * scaleRatio >> 0,
            height: height >> 0
        };
    }

    crop() {
        this.refs.filePreview.refs.editPhoto.cropImage();
    }

    onCrop(screenshot) {
        const { shouldUse } = this.state;

        if (shouldUse) {
            this.uploadFile(screenshot);
        } else {
            this.setState({
                screenshot,
                showCrop: false,
                hasCropped: true
            });
        }
    }

    get view() {
        const { mode, uploadMethod, fileDimensions } = this.state;
        const { scaleDimensions, allowedFileTypes, hideCrop, uploadType } = this.props;

        if (mode === 'initial') {
            return (
                <DocumentUploadMenu
                    menuItems={['file', 'camera']}
                    className={styles.initialViewContainer}
                    onAddFile={this.onAddFile}
                    allowedFileTypes={allowedFileTypes}
                    onFileLoaded={this.onUploadFile}
                    uploadType={uploadType}
                />
            );
        }

        if (mode === 'takePhoto') {
            return (
                <Camera
                    ref='takePhoto'
                    width={fileDimensions.width}
                    height={fileDimensions.height}
                />
            );
        }

        if (mode === 'preview') {
            return (
                <div>
                    <div className={this.validate && styles.hidden}>
                        <FilePreview
                            ref='filePreview'
                            file={this.state.screenshot}
                            fileExtension={this.state.fileExtension}
                            originalFilename={this.state.originalFilename}
                            showCrop={!hideCrop || this.state.showCrop}
                            onCrop={this.onCrop}
                            fileDimensions={fileDimensions}
                            scaleDimensions={scaleDimensions}
                            cropDimensions={this.cropDimensions}
                            uploadMethod={uploadMethod}
                            uploadType={uploadType}
                            onFileLoaded={this.onUploadFile}
                            changeMode={this.changeMode}
                            allowedFileTypes={allowedFileTypes.join(',')}
                            crop={this.crop}
                        />
                    </div>
                    {this.validate && <div className={styles.errorMsg}>
                        Error: {this.validate}
                    </div>}
                </div>);
        }
    }

    get validate() {
        // file validation
        const { allowedFileTypes, maxFileSize } = this.props;
        const { fileExtension, fileSize } = this.state;
        if ((!allowedFileTypes.map((tp) => (tp.split('.').pop() || '').toLowerCase()).includes((fileExtension || '').toLowerCase())) || (fileSize > this.maxFileSize)) {
            return `Please use file types ${allowedFileTypes.join(', ')} and file size up to ${parseInt((maxFileSize) / 1024)}MB per document`;
        } else return null;
    }

    get maxFileSize() {
        return this.props.maxFileSize * 1024;
    }

    get actionButtons() {
        const { closePopup } = this.props;
        const { mode } = this.state;

        const actionButtons = [{
            label: 'Cancel',
            styleType: 'secondaryDialog',
            onClick: closePopup
        }];

        if (mode === 'takePhoto') {
            actionButtons.unshift({
                name: 'take',
                label: 'Take',
                styleType: 'secondaryLight',
                onClick: this.takePhoto
            });
        }

        if (mode === 'preview') {
            const handler = this.props.isAdditionalContentValid ? this.onfileUse : this.props.additionalContentValidate;
            !this.validate && actionButtons.unshift({
                name: 'use',
                label: 'Use',
                disabled: this.state.isUploading,
                styleType: 'secondaryLight',
                onClick: handler
            });
        }

        return actionButtons;
    }

    get details() {
        const { popupType } = this.props;

        return popupType === 'detailed' && <div />;
    }

    get cropDimensions() {
        const { fileDimensions, uploadMethod } = this.state;
        const { scaleDimensions, documentType } = this.props;

        // this is done for documents with aspectRatio 4/3; no crop viewport is needed in this case;
        // the crop component is preserved, so the zoom is still available to the user
        if (documentType !== 'profilePhoto' && uploadMethod === 'take') {
            return fileDimensions;
        }

        return getViewport(fileDimensions, scaleDimensions);
    }

    uploadFile = async (file, uploadURL = '/file-upload') => {
        const {
            fileUse,
            uploadDocument
        } = this.props;
        const data = new window.FormData();
        const img = this.dataURItoBlob(file);
        const ext = this.state.fileExtension || 'unknown';
        data.append('file', img, 'file.' + ext);
        this.setState({
            isUploading: true
        });
        const attachmentResult = await uploadDocument({
            formData: data
        });
        this.setState({
            isUploading: false
        });
        if (attachmentResult) {
            const reader = new window.FileReader();
            reader.onload = (data) => {
                try {
                    fileUse({
                        filename: attachmentResult.result.filename,
                        createdDate: new Date().toISOString(),
                        extension: ext,
                        contentType: attachmentResult.result.headers['content-type']
                    });
                } catch (e) {
                    this.setError(e);
                }
            };
            reader.readAsDataURL(img);
        }
    }

    dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        let byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0) {
            byteString = window.atob(dataURI.split(',')[1]);
        } else {
            byteString = unescape(dataURI.split(',')[1]);
        }
        // separate out the mime component
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        const ia = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new window.Blob([ia], { type: mimeString });
    }

    setError(errMsg) {
        this.setState({
            errorUpload: errMsg
        });
    }

    get displayError() {
        if (this.state.errorUpload) {
            return (
                <div className={styles.errorBox}>
                    {this.state.errorUpload}
                </div>
            );
        } else {
            return null;
        }
    }

    render() {
        const { isOpen, header, closePopup } = this.props;
        const { mode } = this.state;

        return (
            <Popup
                ref='popup'
                isOpen={isOpen}
                header={header}
                contentClassName={styles[mode + 'Container']}
                footer={{ actionButtons: this.actionButtons }}
                closePopup={closePopup}
            >
                <div>
                    {this.displayError}
                    {this.props.children}
                    {this.details}
                    {this.view}
                </div>
            </Popup>
        );
    }
}

DocumentUpload.defaultProps = {
    uploadDocument: () => ({}),
    fileUse: () => ({}),
    allowedFileTypes: ['.jpg', '.jpeg', '.png'],
    maxFileSize: 5 * 1024, // default maximum size 5MB
    hideCrop: false,
    additionalContentValidate: () => { },
    isAdditionalContentValid: true
};

DocumentUpload.propTypes = {
    isOpen: PropTypes.bool,
    header: PropTypes.object,
    popupType: PropTypes.string,
    documentType: PropTypes.string,
    scaleDimensions: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    uploadDocument: PropTypes.func,
    fileUse: PropTypes.func,
    closePopup: PropTypes.func,
    allowedFileTypes: PropTypes.array,
    maxFileSize: PropTypes.number, // file size in kb
    children: PropTypes.any,
    hideCrop: PropTypes.bool,
    uploadType: PropTypes.string,
    additionalContentValidate: PropTypes.func,
    isAdditionalContentValid: PropTypes.bool,
    uploadURL: PropTypes.string
};
