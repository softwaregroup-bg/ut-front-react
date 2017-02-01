import React, { PropTypes } from 'react';
import overlayStyles from './styles.css';

const Overlay = ({
    className,
    onClick
}) => (
    <div className={overlayStyles.defaultOverlay + ' ' + className} onClick={onClick} />
);

Overlay.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func
};

export default Overlay;
