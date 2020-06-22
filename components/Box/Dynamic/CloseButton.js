import PropTypes from 'prop-types';
import React from 'react';
import Button from '../../Button';

const CloseButton = ({onClick, className}) => {
    return (
        <span className={className} onClick={onClick}>
            <Button button='close' style={{float: 'left'}} />
        </span>
    );
};

CloseButton.propTypes = {
    onClick: PropTypes.func,
    className: PropTypes.string
};

export default CloseButton;
