import React, { PropTypes } from 'react';
import style from './verticalStyles.css';

const Vertical = (props) => {
    let height = props.fixedComponentHeight + 'px';
    return (
        <div className={style.verticalWrapper}>
            <div style={{height: height}}>{props.fixedComponent}</div>
            <div style={{height: 'calc(100% - ' + height + ')'}} className={style.vertical}>{props.children}</div>
        </div>
    );
};

Vertical.propTypes = {
    children: PropTypes.any,
    fixedComponent: PropTypes.any.isRequired,
    fixedComponentHeight: PropTypes.number // pixels
};

export default Vertical;
