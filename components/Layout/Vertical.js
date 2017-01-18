import React, { PropTypes } from 'react';
import style from './style.css';

const Vertical = (props) => {
    let height = props.fixedComponentHeight + 'px';
    return (
        <div className={style.h100}>
            <div style={{height: height}}>{props.fixedComponent}</div>
            <div style={{height: 'calc(100% - ' + height + ')'}} className={style.vertical}>{props.children}</div>
        </div>
    );
};

Vertical.propTypes = {
    children: PropTypes.any,
    fixedComponent: PropTypes.any.isRequired,
    fixedComponentHeight: PropTypes.number.isRequired // pixels
};

export default Vertical;
