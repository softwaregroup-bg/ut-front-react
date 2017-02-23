import React, { PropTypes } from 'react';
import styles from './styles.css';

const Loader = ({
    loadInfo
}) => {
    return (
        <div className={styles.loaderContainer}>
                <div className={styles.overlay}></div>
                <div className={styles.loader}></div>
                <div className={styles.message}>{loadInfo.message}</div>
            </div>
    );
}

Loader.defaultProps = {
    loadInfo: {
        message: 'Loading, please wait...'
    }
}

export default Loader;
