import React from 'react';
import overlayStyles from './styles.css';

const Overlay = ({
    className,
    onClick
}) => (
    <div className={overlayStyles.defaultOverlay + ' ' + className} onClick={onClick} />
);

export default Overlay;
