import React, { PropTypes } from 'react';
import classnames from 'classnames';
import AddFileButton from './AddFileButton';
import PhotoPreview from './PhotoPreview';
import Tooltip from './Tooltip';
import { resizeImage } from '../../../../utils/image';
import styles from './styles.css';

const PhotoContainer = ({
    className,
    disabled,
    showDetails,
    label,
    file,
    onClick,
    onDeleteClick,
    onChangeClick,
    photo
}) => {
    const { title, subtitle, header, tooltip, documentType, scaleDimensions } = photo;
    const imageDimensions = resizeImage(file, scaleDimensions);

    return (
        <div className={classnames(styles.photoContainer)}>
            { title &&
                <div className={styles.photoHeader}>
                    {title}
                    {tooltip && <Tooltip tooltipText={tooltip} />}
                </div> }
            { showDetails ? <PhotoPreview
              className={className}
              type={documentType}
              dimensions={imageDimensions}
              source={file}
              header={header}
              onClick={onClick}
              onDeleteClick={onDeleteClick}
              onChangeClick={onChangeClick} /> : <AddFileButton
                className={className}
                label={label}
                disabled={disabled}
                onClick={onClick} /> }
            { subtitle && <div className={styles.photoFooter}>{ subtitle }</div> }
        </div>
    );
};

PhotoContainer.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    disabled: PropTypes.bool,
    file: PropTypes.string,
    photo: PropTypes.shape({
        title: PropTypes.string,
        subtitle: PropTypes.string,
        header: PropTypes.string,
        tooltip: PropTypes.string,
        documentType: PropTypes.string,
        scaleDimensions: PropTypes.shape({
            width: PropTypes.number,
            height: PropTypes.number
        })
    }),
    showDetails: PropTypes.bool,
    onClick: PropTypes.func,
    onDeleteClick: PropTypes.func,
    onChangeClick: PropTypes.func
};

export default PhotoContainer;
