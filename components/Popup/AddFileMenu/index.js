import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import StandardButton from '../../StandardButton';
import FormInput from '../../FormInput';
import addFileStyles from './styles.css';

export default class AddFileMenu extends Component {
    constructor(props) {
        super(props);

        this.uploadFile = this.uploadFile.bind(this);

        this.capturePhoto = this.capturePhoto.bind(this);

        this.onFileSelect = this.onFileSelect.bind(this);
    }
    uploadFile() {
        this.refs.fileInput.refs.inputNode.click();
    }

    onFileSelect() {
        let { addFile } = this.props;
        let inputNode = this.refs.fileInput.refs.inputNode;

        let fileReader = new FileReader();

        if (inputNode.files[0]) {
            fileReader.addEventListener('loadend', (e) => {
                addFile('upload', e.target.result);
            });

            fileReader.readAsDataURL(inputNode.files[0]);
        }
    }
    capturePhoto() {
        let { addFile } = this.props;

        addFile('capture');
    }

    render() {
        let { className } = this.props;

        return (
            <div className={classnames(addFileStyles.addFileMenuCotainer, className)}>
                <FormInput
                  className='formInput'
                  ref='fileInput' hidden type='file'
                  onChange={this.onFileSelect} />

                  <StandardButton label='Upload photo' onClick={this.uploadFile} />
                  <StandardButton label='Take photo' onClick={this.capturePhoto} />
            </div>
        );
    }
};

AddFileMenu.propTypes = {
    className: PropTypes.string,
    addFile: PropTypes.func
};
