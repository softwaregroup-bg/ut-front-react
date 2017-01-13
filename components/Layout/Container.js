import React, { PropTypes } from 'react';
import style from './style.css';
// import classnames from 'classnames';

const Container = (props) => {
    let classes = props.fluid ? style['container-fluid'] : style.container;
    let inlineStyle = {};
    inlineStyle.width = props.width ? props.width : null;
    inlineStyle.minWidth = props.minWidth ? props.minWidth : null;
    inlineStyle.maxWidth = props.maxWidth ? props.maxWidth : null;
    return (
        <div className={classes} style={inlineStyle}>{props.children}</div>
    );
};

Container.propTypes = {
    children: PropTypes.any,
    fluid: PropTypes.bool,
    width: PropTypes.string,
    minWidth: PropTypes.string,
    maxWidth: PropTypes.string
};

Container.defaultProps = {
    fluid: true
};

export default Container;
