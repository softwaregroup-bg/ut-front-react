import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import StandardButton from '../StandardButton';
import FormInput from '../FormInput';
import addPhotoStyles from './styles.css';

export default class AddPhoto extends Component {
    constructor(props) {
        super(props);

        this.uploadPhoto = this.uploadPhoto.bind(this);
    }
    uploadPhoto() {
        let { onUploadPhotoClick } = this.props;

        this.refs.fileInput.refs.inputNode.click();

        // onUploadPhotoClick();
    }
    render() {
        let { onTakePhotoClick } = this.props;

        return (
            <div className={classnames(addPhotoStyles.addPhotoContainer)}>
                <FormInput className='formInput' ref='fileInput' hidden type='file' />
                <StandardButton label='Upload photo' onClick={this.uploadPhoto} />
                <StandardButton label='Take photo' onClick={onTakePhotoClick} />
            </div>
        );
    }
};
