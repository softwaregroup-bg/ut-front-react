import React, { Component } from 'react';
import classnames from 'classnames';
import filePreviewStyles from './styles.css';

export default class FilePreview extends Component {
    render() {
        let { className, file, imageSource, showInCanvas } = this.props;

        return (
            <div className={filePreviewStyles.filePreviewContainer}>
                { showInCanvas ? <canvas /> : <img src={imageSource || file}/> }
            </div>
        );
    }
}
