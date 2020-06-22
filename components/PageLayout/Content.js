import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import styles from './style.css';

const Content = ({children, style}) => (
    <div className={classnames(styles.h100pr, styles.w100pr)} style={style}>
        {children}
    </div>
);

Content.propTypes = {
    children: PropTypes.any,
    style: PropTypes.object
};

export default Content;
