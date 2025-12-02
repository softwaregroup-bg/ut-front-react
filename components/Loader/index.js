import PropTypes from 'prop-types';
import React from 'react';
import Text from '../Text';
import classnames from 'classnames';
import styles from './styles.css';

function getTranslatedValue(text) { // this loads before the data is loading.
    try {
        const data = localStorage.getItem('ut_app_translations');
        if (data) {
            const obj = JSON.parse(data);
            return obj[text] || obj[text.toLowerCase()];
        }
    } catch (err) {
        localStorage.removeItem('ut_app_translations');
    }
    return null;
}

const Loader = ({
    className,
    loaderClass,
    loadInfo
}, context) => {
    const message = (context?.translate?.(loadInfo.message) !== loadInfo.message) ? context?.translate?.(loadInfo.message) : (getTranslatedValue(loadInfo.message) || loadInfo.message);
    return (
        <div className={classnames(styles.loaderContainer, className)}>
            <div className={styles.overlay} />
            <div className={classnames(styles.loader, loaderClass)} />
            <div className={styles.message}><Text>{message}</Text></div>
        </div>
    );
};

Loader.propTypes = {
    className: PropTypes.string,
    loaderClass: PropTypes.string,
    loadInfo: PropTypes.object
};

Loader.contextTypes = {
    translate: PropTypes.func
};

Loader.defaultProps = {
    loadInfo: {
        message: 'Loading, please wait...'
    }
};

export default Loader;
