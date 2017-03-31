import React, { Component, PropTypes } from 'react';
import Popup from 'ut-front-react/components/Popup';
import DocumentUploadMenu from './DocumentUploadMenu';
import Camera from './Camera';
import FilePreview from './FilePreview';
import styles from './styles.css';

export default class DocumentUpload extends Component {
    constructor() {
        super();

        this.initialState = {
            mode: 'initial',
            uploadMethod: '',
            screenshot: null
        };

        this.state = this.initialState;

        this.changeMode = this.changeMode.bind(this);

        this.setUploadMethod = this.setUploadMethod.bind(this);

        this.takePhoto = this.takePhoto.bind(this);

        this.onAddFile = this.onAddFile.bind(this);

        this.onUploadFile = this.onUploadFile.bind(this);

        this.onUseFile = this.onUseFile.bind(this);

        this.updateFile = this.updateFile.bind(this);
    }

    componentWillReceiveProps(nextProps) {
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
        this.changeMode('takePhoto');
        this.setUploadMethod('take');
    }

    onUploadFile(file, originalFile) {
        this.setState({
            screenshot: file,
            originalFile
        });

        this.setUploadMethod('upload');
        this.changeMode('preview');
    }

    takePhoto() {
        const screenshot = this.refs.takePhoto.getScreenshot();

        this.setState({
            screenshot
        });

        this.setUploadMethod('take');
        this.changeMode('preview');
    }

    onUseFile() {
        const { useFile } = this.props;

        useFile(this.state.screenshot);
    }

    updateFile(screenshot) {
        this.setState({
            screenshot
        });
    }

    get view() {
        const { mode, uploadMethod } = this.state;
        const { preview } = this.props;

        if (mode === 'initial') {
            return (
                <DocumentUploadMenu
                  className={styles.initialViewContainer}
                  onAddFile={this.onAddFile}
                  onFileLoaded={this.onUploadFile} />
            );
        }

        if (mode === 'takePhoto') {
            return <Camera ref='takePhoto' />;
        }

        if (mode === 'preview') {
            const { scaleDimensions, cropDimensions } = preview;

            return (
                <FilePreview
                  file={this.state.screenshot}
                  scaleDimensions={scaleDimensions}
                  cropDimensions={cropDimensions}
                  uploadMethod={uploadMethod}
                  onFileLoaded={this.onUploadFile}
                  changeMode={this.changeMode}
                  updateFile={this.updateFile} />
            );
        }
    }

    get actionButtons() {
        const { closePopup } = this.props;
        const { mode } = this.state;

        let actionButtons = [];

        if (mode === 'takePhoto') {
            actionButtons.push({
                name: 'take',
                label: 'Take',
                className: ['actionBtn', 'primary'],
                onClick: this.takePhoto
            });
        }

        if (mode === 'preview') {
            actionButtons.push({
                name: 'use',
                label: 'Use',
                className: ['actionBtn', 'primary'],
                onClick: this.onUseFile
            });
        }

        actionButtons.push({
            label: 'Cancel',
            className: 'actionBtn',
            onClick: closePopup
        });

        return actionButtons;
    }

    render() {
        const { isOpen, header, closePopup } = this.props;
        const { mode } = this.state;

        return (
            <Popup
              isOpen={isOpen}
              header={header}
              contentClassName={styles[mode + 'Container']}
              footer={{actionButtons: this.actionButtons}}
              closePopup={closePopup}>
                { this.view }
            </Popup>
        );
    }
};

DocumentUpload.propTypes = {
    isOpen: PropTypes.bool,
    header: PropTypes.object,
    popupType: PropTypes.string,
    preview: PropTypes.shape({
        scaleDimensions: PropTypes.shape({
            width: PropTypes.number,
            height: PropTypes.number
        }),
        cropDimensions: PropTypes.shape({
            width: PropTypes.number,
            height: PropTypes.number
        })
    }),
    useFile: PropTypes.func,
    closePopup: PropTypes.func
};
