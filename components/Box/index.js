import React, { PropTypes } from 'react';
import Button from '../Button';
import Glyphicon from '../Glyphicon';
import style from './style.css';
import classnames from 'classnames';

const Box = ({children, className, title, externalTitleClasses, externalBodyClasses, titleType, showClose, fullWidth, minHeight, transparent, marginBottom = true, onClose, showAccordeon = false, collapsed = false, onToggle, ...props}) => {
    let titleTypeClass;
    switch (titleType) {
        case 'small':
            titleTypeClass = classnames('f15', 'f-semibold', 'f-upper', 'padding-top-30', 'padding-bottom-30', style.boxTitleSmall);
            break;
        default:
            titleTypeClass = classnames('f20', 'f-semibold', 'padding-all-20');
    }
    let accordeonDirection = collapsed ? 'arrowDown' : 'arrowUp';
    let accordeon = showAccordeon ? <div className='pull-xs-right clearfix'><Glyphicon glyphicon={accordeonDirection} style={{color: '#B1B5B6'}} /></div> : null;
    let fullWidthClass = fullWidth ? style.boxFull : style.boxInnerPadding;
    let transparentClass = transparent ? style.boxTransparent : null;
    let marginBottomClass = marginBottom ? null : style.boxMarginBottom;
    let classes = classnames(style.box, transparentClass, marginBottomClass, className);
    let closeSection = showClose ? <span className={classnames(style.boxTitleClose, 'pointer')} onClick={onClose}><Button button='close' style={{float: 'left'}} /></span> : null;
    let ballancerClass = showClose ? style.ballancer : null;
    let titleSectionClasses = classnames('f-upper', style.boxTitle, titleTypeClass, ballancerClass, externalTitleClasses);
    titleSectionClasses = showAccordeon ? classnames(titleSectionClasses, 'pointer') : titleSectionClasses;
    let rightSection = showAccordeon ? accordeon : closeSection;
    let titleSection = title ? <div className={titleSectionClasses} onClick={onToggle}>{title}{rightSection}</div> : null;
    let minHeightStyle = minHeight ? {minHeight: minHeight} : null;
    let body = !collapsed ? <div className={classnames(fullWidthClass, externalBodyClasses)} style={minHeightStyle}>{children}</div> : null;
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
    style: PropTypes.object
};

export default Box;
