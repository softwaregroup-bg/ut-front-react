import React, { PropTypes } from 'react';
import classnames from 'classnames';
import styles from './styles.css';

const PhotoPreview = ({
    className,
    scaleDimensions,
    type,
    source,
    header,
    onClick,
    onDeleteClick,
    onChangeClick
}) => {
    return (
        <div className={classnames(styles.photoPreview, className)} onClick={onClick}>
            <img width={scaleDimensions.width} height={scaleDimensions.height} src={source} />
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
    scaleDimensions: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    onClick: PropTypes.func,
    onDeleteClick: PropTypes.func,
    onChangeClick: PropTypes.func
};

export default PhotoPreview;
