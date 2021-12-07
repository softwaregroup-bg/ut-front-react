import React, { PropTypes } from 'react';
import styles from './style.css';
import classnames from 'classnames';

const small = 16;
const normal = 24;
const large = 36;
const XXLarge = 72;
const XXXLarge = 80;

function getColor(color) {
    let finalColor = '';
    switch (color) {
        case 'white':
            finalColor = '#fff';
            break;
        case 'pink':
            finalColor = '#E3006B';
            break;
        case 'green':
            finalColor = '#7DC13E';
            break;
        case 'red':
            finalColor = '#E84949';
            break;
        case 'grey':
            finalColor = '#D2D5D6';
            break;
        default:
            break;
    }
    return finalColor;
}

function getClasses(glyphicon) {
    let typeClass;
    let defaultSize;
    switch (glyphicon) {
        case 'checkboxChecked':
            typeClass = styles.checkbox_checked;
            defaultSize = small;
            break;
        case 'checkboxEmpty':
            typeClass = styles.checkbox_empty;
            defaultSize = small;
            break;
        case 'close':
            typeClass = styles.close;
            defaultSize = small;
            break;
        case 'doneWithBackground':
            typeClass = styles.done_with_background;
            defaultSize = small;
            break;
        case 'error':
            typeClass = styles.error;
            defaultSize = small;
            break;
        case 'fail':
            typeClass = styles.fail;
            defaultSize = small;
            break;
        case 'fingerprint':
            typeClass = styles.fingerprint;
            defaultSize = small;
            break;
        case 'arrowDown':
            typeClass = styles.arrow_down;
            defaultSize = small;
            break;
        case 'arrowUp':
            typeClass = styles.arrow_up;
            defaultSize = small;
            break;
        case 'arrowLeft':
            typeClass = styles.arrow_left;
            defaultSize = small;
            break;
        case 'arrowRight':
            typeClass = styles.arrow_right;
            defaultSize = small;
            break;
        case 'importByFolder':
            typeClass = styles.import_by_folder;
            defaultSize = small;
            break;
        case 'scanobject':
            typeClass = styles.scanobject;
            defaultSize = small;
            break;
        case 'locked':
            typeClass = styles.locked;
            defaultSize = small;
            break;
        case 'notification':
            typeClass = styles.notification;
            defaultSize = small;
            break;
        case 'option':
            typeClass = styles.option;
            defaultSize = small;
            break;
        case 'paperClip':
            typeClass = styles.paper_clip;
            defaultSize = XXXLarge;
            break;
        case 'phone':
            typeClass = styles.phone;
            defaultSize = normal;
            break;
        case 'add':
            typeClass = styles.add;
            defaultSize = XXLarge;
            break;
        case 'radiobuttonChecked':
            typeClass = styles.radiobutton_checked;
            defaultSize = XXLarge;
            break;
        case 'radiobuttonEmpty':
            typeClass = styles.radiobutton_empty;
            defaultSize = XXLarge;
            break;
        case 'reject':
            typeClass = styles.reject;
            defaultSize = normal;
            break;
        case 'scanActivated':
            typeClass = styles.scan_activated;
            defaultSize = small;
            break;
        case 'search':
            typeClass = styles.search;
            defaultSize = small;
            break;
        case 'shutter':
            typeClass = styles.shutter;
            defaultSize = small;
            break;
        case 'sortDown':
            typeClass = styles.sort_down;
            defaultSize = normal;
            break;
        case 'sortUp':
            typeClass = styles.sort_up;
            defaultSize = small;
            break;
        case 'crop':
            typeClass = styles.crop;
            defaultSize = large;
            break;
        case 'fingerLeft':
            typeClass = styles.finger_left;
            defaultSize = large;
            break;
        case 'fingerRight':
            typeClass = styles.finger_right;
            defaultSize = large;
            break;
        case 'icnStepPhone':
            typeClass = styles.icn_step_phone;
            defaultSize = large;
            break;
        case 'message':
            typeClass = styles.message;
            defaultSize = large;
            break;
        case 'success':
            typeClass = styles.success_arrow;
            defaultSize = large;
            break;
        case 'validateArrow':
            typeClass = styles.validate_arrow;
            defaultSize = large;
            break;
        default:
            break;
    }
    return {
        typeClass,
        defaultSize
    };
}
const Glyphicon = ({ glyphicon, size, color, className, style, ...props }) => {
    const {typeClass, defaultSize} = getClasses(glyphicon);
    const glyphiconColor = getColor(color);
    const classes = classnames(styles.defaultRules, typeClass, className);
    const glyphiconSize = (size || defaultSize) + 'px';
    const inlineStyles = {fontSize: glyphiconSize, color: glyphiconColor, ...style};
    return (
        <span {...props} className={classes} style={inlineStyles} />
    );
};

export const iconNames = [
    'checkboxChecked',
    'checkboxEmpty',
    'close',
    'doneWithBackground',
    'error',
    'fail',
    'fingerprint',
    'arrowDown',
    'arrowUp',
    'arrowLeft',
    'arrowRight',
    'importByFolder',
    'scanobject',
    'locked',
    'notification',
    'option',
    'paperClip',
    'phone',
    'add',
    'radiobuttonChecked',
    'radiobuttonEmpty',
    'reject',
    'scanActivated',
    'search',
    'shutter',
    'sortDown',
    'sortUp',
    'crop',
    'fingerLeft',
    'fingerRight',
    'icnStepPhone',
    'message',
    'success',
    'validateArrow'
];

const colors = [
    'white',
    'pink',
    'green',
    'red',
    'gray'
];

Glyphicon.propTypes = {
    glyphicon: PropTypes.oneOf(iconNames),
    size: PropTypes.string,
    style: PropTypes.object,
    color: PropTypes.oneOf(colors),
    className: PropTypes.string
};

export default Glyphicon;
