import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import FormInput from '../FormInput';
import AddFileButton from './AddFileButton';
import fileUploadStyles from './styles.css';

export default class UploadFileButton extends Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);

        this.onClick = this.onClick.bind(this);
    }

    onChange() {
        const { onFileLoaded, onFileError } = this.props;
        const file = this.refs.fileInput.refs.inputNode.files[0];

        if (file) {
            const fileReader = new window.FileReader();

            fileReader.addEventListener('load', e => {
                const result = typeof e.target.result === 'string' ? e.target.result : null;

                if (file) {
                    onFileLoaded(result, file);
                    fileReader.removeEventListener('load', this);
                }
            });

            fileReader.addEventListener('error', e => {
                onFileError(e);
                fileReader.removeEventListener('error', this);
            });

            fileReader.readAsDataURL(file);
        }
    }

    onClick() {
        this.refs.fileInput.refs.inputNode.click();
    }

    render() {
        const { className, label, icon, acceptType } = this.props;

        return (
            <div className={classnames(fileUploadStyles.uploadFileBtn, className)} onClick={this.onClick}>
                <AddFileButton icon={icon} label={label} />
                <FormInput ref='fileInput' type='file' hidden acceptType={acceptType} onChange={this.onChange} />
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
    onFileError: PropTypes.func
};

UploadFileButton.defaultProps = {
    onFileLoaded: () => {},
    onFileError: () => {}
};
