import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Popup from '../Popup';
import DocumentUploadMenu from './DocumentUploadMenu';
import Camera from './Camera';
import FilePreview from './FilePreview';
import { POPUP_MIN_OFFSETS, POPUP_HEADER_HEIGHT, POPUP_FOOTER_HEIGHT, POPUP_PADDING } from '../Popup/config';
import { DEFAULT_ASPECT_RATIO } from './config';
import { getFileDimensions as getDimensions, getViewport } from '../../utils/image';
import styles from './styles.css';
import { getFileExtension, ERROR_STATUS_CODES } from './helpers';

const DocumentUpload = ({
    isOpen,
    header,
    closePopup,
    popupType,
    documentType,
    scaleDimensions,
    uploadDocument,
    useFile: loadFile,
    allowedFileTypes,
    maxFileSize,
    children,
    hideCrop,
    uploadType,
    additionalContentValidate,
    isAdditionalContentValid,
    uploadURL
}) => {
    const initialState = useMemo(() => ({
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
    }), []);

    const [state, setState] = useState(initialState);
    const filePreviewRef = useRef(null);
    const takePhotoRef = useRef(null);

    const resetState = useCallback(() => {
        setState(initialState);
    }, [initialState]);

    const setError = useCallback((errMsg) => {
        setState(prevState => ({ ...prevState, errorUpload: errMsg }));
    }, []);

    const dataURItoBlob = useCallback((dataURI) => {
        const byteString = dataURI.split(',')[0].indexOf('base64') >= 0
            ? atob(dataURI.split(',')[1])
            : decodeURIComponent(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ia = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], { type: mimeString });
    }, []);

    const uploadFile = useCallback(async(file, url = '/file-upload') => {
        const data = new FormData();
        const img = dataURItoBlob(file);
        const ext = state.fileExtension || 'unknown';
        data.append('file', img, `file.${ext}`);

        setState(prevState => ({ ...prevState, isUploading: true }));

        try {
            const attachmentResult = await uploadDocument({ formData: data });

            setState(prevState => ({ ...prevState, isUploading: false }));

            if (attachmentResult.error) {
                let errorMsg = attachmentResult.error.message || attachmentResult.error.statusText;
                if (attachmentResult.error.statusCode === ERROR_STATUS_CODES.request_entity_too_large) {
                    errorMsg = 'Document size is greater than maximum allowed.';
                }
                setError(errorMsg);
                return;
            }

            if (attachmentResult) {
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        loadFile({
                            filename: attachmentResult.result.filename,
                            createdDate: new Date().toISOString(),
                            extension: ext,
                            contentType: attachmentResult.result.headers['content-type']
                        });
                    } catch (e) {
                        setError(e.message);
                    }
                };
                reader.readAsDataURL(img);
            }
        } catch (error) {
            setError(error.message);
        }
    }, [state, uploadDocument, loadFile, dataURItoBlob, setError]);

    const changeMode = useCallback((mode) => {
        setState(prevState => ({ ...prevState, mode }));
    }, []);

    // const setUploadMethod = useCallback((uploadMethod) => {
    //     setState(prevState => ({ ...prevState, uploadMethod }));
    // }, []);

    const getFileDimensions = useCallback((file) => {
        const fileDimensions = getDimensions(file);
        const { aspectRatio } = fileDimensions;
        const scaleRatio = aspectRatio || DEFAULT_ASPECT_RATIO;
        const height = window.innerHeight - POPUP_MIN_OFFSETS - POPUP_HEADER_HEIGHT - POPUP_FOOTER_HEIGHT - 2 * POPUP_PADDING;

        return {
            width: height * scaleRatio >> 0,
            height: height >> 0
        };
    }, []);

    const onAddFile = useCallback(() => {
        const fileDimensions = getFileDimensions();
        setState(prevState => ({
            ...prevState,
            fileDimensions,
            uploadMethod: 'take',
            mode: 'takePhoto'
        }));
    }, [getFileDimensions]);

    const onUploadFile = useCallback((file, fileObj) => {
        const fileDimensions = getFileDimensions(file);
        const extension = getFileExtension(fileObj.name);

        setState(prevState => ({
            ...prevState,
            showCrop: false
        }));

        setTimeout(() => {
            setState(prevState => ({
                ...prevState,
                screenshot: file,
                fileExtension: extension,
                originalFilename: fileObj.name,
                fileSize: fileObj.size,
                uploadMethod: 'upload',
                mode: 'preview',
                fileDimensions,
                showCrop: !hideCrop
            }));
        }, 0);
    }, [getFileDimensions, hideCrop]);

    const takePhoto = useCallback(() => {
        const screenshot = takePhotoRef.current.getScreenshot();

        setState(prevState => ({
            ...prevState,
            showCrop: false
        }));

        setTimeout(() => {
            setState(prevState => ({
                ...prevState,
                uploadMethod: 'take',
                mode: 'preview',
                showCrop: !hideCrop,
                fileExtension: 'png',
                screenshot
            }));
        }, 0);
    }, [hideCrop]);

    const onUseFile = useCallback(() => {
        const { screenshot, hasCropped } = state;

        if (hideCrop || hasCropped) {
            uploadFile(screenshot, uploadURL);
        } else {
            filePreviewRef.current.editPhoto.cropImage();
            setState(prevState => ({ ...prevState, shouldUse: true }));
        }
    }, [state, hideCrop, uploadFile, uploadURL]);

    const onCrop = useCallback((screenshot) => {
        const { shouldUse } = state;

        if (shouldUse) {
            uploadFile(screenshot);
        } else {
            setState(prevState => ({
                ...prevState,
                screenshot,
                showCrop: false,
                hasCropped: true
            }));
        }
    }, [state, uploadFile]);

    const validate = useCallback(() => {
        const { fileExtension, fileSize } = state;
        if (
            !allowedFileTypes.map(tp => (tp.split('.').pop() || '').toLowerCase()).includes((fileExtension || '').toLowerCase()) ||
            fileSize > maxFileSize * 1024
        ) {
            return `Please use file types ${allowedFileTypes.join(', ')} and file size up to ${parseInt(maxFileSize / 1024)}MB per document`;
        }
        return null;
    }, [state, allowedFileTypes, maxFileSize]);

    const getCropDimensions = useCallback(() => {
        const { fileDimensions, uploadMethod } = state;
        if (documentType !== 'profilePhoto' && uploadMethod === 'take') {
            return fileDimensions;
        }
        return getViewport(fileDimensions, scaleDimensions);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state, documentType, scaleDimensions]);

    const renderView = useCallback(() => {
        const { mode, uploadMethod, fileDimensions } = state;

        if (mode === 'initial') {
            return (
                <DocumentUploadMenu
                    menuItems={['file', 'camera']}
                    className={styles.initialViewContainer}
                    onAddFile={onAddFile}
                    allowedFileTypes={allowedFileTypes}
                    onFileLoaded={onUploadFile}
                    uploadType={uploadType}
                />
            );
        }

        if (mode === 'takePhoto') {
            return (
                <Camera
                    ref={takePhotoRef}
                    width={fileDimensions.width}
                    height={fileDimensions.height}
                />
            );
        }

        if (mode === 'preview') {
            return (
                <div>
                    <div className={validate() && styles.hidden}>
                        <FilePreview
                            ref={filePreviewRef}
                            file={state.screenshot}
                            fileExtension={state.fileExtension}
                            originalFilename={state.originalFilename}
                            showCrop={!hideCrop || state.showCrop}
                            onCrop={onCrop}
                            fileDimensions={fileDimensions}
                            scaleDimensions={scaleDimensions}
                            cropDimensions={getCropDimensions()}
                            uploadMethod={uploadMethod}
                            uploadType={uploadType}
                            onFileLoaded={onUploadFile}
                            changeMode={changeMode}
                            allowedFileTypes={allowedFileTypes.join(',')}
                            crop={() => filePreviewRef.current.editPhoto.cropImage()}
                        />
                    </div>
                    {validate() && <div className={styles.errorMsg}>Error: {validate()}</div>}
                </div>
            );
        }
    }, [state, allowedFileTypes, hideCrop, onAddFile, onUploadFile, onCrop, changeMode, uploadType, scaleDimensions, validate, getCropDimensions]);

    const getActionButtons = useCallback(() => {
        const { mode } = state;
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
                onClick: takePhoto
            });
        }

        if (mode === 'preview') {
            const handler = isAdditionalContentValid ? onUseFile : additionalContentValidate;
            if (!validate()) {
                actionButtons.unshift({
                    name: 'use',
                    label: 'Use',
                    disabled: state.isUploading,
                    styleType: 'secondaryLight',
                    onClick: handler
                });
            }
        }

        return actionButtons;
    }, [state, closePopup, takePhoto, onUseFile, isAdditionalContentValid, additionalContentValidate, validate]);

    useEffect(() => {
        if (isOpen === false) {
            resetState();
        }
    }, [isOpen, resetState]);

    return (
        <Popup
            isOpen={isOpen}
            header={header}
            contentClassName={styles[state.mode + 'Container']}
            footer={{ actionButtons: getActionButtons() }}
            closePopup={closePopup}
        >
            <div>
                {state.errorUpload && <div className={styles.errorBox}>{state.errorUpload}</div>}
                {children}
                {popupType === 'detailed' && <div />}
                {renderView()}
            </div>
        </Popup>
    );
};

DocumentUpload.defaultProps = {
    uploadDocument: () => ({}),
    useFile: () => ({}),
    allowedFileTypes: ['.jpg', '.jpeg', '.png'],
    maxFileSize: 5 * 1024,
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
    useFile: PropTypes.func,
    closePopup: PropTypes.func,
    allowedFileTypes: PropTypes.array,
    maxFileSize: PropTypes.number,
    children: PropTypes.any,
    hideCrop: PropTypes.bool,
    uploadType: PropTypes.string,
    additionalContentValidate: PropTypes.func,
    isAdditionalContentValid: PropTypes.bool,
    uploadURL: PropTypes.string
};

export default DocumentUpload;
