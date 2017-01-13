import React, { PropTypes } from 'react';

const Vertical = (props) => {
    let height = props.fixedComponentHeight + 'px';
    return (
        <div style={{height: '100%'}}>
            <div style={{height: height}}>{props.fixedComponent}</div>
            <div style={{height: 'calc(100% - ' + height + ')'}}>{props.children}</div>
        </div>
    );
};

Vertical.propTypes = {
    children: PropTypes.any,
    fixedComponent: PropTypes.any.isRequired,
    fixedComponentHeight: PropTypes.number.isRequired // pixels
};

export default Vertical;
