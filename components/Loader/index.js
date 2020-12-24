import PropTypes from 'prop-types';
import React from 'react';
import Text from '../Text';
import classnames from 'classnames';
import styles from './styles.css';

const Loader = ({
    className,
    loaderClass,
    loadInfo
}) => {
    return (
        <div className={classnames(styles.loaderContainer, className)}>
            <div className={styles.overlay} />
            <div className={classnames(styles.loader, loaderClass)} />
            <div className={styles.message}><Text>{loadInfo.message}</Text></div>
        </div>
    );
};

Loader.propTypes = {
    className: PropTypes.string,
    loaderClass: PropTypes.string,
    loadInfo: PropTypes.object
};

Loader.defaultProps = {
    loadInfo: {
        message: 'Loading, please wait...'
    }
};

export default Loader;
