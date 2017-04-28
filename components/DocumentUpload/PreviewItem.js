import React, { PropTypes } from 'react';
import style from './styles.css';

const PreviewItem = ({
    file,
    fileExtension,
    previewBoxWidth,
    previewBoxHeight
}) => {
    switch (fileExtension) {
        case 'jpg':
        case 'jpeg':
        case 'png':
            return (
                <span>
                    <img width={previewBoxWidth} height={previewBoxHeight} src={file} />
                </span>
            );
        case 'doc':
        case 'docx':
        case 'pdf':
            return (
                <span className={style.PreviewItemThumbnail}>
                    {fileExtension}
                </span>
            );
        default:
            return (
                <span className={style.PreviewItemThumbnail}>
                    <span>Unknown file format</span>
                </span>
            );
    }
};

PreviewItem.propTypes = {
    file: PropTypes.string, // BASE64 representation of a file
    fileExtension: PropTypes.string,
    previewBoxWidth: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    previewBoxHeight: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])
};

export default PreviewItem;
