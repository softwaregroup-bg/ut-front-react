import React, { PropTypes } from 'react';
import classnames from 'classnames';
import styles from './style.css';

const Content = ({children, style}) => (
    <div className={classnames('tableCell', 'vaTop', 'h100pr', 'w100pr', styles.zIndex)} style={style}>
        {children}
    </div>
);

Content.propTypes = {
    children: PropTypes.any,
    style: PropTypes.object
};

export default Content;
