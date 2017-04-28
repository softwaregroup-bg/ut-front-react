import React, { PropTypes } from 'react';

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
        default:
            return (
                <span>
                    <div>Unknown file format</div>
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
