import React, { Component, PropTypes } from 'react';
import style from '../style.css';

class Image extends Component {
    render() {
        let backgroundImageStyle = {};
        if (this.props.defaultSrc) {
            backgroundImageStyle.backgroundImage = `url(${this.props.defaultSrc}`;
        }

        if (this.props.src) {
            backgroundImageStyle.backgroundImage = `url(${this.props.src}`;
        }

        return (
            <div className={style.rowWrap}>
                <div className={style.imageWrap} style={backgroundImageStyle} />
            </div>
        );
    }
}

Image.propTypes = {
    src: PropTypes.string,
    defaultSrc: PropTypes.string
};

Image.defaultProps = {
    src: undefined,
    defaultSrc: undefined
};

export default Image;
