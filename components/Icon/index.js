import React, { PropTypes } from 'react';
import style from './style.css';
import classnames from 'classnames';

const Icon = ({ icon, iconURL, hover = false, className, ...props }) => {
    let sizeClass;
    let typeClass;
    switch (icon) {
        case 'phone':
            typeClass = style.iconPhone;
            sizeClass = style.iconSmall;
            break;
        case 'phonePink':
            typeClass = style.iconPhonePink;
            sizeClass = style.iconSmall;
            break;
        case 'accountArrowDown':
            typeClass = style.iconAccountArrowDown;
            sizeClass = style.iconSmall;
            break;
        case 'accountArrowUp':
            typeClass = style.iconAccountArrowUp;
            sizeClass = style.iconSmall;
            break;
        case 'add':
            typeClass = style.iconAdd;
            sizeClass = style.iconSmall;
            break;
        case 'addActive':
            typeClass = style.iconAddHover;
            sizeClass = style.iconSmall;
            break;
        case 'arrowDown':
            typeClass = style.iconArrowDown;
            sizeClass = style.iconSmall;
            break;
        case 'arrowLeft':
            typeClass = style.iconArrowLeft;
            sizeClass = style.iconSmall;
            break;
        case 'arrowUp':
            typeClass = style.iconArrowUp;
            sizeClass = style.iconSmall;
            break;
        case 'arrowTableTree':
            typeClass = style.arrowTableTree;
            sizeClass = style.iconSmall;
            break;
        case 'arrowUpPink':
            typeClass = style.iconArrowUpPink;
            sizeClass = style.iconSmall;
            break;
        case 'arrowRightPink':
            typeClass = style.iconArrowRightPink;
            sizeClass = style.iconSmall;
            break;
        case 'arrowDownPink':
            typeClass = style.iconArrowDownPink;
            sizeClass = style.iconSmall;
            break;
        case 'arrowLeftPink':
            typeClass = style.iconArrowLeftPink;
            sizeClass = style.iconSmall;
            break;
        case 'close':
            typeClass = style.iconClose;
            sizeClass = style.iconSmall;
            break;
        case 'closeToolTip':
            typeClass = style.iconCloseToolTip;
            sizeClass = style.iconSmall;
            break;
        case 'edit':
            typeClass = style.iconEdit;
            sizeClass = style.iconSmall;
            break;
        case 'error':
            typeClass = style.iconAccessFailure;
            sizeClass = style.iconXXXLarge;
            break;
        case 'done':
            typeClass = style.iconDone;
            sizeClass = style.iconNormal;
            break;
        case 'importCamera':
            typeClass = style.iconImportCamera;
            sizeClass = style.iconXXLarge;
            break;
        case 'importFolder':
            typeClass = style.iconImportFolder;
            sizeClass = style.iconXXLarge;
            break;
        case 'importScanner':
            typeClass = style.iconImportScanner;
            sizeClass = style.iconXXLarge;
            break;
        case 'infoToolTip':
            typeClass = style.iconInfoToolTip;
            sizeClass = style.iconNormal;
            break;
        case 'lock':
            typeClass = style.iconLock;
            sizeClass = style.iconSmall;
            break;
        case 'logout':
            typeClass = style.iconLogout;
            sizeClass = style.iconSmall;
            break;
        case 'padlock':
            typeClass = style.iconPadlock;
            sizeClass = style.iconSmall;
            break;
        case 'status':
            typeClass = style.iconClientFileStatus;
            sizeClass = style.iconNormal;
            break;
        case 'reject':
            typeClass = style.iconReject;
            sizeClass = style.iconSmall;
            break;
        case 'stepCropOff':
            typeClass = style.iconStepCropOff;
            sizeClass = style.iconLarge;
            break;
        case 'settingsTable':
            typeClass = style.iconSettingsTable;
            sizeClass = style.iconNormal;
            break;
        case 'stepCropOn':
            typeClass = style.iconStepCropOn;
            sizeClass = style.iconLarge;
            break;
        case 'stepCropDone':
            typeClass = style.iconStepCropDone;
            sizeClass = style.iconLarge;
            break;
        case 'stepFingerLeftOff':
            typeClass = style.iconStepFingerLeftOff;
            sizeClass = style.iconLarge;
            break;
        case 'stepFingerLeftOn':
            typeClass = style.iconStepFingerLeftOn;
            sizeClass = style.iconLarge;
            break;
        case 'stepFingerLeftDone':
            typeClass = style.iconStepFingerLeftDone;
            sizeClass = style.iconLarge;
            break;
        case 'stepFingerRightOff':
            typeClass = style.iconStepFingerRightOff;
            sizeClass = style.iconLarge;
            break;
        case 'stepFingerRightOn':
            typeClass = style.iconStepFingerRightOn;
            sizeClass = style.iconLarge;
            break;
        case 'stepFingerRightDone':
            typeClass = style.iconStepFingerRightDone;
            sizeClass = style.iconLarge;
            break;
        case 'stepImportOff':
            typeClass = style.iconStepImportOff;
            sizeClass = style.iconLarge;
            break;
        case 'stepImportOn':
            typeClass = style.iconStepImportOn;
            sizeClass = style.iconLarge;
            break;
        case 'stepImportDone':
            typeClass = style.iconStepImportDone;
            sizeClass = style.iconLarge;
            break;
        case 'stepPhoneOff':
            typeClass = style.iconStepPhoneOff;
            sizeClass = style.iconLarge;
            break;
        case 'stepPhoneOn':
            typeClass = style.iconStepPhoneOn;
            sizeClass = style.iconLarge;
            break;
        case 'stepPhoneDone':
            typeClass = style.iconStepPhoneDone;
            sizeClass = style.iconLarge;
            break;
        case 'stepScan':
            typeClass = style.iconStepScanDefault;
            sizeClass = style.iconXLarge;
            break;
        case 'stepShutter':
            typeClass = style.iconStepShutterDefault;
            sizeClass = style.iconXLarge;
            break;
        case 'stepSmsOff':
            typeClass = style.iconStepSmsOff;
            sizeClass = style.iconLarge;
            break;
        case 'stepSmsOn':
            typeClass = style.iconStepSmsOn;
            sizeClass = style.iconLarge;
            break;
        case 'stepSmsDone':
            typeClass = style.iconStepSmsDone;
            sizeClass = style.iconLarge;
            break;
        case 'success':
            typeClass = style.iconAccessConfirmed;
            sizeClass = style.iconXXXLarge;
            break;
        case 'validate':
            typeClass = style.iconValidate;
            sizeClass = style.iconNormal;
            break;
        case 'custom':
            // don't add class for this type
            break;
        default:
            break;
    }
    let hoverClass = hover ? style.hover : null;
    let classes = classnames(style.icon, typeClass, sizeClass, hoverClass, className);
    return (
      <span className={classes} {...props} />
    );
};

const iconNames = [
    'accountArrowDown',
    'accountArrowUp',
    'arrowTableTree',
    'add',
    'addActive',
    'arrowDown',
    'arrowLeft',
    'arrowUp',
    'arrowUpPink',
    'arrowRightPink',
    'arrowDownPink',
    'arrowLeftPink',
    'close',
    'closeToolTip',
    'edit',
    'success',
    'error',
    'done',
    'importCamera',
    'importFolder',
    'importScanner',
    'infoToolTip',
    'lock',
    'logout',
    'padlock',
    'phonePink',
    'phone',
    'reject',
    'settingsTable',
    'status',
    'stepCropOff',
    'stepCropOn',
    'stepCropDone',
    'stepFingerLeftOff',
    'stepFingerLeftOn',
    'stepFingerLeftDone',
    'stepFingerRightOff',
    'stepFingerRightOn',
    'stepFingerRightDone',
    'stepImportOff',
    'stepImportOn',
    'stepImportDone',
    'stepPhoneOff',
    'stepPhoneOn',
    'stepPhoneDone',
    'stepScan',
    'stepShutter',
    'stepSmsOff',
    'stepSmsOn',
    'stepSmsDone',
    'validate',
    'custom'
];

Icon.propTypes = {
    icon: PropTypes.oneOf(iconNames),
    iconURL: PropTypes.string,
    hover: PropTypes.bool,
    className: PropTypes.string
};

export default Icon;
