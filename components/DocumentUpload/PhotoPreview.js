import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles.css';

const PhotoPreview = ({
    className,
    dimensions,
    type,
    source,
    header,
    onClick,
    onDeleteClick,
    onChangeClick
}) => {
    const { width, height } = dimensions;

    return (
        <div className={classnames(styles.photoPreview, className)} onClick={onClick}>
            <img width={width} height={height} src={source} />
            <div className={styles.photoPreviewActionBtns}>
                <span className={styles.btnsHeader}>{header}</span>
                <div className={styles.btnsContainer}>
                    <span className={classnames(styles.photoBtn, styles.deleteBtn)} data-type={type} onClick={onDeleteClick} />
                    <span className={classnames(styles.photoBtn, styles.changeBtn)} data-type={type} onClick={onChangeClick} />
                </div>
            </div>
        </div>
    );
};

PhotoPreview.propTypes = {
    className: PropTypes.string,
    type: PropTypes.string,
    source: PropTypes.string,
    header: PropTypes.string,
    dimensions: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    onClick: PropTypes.func,
    onDeleteClick: PropTypes.func,
    onChangeClick: PropTypes.func
};

export default PhotoPreview;
