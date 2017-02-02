import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import FilePreview from './FilePreview';
import Video from '../Video';
import fileUploadStyles from './styles.css';

export default class FileUpload extends Component {
    render() {
        let { className, renderInCanvas, file } = this.props;

        return (
            <div className={classnames(fileUploadStyles.takePhotoContainer, className)}>
                { file ? <FilePreview file={file} renderInCanvas={renderInCanvas} /> : <Video ref='video' /> }
            </div>
        );
    }
}

FileUpload.propTypes = {
    file: PropTypes.string,
    className: PropTypes.string,
    showPreview: PropTypes.bool,
    renderInCanvas: PropTypes.bool
};
