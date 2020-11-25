import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import FormInput from '../FormInput';
import AddFileButton from './AddFileButton';
import fileUploadStyles from './styles.css';

export default class UploadFileButton extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.handleClick = this.handleClick.bind(this);
    }

    handleChange() {
        const { onFileLoaded, onFileError, onFileSelected } = this.props;
        if (onFileSelected) onFileSelected(this.refs.fileInput.refs.inputNode.files);
        const file = this.refs.fileInput.refs.inputNode.files[0];

        if (file && onFileLoaded) {
            const fileReader = new window.FileReader();

            fileReader.addEventListener('load', e => {
                const result = typeof e.target.result === 'string' ? e.target.result : null;

                if (file) {
                    onFileLoaded(result, file);
                    fileReader.removeEventListener('load', this);
                }
            });

            onFileError && fileReader.addEventListener('error', e => {
                onFileError(e);
                fileReader.removeEventListener('error', this);
            });

            fileReader.readAsDataURL(file);
        }
    }

    handleClick() {
        this.refs.fileInput.refs.inputNode.click();
    }

    render() {
        const { className, label, icon, acceptType } = this.props;

        return (
            <div className={classnames(fileUploadStyles.uploadFileBtn, className)} onClick={this.handleClick}>
                <AddFileButton icon={icon} label={label} />
                <FormInput ref='fileInput' type='file' hidden acceptType={acceptType} onChange={this.handleChange} />
            </div>
        );
    }
}

UploadFileButton.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    icon: PropTypes.string,
    acceptType: PropTypes.string,
    onFileLoaded: PropTypes.func,
    onFileSelected: PropTypes.func,
    onFileError: PropTypes.func
};
