import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import style from './style.css';

const Page = ({children, className}) => (
    <div className={classnames(style.h100pr, className)}>
        {children}
    </div>
);

Page.propTypes = {
    children: PropTypes.any,
    className: PropTypes.string
};

export default Page;
