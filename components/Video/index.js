import React, { Component, PropTypes } from 'react';
import videoStyles from './styles.css';

export default class Video extends Component {
    componentDidMount() {
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
                this.refs.videoNode.src = window.URL.createObjectURL(stream);
                this.refs.videoNode.play();
            });
        }
    }

    render() {
        let { className, autoPlay } = this.props;

        return (
            <video ref='videoNode' className={videoStyles[className] || className} autoPlay />
        );
    }
}

Video.propTypes = {
    className: PropTypes.string,
    save: PropTypes.func
}
