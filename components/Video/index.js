import React, { Component, PropTypes } from 'react';
import StandardButton from '../StandardButton';
import videoStyles from './styles.css';

export default class Video extends Component {
    constructor(props) {
        super(props);

        this.save = this.save.bind(this);
    }

    componentDidMount() {
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
                this.refs.videoNode.src = window.URL.createObjectURL(stream);
                this.refs.videoNode.play();
            });
        }
    }

    save() {
        let { save } = this.props;

        save(this.refs.vdieoNode);
    }

    render() {
        let { className, save } = this.props;

        return (
            <div className={videoStyles.videoContainer}>
                <video ref='videoNode' className={videoStyles[className] || className} autoPlay />
                <button onClick={this.save} />
            </div>
        );
    }
}

Video.propTypes = {
    className: PropTypes.string,
    save: PropTypes.func
}
