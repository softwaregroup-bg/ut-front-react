import React, { PropTypes } from 'react';
import { shrinkFilename } from './helpers';
import style from './styles.css';

const PreviewItem = ({
    file,
    fileExtension,
    originalFilename,
    previewBoxWidth,
    previewBoxHeight
}) => {
    let ext = fileExtension && fileExtension.toLowerCase();
    switch (ext) {
        case 'jpg':
        case 'jpeg':
        case 'png':
            return (
                <span>
                    <img width={previewBoxWidth} height={previewBoxHeight} src={file} />
                </span>
            );
        case 'xls':
        case 'xlsx':
        case 'doc':
        case 'docx':
        case 'pdf':
            return (
                <span className={style.PreviewItemThumbnail} title={originalFilename}>
                    <div className={style.fileIcon} />
                    <div className={style.fileLabel}>{shrinkFilename(originalFilename)}</div>
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
    originalFilename: PropTypes.string,
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
