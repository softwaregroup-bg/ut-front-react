import React, { Component, PropTypes } from 'react';
import { calculateAspectRatio } from '../../../../utils/image';
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
            result: 'canvas',
            size: 'original'
        }).then((result) => {
            onCrop(result);
        });
    }

    init() {
        const { file, scaleDimensions, cropDimensions } = this.props;
        const newDimensions = calculateAspectRatio(file, scaleDimensions);

        this.cropper = new Croppie(this.refs.previewImage, {
            customClass: styles.imageCrop,
            viewport: {
                width: cropDimensions.width,
                height: cropDimensions.height,
                type: 'square'
            },
            boundary: {
                width: newDimensions.width,
                height: newDimensions.height
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
    scaleDimensions: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    cropDimensions: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    onCrop: PropTypes.func
};
