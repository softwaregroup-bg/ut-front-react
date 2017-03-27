import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import UploadFileButton from './UploadFileButton';
import AddFileButton from './AddFileButton';
import Button from 'ut-front-react/components/StandardButton';
import Cropper from './Cropper';
import { calculateAspectRatio } from '../../../../utils/image';
import styles from './styles.css';

export default class FilePreview extends Component {
    constructor() {
        super();

        this.state = {
            showCrop: true,
            imageDimensions: {}
        };

        this.takePhoto = this.takePhoto.bind(this);

        this.showPreview = this.showPreview.bind(this);

        this.crop = this.crop.bind(this);

        this.changeFile = this.changeFile.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.file !== nextProps.file) {
            this.setState({
                showCrop: true
            });
        }
    }

    takePhoto() {
        const { changeMode } = this.props;

        changeMode('takePhoto');
    }

    showPreview(file) {
        const { updateFile, scaleDimensions } = this.props;
        const newDimensions = calculateAspectRatio(file, scaleDimensions);

        updateFile(file);

        this.setState({
            showCrop: false,
            imageDimensions: newDimensions
        });
    }

    crop() {
        this.refs.editPhoto.cropImage();
    }

    changeFile(file) {
        const { onFileLoaded } = this.props;

        // this is done so the cropper gets unmounted and reset
        this.setState({
            showCrop: false
        }, () => {
            onFileLoaded(file);
        });
    }

    get changeButton() {
        const { uploadMethod } = this.props;

        if (uploadMethod === 'upload') {
            return (
                <UploadFileButton
                  className={styles.changeFileBtn}
                  acceptType='image/*, application/pdf'
                  label='Change'
                  icon={styles.changeBtn}
                  onFileLoaded={this.changeFile} />
            );
        }

        if (uploadMethod === 'take') {
            return (
                <AddFileButton
                  className={styles.changeFileBtn}
                  label='Retake'
                  icon={styles.changeBtn}
                  onClick={this.takePhoto} />
            );
        }
    }

    render() {
        const { className, file, scaleDimensions, cropDimensions } = this.props;
        const { imageDimensions, showCrop } = this.state;

        return (
            <div className={classnames(styles.filePreviewContainer, className)}>
                { showCrop ? <Cropper
                  ref='editPhoto'
                  file={file}
                  scaleDimensions={scaleDimensions}
                  cropDimensions={cropDimensions}
                  onCrop={this.showPreview} /> : <div className={styles.preview}>
                    <img width={imageDimensions.width} height={imageDimensions.height} src={file} />
                </div>}
                <div className={classnames(styles.imageButtonsContainer)}>
                    { this.changeButton }
                    { showCrop && <Button
                      className={['actionBtn', 'primary']}
                      label='Crop'
                      onClick={this.crop} />}
                </div>
            </div>
        );
    }
};

FilePreview.propTypes = {
    className: PropTypes.string,
    file: PropTypes.string,
    scaleDimensions: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    cropDimensions: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    uploadMethod: PropTypes.string,
    updateFile: PropTypes.func,
    onFileLoaded: PropTypes.func,
    changeMode: PropTypes.func
};
