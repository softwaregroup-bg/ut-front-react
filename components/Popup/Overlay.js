import React, { PropTypes } from 'react';
import popupStyles from './styles.css';

const Overlay = ({
    className,
    onClick
}) => (
    <div className={popupStyles.defaultOverlay + ' ' + className} onClick={onClick} />
);

Overlay.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func
};

export default Overlay;
