import React, { PropTypes } from 'react';
import style from './style.css';

const Table = ({children}) => (
    <table className={style.dataGridTable}>
        {children}
    </table>
);

Table.propTypes = {children: PropTypes.any};

export default Table;
