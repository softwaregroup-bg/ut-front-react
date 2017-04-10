import React, { PropTypes, Component } from 'react';
import StandardButton from '../StandardButton';
import { defaultImageDimensions } from './config';
import { mapContentTypeToExtension } from './helpers';
import { calculateAspectRatio } from '../../helpers';
import styles from './style.css';


class FileView extends Component {
    render() {
        const { file, scaleDimensions, showOriginalFileButton, onFileClick } = this.props;

        let content;
        switch (file.details.type) {
            case 'image/png':
            case 'image/jpeg':
                let imageDimensions;
                if (scaleDimensions) {
                    imageDimensions = calculateAspectRatio(file.content, scaleDimensions);
                } else {
                    imageDimensions = calculateAspectRatio(file.content, {
                        width: file.details.width || defaultImageDimensions.width,
                        height: file.details.height || defaultImageDimensions.height
                    });
                }
                content = <img width={imageDimensions.width} height={imageDimensions.height} src={file.content} />;
                break;
            default:
                let extension = mapContentTypeToExtension(file.details.type);
                if (extension !== 'unkown') {
                    content = <div className={styles.noPictureDocument}>{mapContentTypeToExtension(file.details.type)}</div>;
                } else {
                    content = <div className={styles.noPictureDocumentInvalidType}>{extension}</div>;
                }
        }

        let clickOriginalButtonHandler = () => {
            let tempLink = document.createElement('a');
            tempLink.href = `${file.content}`;
            tempLink.setAttribute('target', '_blank');
            tempLink.click();
        };
        return (
            <div>
                <div onClick={onFileClick}>{content}</div>
                {showOriginalFileButton &&
                    <div className={styles.fileViewOriginalButtonWrap}>
                        <StandardButton label='View original' onClick={clickOriginalButtonHandler} styleType='secondaryLight' />
                    </div>
                }
            </div>
        );
    }
}

FileView.propTypes = {
    file: PropTypes.shape({
        content: PropTypes.string.isRequired,
        details: PropTypes.shape({
            type: PropTypes.string.isRequired,
            width: PropTypes.number,
            height: PropTypes.number
        }).isRequired
    }),
    scaleDimensions: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    showOriginalFileButton: PropTypes.bool,
    onFileClick: PropTypes.func
};

FileView.defaultProps = {
    showOriginalFileButton: true
};

export default FileView;
