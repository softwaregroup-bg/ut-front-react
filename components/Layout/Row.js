import React, { PropTypes } from 'react';
import style from './style.css';

const Row = (props) => {
    return (
        <div className={style.row}>{props.children}</div>
    );
};

Row.propTypes = {
    children: PropTypes.any
};

export default Row;
