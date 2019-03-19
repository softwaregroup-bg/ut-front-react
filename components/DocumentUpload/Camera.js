import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import styles from './styles.css';

export default class Camera extends Component {
    static hasUserMedia() {
        return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
           navigator.mozGetUserMedia || navigator.msGetUserMedia);
    }

    constructor() {
        super();

        this.requestUserMedia = this.requestUserMedia.bind(this);

        this.onVideoSupported = this.onVideoSupported.bind(this);

        this.onVideoNotSupported = this.onVideoNotSupported.bind(this);

        this.getScreenshot = this.getScreenshot.bind(this);
    }

    componentDidMount() {
        if (Camera.hasUserMedia()) {
            this.requestUserMedia();
        }
    }

    componentWillUnmount() {
        if (this.stream) {
            this.stream.getTracks().forEach(stream => stream.stop());
        }
    }

    requestUserMedia() {
        navigator.getUserMedia = navigator.getUserMedia ||
                                       navigator.webkitGetUserMedia ||
                                       navigator.mozGetUserMedia ||
                                       navigator.msGetUserMedia;

        navigator.getUserMedia && navigator.getUserMedia({ video: true }, this.onVideoSupported, this.onVideoNotSupported);
    }

    onVideoSupported(stream) {
        this.stream = stream;
        try {
            this.refs.video.srcObject = stream;
        } catch (error) {
            this.refs.video.src = URL.createObjectURL(stream);
        }

    onVideoNotSupported(error) {
        // TODO
        return error;
    }

    getScreenshot() {
        if (Camera.hasUserMedia()) {
            const video = this.refs.video;
            const aspectRatio = video.videoWidth / video.videoHeight;
            let canvas = document.createElement('canvas');

            canvas.width = video.clientWidth;
            canvas.height = video.clientWidth / aspectRatio;

            const context = canvas.getContext('2d');

            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            return canvas.toDataURL();
        }

        return null;
    }

    render() {
        const { className, autoPlay, width, height } = this.props;

        return (
            <div style={{ height: height, width: width }} className={classnames(styles.cameraContainer, className)}>
                <video
                  ref='video'
                  className={styles.videoElement}
                  autoPlay={autoPlay} />
            </div>
        );
    }
}

Camera.propTypes = {
    className: PropTypes.string,
    autoPlay: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number
};

Camera.defaultProps = {
    autoPlay: true,
    width: '',
    height: ''
};
