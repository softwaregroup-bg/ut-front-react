import PropTypes from 'prop-types';
import React from 'react';
import style from '../style.css';
const renderButtons = (buttons) => {
    return buttons && buttons.map((button, index) => (<span className={style.activeLinkButton} key={index} onClick={button.onClick}>{button.label}</span>));
};

const TitleSection = ({title, className, rightSection, onClick, buttons}) => {
    return (
        <div className={className} onClick={onClick}>
            {title}
            <div className='pull-xs-right clearfix'>
                <div className={style.buttonWrapper}>
                    {renderButtons(buttons)}
                </div>
                <div className={style.arrowBox}>
                    {rightSection}
                </div>
            </div>
        </div>
    );
};

TitleSection.propTypes = {

    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    className: PropTypes.string,
    rightSection: PropTypes.node,
    onClick: PropTypes.func,

    buttons: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            isDisabled: PropTypes.bool,
            onClick: PropTypes.func,
            performTablValidation: PropTypes.bool,
            performFullValidation: PropTypes.bool
        })
    )
};

export default TitleSection;
