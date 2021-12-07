import React, { PropTypes } from 'react';
import classnames from 'classnames';
import style from './style.css';

const Row = (props) => {
    const classes = props.className ? classnames(style.row, props.className) : style.row;
    return (
        <div className={classes}>{props.children}</div>
    );
};

Row.propTypes = {
    children: PropTypes.any,
    className: PropTypes.string
};

export default Row;
