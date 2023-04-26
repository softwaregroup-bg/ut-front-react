import React, { PropTypes } from 'react';
import defaultStyle from './style.css';
import Tab from './Tab';

export const Tabs = ({tabs, activeTab, onClick, cssStyle}) => {
    const style = cssStyle || defaultStyle;
    return (
        <ul className={style.tabNavbar}>
            {tabs.map((tab, i) => {
                const handleClick = () => onClick(tab);
                const isActive = tab.id === activeTab;
                return <Tab key={i} {...tab} onClick={handleClick} isActive={isActive} cssStyle={style} />;
            })}
        </ul>
    );
};

Tabs.propTypes = {
    tabs: PropTypes.array.isRequired,
    activeTab: PropTypes.any,
    onClick: PropTypes.func,
    cssStyle: PropTypes.any
};

Tabs.defaultProps = {
    activeTab: '',
    cssStyle: false
};

export default Tabs;
