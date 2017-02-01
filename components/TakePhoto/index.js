import React, { PropTypes } from 'react';
import classnames from 'classnames';
import PhotoPreview from '../PhotoPreview';
import Video from '../Video';

const TakePhoto = ({
    className,
    showPreview,
    renderInCanvas,
    photo
}) => (
    <div className={classnames(styles.takePhotoContainer, className)}>
        { showPreview ? <PhotoPreview photo={photo} renderInCanvas /> : <Video ref='video'/> }
    </div>
);

// TODO: check photo propType
TakePhoto.propTypes = {
    className: PropTypes.string,
    showPreview: PropTypes.bool,
    renderInCanvas: PropTypes.bool
}
