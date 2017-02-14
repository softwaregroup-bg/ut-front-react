import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import filePreviewStyles from './styles.css';

export default class FilePreview extends Component {
    render() {
        let { className, file, imageSource, showInCanvas } = this.props;

        return (
            <div className={classnames(filePreviewStyles.filePreviewContainer, className)}>
                { showInCanvas ? <canvas /> : <img src={imageSource || file} /> }
            </div>
        );
    }
};

FilePreview.propTypes = {
    className: PropTypes.string,
    file: PropTypes.string,
    imageSource: PropTypes.string,
    showInCanvas: PropTypes.bool
};
