import PropTypes from 'prop-types';
import React, { Component } from 'react';
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
            result: 'canvas',
            size: 'original'
        }).then(onCrop);
    }

    init() {
        const { file, fileDimensions, cropDimensions } = this.props;

        if (typeof window !== 'undefined') {
            let Croppie = require('croppie');
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
                showZoomer: true
            });

            this.cropper.bind({
                url: file
            });
        }
    }

    render() {
        return (
            <div ref='previewImage' />
        );
    }
}

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
