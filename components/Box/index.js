import React, { PropTypes } from 'react';
import Button from '../Button';
import Text from '../Text';
import Glyphicon from '../Glyphicon';
import style from './style.css';
import classnames from 'classnames';

const Box = ({ children, className, title, externalTitleClasses, externalBodyClasses, titleType, showClose, fullWidth, minHeight, transparent, marginBottom = true, onClose, showAccordeon = false, collapsed = false, onToggle, arrowDirection, ...props }) => {
    let titleTypeClass;
    switch (titleType) {
        case 'small':
            titleTypeClass = classnames('f15', 'f-semibold', 'f-upper', 'padding-top-30', 'padding-bottom-30', style.boxTitleSmall);
            break;
        default:
            titleTypeClass = classnames('f20', 'f-semibold', 'padding-all-20');
    }

    if (!arrowDirection) {
        arrowDirection = {
            collapsed: 'arrowDown',
            expanded: 'arrowUp'
        };
    }

    const accordeonDirection = collapsed ? arrowDirection.collapsed : arrowDirection.expanded;

    const accordeon = showAccordeon
        ? <Glyphicon glyphicon={accordeonDirection} style={{ color: '#B1B5B6' }} />
        : null;
    const fullWidthClass = fullWidth ? style.boxFull : style.boxInnerPadding;
    const transparentClass = transparent ? style.boxTransparent : null;
    const marginBottomClass = marginBottom ? null : style.boxMarginBottom;
    const classes = classnames(style.box, transparentClass, marginBottomClass, className);
    const closeSection = showClose ? <span className={classnames(style.boxTitleClose, 'pointer')} onClick={onClose}><Button button='close' style={{ float: 'left' }} /></span> : null;
    const ballancerClass = showClose ? style.ballancer : null;
    let titleSectionClasses = classnames('f-upper', style.boxTitle, titleTypeClass, ballancerClass, externalTitleClasses);
    titleSectionClasses = showAccordeon ? classnames(titleSectionClasses, 'pointer') : titleSectionClasses;
    const rightSection = showAccordeon ? accordeon : closeSection;
    const titleSection = title ? <div className={titleSectionClasses} onClick={onToggle}><Text>{title}</Text>{rightSection}</div> : null;
    const minHeightStyle = minHeight ? { minHeight: minHeight } : null;
    const body = !collapsed ? <div className={classnames(fullWidthClass, externalBodyClasses)} style={minHeightStyle}>{children}</div> : null;
    return (
        <div style={props.style} className={classes}>
            {titleSection}
            {body}
        </div>
    );
};

Box.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.node,
    titleType: PropTypes.oneOf(['small', 'big']),
    fullWidth: PropTypes.bool,
    minHeight: PropTypes.string,
    transparent: PropTypes.bool,
    marginBottom: PropTypes.bool,
    showClose: PropTypes.bool,
    onClose: PropTypes.func,
    showAccordeon: PropTypes.bool,
    collapsed: PropTypes.bool,
    onToggle: PropTypes.func,
    className: PropTypes.string,
    externalTitleClasses: PropTypes.string,
    externalBodyClasses: PropTypes.string,
    style: PropTypes.object,
    arrowDirection: PropTypes.object
};

export default Box;
