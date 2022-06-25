import React, { PropTypes } from 'react';
import style from './style.css';
import classnames from 'classnames';
import Icon from '../Icon';

const FooterIcon = ({ icons = [], className, ...props }) => {
    const iconsLength = icons.length;
    switch (iconsLength) {
        case 0:
            return <span {...props} />;
        case 1:
            return <div className={classnames(style.singleIconMargin, className)} {...props}>
                <Icon icon={icons[0]} />
            </div>;
        case 2:
            return <div className={classnames(style.doubleIconMargin, className)} {...props}>
                <Icon icon={icons[0]} />
                <hr className={style.lineIcon} />
                <Icon icon={icons[1]} />
            </div>;
        default:
            return <div {...props}>
                <span />
            </div>;
    }
};

FooterIcon.propTypes = {
    icons: PropTypes.array,
    className: PropTypes.string
};

export default FooterIcon;
