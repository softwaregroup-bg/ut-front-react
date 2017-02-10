import React, { Component, PropTypes } from 'react';
import AddFileButton from './AddFileButton';
import FormInput from '../FormInput';
import FilePreview from './FilePreview';
import fileUploadStyles from './styles.css';

export default class FileUpload extends Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);

        this.onFileUploadClick = this.onFileUploadClick.bind(this);
    }

    onChange() {
        let { onFileLoaded, onFileError } = this.props;
        let inputNode = this.refs.fileInput.refs.inputNode;

        if (inputNode.files[0]) {
            var fileReader = new window.FileReader();

            fileReader.addEventListener('loadend', e => {
                let file = typeof e.target.result === 'string' ? e.target.result : null;

                onFileLoaded(file);
            });

            fileReader.addEventListener('error', e => {
                onFileError(e);
            });

            fileReader.readAsDataURL(inputNode.files[0]);
        }
    }

    onFileUploadClick() {
        this.refs.fileInput.refs.inputNode.click();
    }

    render() {
        let { showPreview, button, file } = this.props;

        return (
            <div>
                <FormInput ref='fileInput'
                  hidden
                  type='file'
                  onChange={this.onChange} />
                { showPreview ?
                    <FilePreview file={file} /> :
                    <AddFileButton
                      className={fileUploadStyles[button.className] || button.className}
                      label={button.label}
                      onClick={this.onFileUploadClick} /> }
            </div>
        );
    }
}

FileUpload.propTypes = {
    onFileLoaded: PropTypes.func,
    onFileError: PropTypes.func,
    showPreview: PropTypes.bool,
    button: PropTypes.object,
    file: PropTypes.string
};
