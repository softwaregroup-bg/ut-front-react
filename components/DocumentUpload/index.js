import React, { Component, PropTypes } from 'react';
import Popup from '../Popup';
import DocumentUploadMenu from './DocumentUploadMenu';
import Camera from './Camera';
import FilePreview from './FilePreview';
import { POPUP_MIN_OFFSETS, POPUP_HEADER_HEIGHT, POPUP_FOOTER_HEIGHT, POPUP_PADDING } from '../Popup/config';
import { DEFAULT_ASPECT_RATIO } from './config';
import { getFileDimensions, getViewport } from '../../utils/image';
import styles from './styles.css';

export default class DocumentUpload extends Component {
    constructor() {
        super();

        this.initialState = {
            mode: 'initial',
            uploadMethod: '',
            screenshot: null,
            fileDimensions: {},
            showCrop: false,
            hasCropped: false,
            shouldUse: false
        };

        this.state = this.initialState;

        this.changeMode = this.changeMode.bind(this);

        this.setUploadMethod = this.setUploadMethod.bind(this);

        this.takePhoto = this.takePhoto.bind(this);

        this.onAddFile = this.onAddFile.bind(this);

        this.onUploadFile = this.onUploadFile.bind(this);

        this.onUseFile = this.onUseFile.bind(this);

        this.getFileDimensions = this.getFileDimensions.bind(this);

        this.crop = this.crop.bind(this);

        this.onCrop = this.onCrop.bind(this);

        this.uploadFile = this.uploadFile.bind(this);
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

    onUploadFile(file) {
        const fileDimensions = this.getFileDimensions(file);

        // This is done so the crop gets umnounteted (in cases where an image is loaded and then changed without cropping)
        this.setState({
            showCrop: false
        }, () => {
            this.setState({
                screenshot: file,
                uploadMethod: 'upload',
                mode: 'preview',
                fileDimensions,
                showCrop: true
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
                showCrop: true,
                screenshot
            });
        });
    }

    onUseFile() {
        const { screenshot, hasCropped } = this.state;

        // If the user has cropped, use the file, otherwise crop the visible area first and then use the file
        if (hasCropped) {
            this.uploadFile(screenshot);
        } else {
            this.crop();

            this.setState({
                shouldUse: true
            });
        }
    }

    getFileDimensions(file) {
        let fileDimensions = getFileDimensions(file);
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
        const { mode, uploadMethod, fileDimensions, showCrop } = this.state;
        const { scaleDimensions, additionalContent } = this.props;

        if (mode === 'initial') {
            return (
                <DocumentUploadMenu
                  className={styles.initialViewContainer}
                  onAddFile={this.onAddFile}
                  onFileLoaded={this.onUploadFile} />
            );
        }

        if (mode === 'takePhoto') {
            return (
                <Camera
                  ref='takePhoto'
                  width={fileDimensions.width}
                  height={fileDimensions.height} />
            );
        }

        if (mode === 'preview') {
            return (
                <FilePreview
                  ref='filePreview'
                  file={this.state.screenshot}
                  showCrop={showCrop}
                  onCrop={this.onCrop}
                  fileDimensions={fileDimensions}
                  scaleDimensions={scaleDimensions}
                  cropDimensions={this.cropDimensions}
                  uploadMethod={uploadMethod}
                  onFileLoaded={this.onUploadFile}
                  changeMode={this.changeMode}
                  additionalContent={additionalContent}
                  crop={this.crop} />
            );
        }
    }

    get actionButtons() {
        const { closePopup } = this.props;
        const { mode } = this.state;

        let actionButtons = [{
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
            let handler = this.props.isAdditionalContentValid ? this.onUseFile : this.props.additionalContentValidate;
            actionButtons.unshift({
                name: 'use',
                label: 'Use',
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

    uploadFile(file) {
        let { useFile } = this.props;
        var data = new window.FormData();
        var img = this.dataURItoBlob(file);
        data.append('file', img, 'photo.png');
        var request = new window.XMLHttpRequest();
        request.open('POST', '/file-upload', true);
        request.onload = (e) => {
            if (request.status >= 200 && request.status < 300 && request.responseText) {
                let reader = new window.FileReader();
                reader.onload = (data) => {
                    try {
                        let response = JSON.parse(request.responseText);
                        useFile({
                            filename: response.filename,
                            createdDate: new Date().toISOString(), // TODO: get this from the backend at some time
                            extension: 'png', // TODO: get this from the backend at some time
                            contentType: 'image/png' // TODO: get this from the backend at some time
                        });
                    } catch (e) {
                        // TODO: handle error response
                    }
                };
                reader.readAsDataURL(img);
            }
            // TODO: some error in else
        };
        request.send(data);
    }

    dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0) {
            byteString = window.atob(dataURI.split(',')[1]);
        } else {
            byteString = unescape(dataURI.split(',')[1]);
        }
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new window.Blob([ia], {type: mimeString});
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
              footer={{actionButtons: this.actionButtons}}
              closePopup={closePopup}>
                { this.details }
                { this.view }
            </Popup>
        );
    }
};

DocumentUpload.defaultProps = {
    useFile: () => ({}),
    additionalContent: '',
    additionalContentValidate: () => {},
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
    useFile: PropTypes.func,
    closePopup: PropTypes.func,
    additionalContent: PropTypes.any,
    additionalContentValidate: PropTypes.func,
    isAdditionalContentValid: PropTypes.bool
};
