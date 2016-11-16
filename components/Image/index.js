import React, { PropTypes } from 'react';
import classNames from 'classnames';

const Image = ({className = '', ...props}) => {
    let classes = classNames('img-responsive', className);
    return (
      <img className={classes} {...props} />
    );
};

Image.propTypes = {
    src: PropTypes.string.isRequired,
    className: PropTypes.string
};

export default Image;
