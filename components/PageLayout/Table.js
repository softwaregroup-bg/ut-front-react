import React from 'react';
import PropTypes from 'prop-types';
import style from './style.css';

const Table = ({children}) => (
    <div style={{padding: '0 20px 30px 20px', height: window.innerHeight - (59 + 55 + 76)}}>
        <div id={style.mainContentWrap}>
            <div className='table w100pr h100pr'>
                {children}
            </div>
        </div>
    </div>
);

Table.propTypes = {children: PropTypes.any};

export default Table;
