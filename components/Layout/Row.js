import React, { PropTypes } from 'react';
import style from './style.css';
// import classnames from 'classnames';

const Row = (props) => {
    return (
        <div className={style.row}>{props.children}</div>
    );
};

Row.propTypes = {
    children: PropTypes.any
};

// Row.defaultProps = {
// };

export default Row;
