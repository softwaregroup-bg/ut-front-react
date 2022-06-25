import React, { PropTypes } from 'react';
import TitleSection from './TitleSection';
import CloseButton from './CloseButton';
import Icon from '../../Icon';
import style from '../style.css';
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

    const accordeonDirection = collapsed ? 'accountArrowDown' : 'accountArrowUp';

    const accordeon = showAccordeon && <Icon icon={accordeonDirection} />;
    const closeSection = showClose && <CloseButton className={classnames(style.boxTitleClose, 'pointer')} onClick={onClose} />;
    const rightSection = showAccordeon ? accordeon : closeSection;

    const fullWidthClass = fullWidth ? style.boxFull : style.boxInnerPadding;
    const transparentClass = transparent && style.boxTransparent;
    const marginBottomClass = marginBottom ? null : style.boxMarginBottom;
    const classes = classnames(style.box, transparentClass, marginBottomClass, className);
    const ballancerClass = showClose ? style.ballancer : null;
    let titleSectionClasses = classnames('f-upper', style.boxTitle, titleTypeClass, ballancerClass, externalTitleClasses);
    titleSectionClasses = showAccordeon ? classnames(titleSectionClasses, 'pointer') : titleSectionClasses;
    const minHeightStyle = minHeight && {minHeight};

    return (
        <div style={props.style} className={classes}>
            {title && <TitleSection title={title} className={titleSectionClasses} rightSection={rightSection} buttons={props.buttons} onClick={onToggle} />}
            {!collapsed &&
            <div className={classnames(fullWidthClass, externalBodyClasses)} style={minHeightStyle}>
                {children}
            </div>
            }
        </div>
    );
};

Box.propTypes = {
    children: PropTypes.node,
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
    buttons: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            isDisabled: PropTypes.bool,
            onClick: PropTypes.func,
            performTablValidation: PropTypes.bool,
            performFullValidation: PropTypes.bool
        })
    ),
    externalBodyClasses: PropTypes.string,
    style: PropTypes.object
};

export default Box;
