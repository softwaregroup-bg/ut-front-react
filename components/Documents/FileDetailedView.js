import React, { PropTypes, Component } from 'react';
import { calculateAspectRatio } from '../../helpers';
import { detailsMapping } from './config';
import FileView from './FileView';
import DateComponent from '../Date';
import styles from './style.css';

export default class FileDetailedView extends Component {
    get imageDimensions() {
        const { file, scaleDimensions } = this.props;

        return calculateAspectRatio(file.content, scaleDimensions);
    }

    get details() {
        const { file } = this.props;

        return Object.keys(file.details).map((key, index) => {
            if (key === 'width' || key === 'height' || key === 'type') {
                return;
            }

            let text = file.details[key] ? file.details[key] : 'None';
            let textStyle = file.details[key] ? '' : styles.fileDetailsNoText;

            if (key === 'dateUploaded') {
                text = <DateComponent>{text}</DateComponent>;
            }

            return (
                <div key={index} className={styles.detailsRow}>
                    <div className={styles.detailName}>{detailsMapping[key]}</div>
                    <div className={textStyle}>{text}</div>
                </div>
            );
        });
    }

    render() {
        const { file, scaleDimensions } = this.props;

        return (
            <div className={styles.fileDetailsContainer}>
                <div className={styles.filePreview}>
                    <FileView file={file} scaleDimensions={scaleDimensions} />
                </div>
                <div className={styles.fileDetails}>
                    {this.details}
                </div>
            </div>
        );
    }
}

FileDetailedView.propTypes = {
    file: PropTypes.shape({
        content: PropTypes.string.isRequired,
        details: PropTypes.shape({
            type: PropTypes.string.isRequired,
            size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            dateUploaded: PropTypes.string,
            description: PropTypes.string
        }).isRequired
    }),
    scaleDimensions: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    })
};

FileDetailedView.defaultProps = {
    scaleDimensions: {
        width: 230,
        height: 230
    }
};
