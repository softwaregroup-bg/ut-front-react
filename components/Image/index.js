import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Image = ({className = '', ...props}) => {
    const classes = classNames('img-responsive', className);
    return (
        <img className={classes} {...props} />
    );
};

Image.propTypes = {
    src: PropTypes.string.isRequired,
    className: PropTypes.string
};

export default Image;
