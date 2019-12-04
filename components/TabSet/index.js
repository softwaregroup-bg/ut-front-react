import React, { PropTypes } from 'react';
import styles from './style.css';
import classNames from 'classnames';

TabSet.propTypes = {
    tabs: PropTypes.array,
    onTabChanged: PropTypes.func,
    activeTab: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

TabSet.defaultProps = {
    tabs: [],
    onTabChanged: function() { }
};

function getTabClass(isActive) {
    if (isActive) {
        return classNames('f-semibold', styles.active);
    } else {
        return 'f-semibold';
    }
}

export default function TabSet({ tabs, onTabChanged, activeTab }) {
    return (
        <div className={styles.tabSet}>
            {tabs.map((tab, i) => {
                let onClickF = function() { onTabChanged(tab); };
                return <div key={tab.key} className={getTabClass(activeTab === tab.key || activeTab === i)} onClick={onClickF}>
                    <span>{tab.text}</span>
                    <span className={styles.count}>{tab.count}</span>
                </div>;
            })}
        </div>
    );
}
