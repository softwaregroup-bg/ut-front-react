import React, { PropTypes } from 'react';
import classnames from 'classnames';
import style from './style.css';

const Container = (props) => {
    let classes = props.fluid ? style['container-fluid'] : style.container;
    classes = props.className ? classnames(classes, props.className) : classes;
    return (
        <div className={classes}>{props.children}</div>
    );
};

Container.propTypes = {
    children: PropTypes.any,
    fluid: PropTypes.bool,
    className: PropTypes.string
};

export default Container;
