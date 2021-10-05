import PropTypes from 'prop-types';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import defaultStyle from './style.css';
import Tab from './Tab';

export const Tabs = ({tabs, activeTab, onClick, cssStyle, classes}) => {
    const style = cssStyle || defaultStyle;
    return (
        <ul className={classnames(style.tabNavbar, classes.paper)}>
            {tabs.map((tab, i) => {
                const handleClick = () => onClick(tab);
                const isActive = tab.id === activeTab;
                return <Tab key={i} {...tab} onClick={handleClick} isActive={isActive} cssStyle={style} />;
            })}
        </ul>
    );
};

Tabs.propTypes = {
    classes: PropTypes.object,
    tabs: PropTypes.array.isRequired,
    activeTab: PropTypes.any,
    onClick: PropTypes.func,
    cssStyle: PropTypes.any
};

Tabs.defaultProps = {
    activeTab: '',
    cssStyle: false
};

export default withStyles(({palette}) => ({
    paper: {
        background: palette.background.paper
    }
}))(Tabs);
