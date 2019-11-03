import React, { Component, PropTypes } from 'react';
import Croppie from 'croppie';
import styles from './styles.css';

export default class Cropper extends Component {
    constructor() {
        super();

        this.init = this.init.bind(this);

        this.cropImage = this.cropImage.bind(this);
    }

    componentDidMount() {
        this.init();
    }

    cropImage() {
        const { onCrop } = this.props;
        this.cropper.result({
                result: 'base64',
                size: 'viewport', 
                format: 'jpeg',
                quality: 0.99, 
        }).then(onCrop);
    }

    init() {
        const { file, fileDimensions, cropDimensions } = this.props;

        this.cropper = new Croppie(this.refs.previewImage, {
            customClass: styles.imageCrop,
            viewport: {
                width: cropDimensions.width,
                height: cropDimensions.height,
                type: 'square'
            },
            boundary: {
                width: fileDimensions.width,
                height: fileDimensions.height
            },
            result:{
                result: 'base64',
                size: 'viewport',
                format: 'jpeg',
                quality: 0.99,
            },
            showZoomer: true
        });

        this.cropper.bind({
            url: file
        });
    }

    render() {
        return (
            <div ref='previewImage' />
        );
    }
};

Cropper.propTypes = {
    file: PropTypes.string,
    fileDimensions: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    cropDimensions: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    onCrop: PropTypes.func
};
