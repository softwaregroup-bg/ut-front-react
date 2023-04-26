import React from 'react';
import PropTypes from 'prop-types';
import style from './style.css';
import classnames from 'classnames';

const Button = React.createClass({
    propTypes: {
        children: PropTypes.node,
        button: PropTypes.oneOf([
            'add',
            'back',
            'cancel',
            'close',
            'close-page',
            'connection',
            'end',
            'import',
            'next',
            // 'reject',
            'reject-file',
            'reset',
            'retake',
            'save',
            'send',
            'validate',
            'validate-file',
            'custom' // value for custom buttons, example: image as a button
        ]),
        sizeType: PropTypes.oneOf(['small', 'big']),
        fullWidth: PropTypes.bool
    },
    contextTypes: {
        implementationStyle: PropTypes.object
    },
    getStyle(name) {
        return (this.context.implementationStyle && this.context.implementationStyle[name]) || style[name];
    },
    render() {
        const {children, button, sizeType, fullWidth = false, ...props} = this.props;
        let sizeTypeClass;

        switch (sizeType) {
            case 'small':
                sizeTypeClass = this.getStyle('btnSmall');
                break;
            default:
                sizeTypeClass = this.getStyle('btnNormal');
        }
        const fullWidthClass = fullWidth ? this.getStyle('btnFullWidth') : null;
        let typeClass;
        switch (button) {
            case 'add':
            case 'import':
            case 'save':
            case 'send':
            case 'validate':
                typeClass = this.getStyle('btnGreen');
                break;
            case 'back':
            case 'cancel':
            case 'reset':
            case 'retake':
                typeClass = this.getStyle('btnGrey');
                break;
            case 'connection':
            case 'next':
                typeClass = this.getStyle('btnPink');
                break;
            case 'end':
                typeClass = this.getStyle('btnGreyDark');
                break;
            case 'validate-file':
                typeClass = this.getStyle('btnValidateFile');
                break;
            case 'reject-file':
                typeClass = this.getStyle('btnRejectFile');
                break;
            case 'close':
                typeClass = this.getStyle('btnClose');
                break;
            case 'close-page':
                typeClass = this.getStyle('btnClosePage');
                break;
            case 'custom':
                typeClass = this.getStyle('btnCustom');
                break;
            default:
                typeClass = this.getStyle('btnGreen');
        }
        let classes = classnames(this.getStyle('btn'), sizeTypeClass, typeClass, fullWidthClass);
        if (button === 'custom') {
            classes = typeClass;
        }
        return (
            <button type='button' className={classes} tabIndex='0' {...props}>{children}</button>
        );
    }
});

export default Button;
