import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import style from './style.css';

const propTypes = {
    label: PropTypes.string,
    loaded: PropTypes.string,
    progressClassName: PropTypes.string,
    wrapperClassName: PropTypes.string
};
const defaultProps = {
    label: '',
    loaded: '',
    progressClassName: '',
    wrapperClassName: ''
};
/**
 * By default the Progress component takes
 * gradient variable from the default-config.css file
 * you can overide those by providing progressClassName
 *  */
const Progress = (props) => {
    const {
        loaded,
        wrapperClassName,
        progressClassName,
        label
    } = props;

    return (
        <div className={wrapperClassName}>
            {label && <div className={style.label}>{label}</div>}
            <div className={classnames(style.legend)}>
                <div className={style.background} />
                <div className={style.loadingBarWrapper}>
                    <div className={classnames(style.loadingBar, progressClassName)} style={{width: loaded}} />
                </div>
            </div>
        </div>
    );
};

Progress.propTypes = propTypes;
Progress.defaultProps = defaultProps;

export default Progress;
