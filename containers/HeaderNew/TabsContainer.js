import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { Tab, MultiTab } from '../../components/Tab';
import { permissionPreCheck } from './helpers';
import { fromJS } from 'immutable';

import styles from './styles.css';

export default class TabsContainer extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = { visibleCount: Infinity };
        this.containerRef = React.createRef();
        this.tabRefs = [];
        this.tabWidths = []; // cached per-tab widths, populated on first full render
        this.recalculate = this.recalculate.bind(this);
    }

    componentDidMount() {
        this.resizeObserver = new ResizeObserver(this.recalculate);
        this.resizeObserver.observe(this.containerRef.current);
        this.recalculate();
    }

    componentWillUnmount() {
        this.resizeObserver && this.resizeObserver.disconnect();
    }

    recalculate() {
        const container = this.containerRef.current;
        if (!container) return;
        const available = container.offsetWidth;
        if (available === 0) return; // layout not ready yet

        // Update cached widths for currently rendered (visible) tabs
        this.tabRefs.forEach((el, i) => {
            if (el && el.offsetWidth > 0) {
                this.tabWidths[i] = el.offsetWidth;
            }
        });

        if (!this.tabWidths.length) return;

        const MORE_BUTTON_WIDTH = 70;
        let used = 0;
        let count = 0;
        for (let i = 0; i < this.tabWidths.length; i++) {
            const w = this.tabWidths[i] || 0;
            if (!w) break; // width unknown for this tab — stop here
            const isLast = i === this.tabWidths.length - 1;
            const wouldOverflow = isLast
                ? used + w > available
                : available - used - w < MORE_BUTTON_WIDTH;
            if (wouldOverflow) break;
            used += w;
            count++;
        }
        if (count !== this.state.visibleCount) {
            this.setState({ visibleCount: count });
        }
    }

    hasPermission(permissions) {
        return permissions.every((permission) => {
            return permission.indexOf('!') === 0
                ? !this.context.checkPermission(permission.substr(1))
                : this.context.checkPermission(permission);
        });
    }

    render() {
        const { tabset, className } = this.props;
        const { visibleCount } = this.state;
        const tabs = permissionPreCheck(fromJS(tabset)).toJS();

        const visibleTabs = tabs.slice(0, visibleCount);
        const overflowTabs = tabs.slice(visibleCount);
        const moreTab = { title: <span style={{fontSize: '24px'}}>...</span>, multi: overflowTabs };

        this.tabRefs = [];

        return (
            <span className={className} ref={this.containerRef}>
                {visibleTabs.map((tab, i) => (
                    <div
                        key={i}
                        className={styles.tabContainer}
                        ref={el => { this.tabRefs[i] = el; }}
                    >
                        {tab.multi ? <MultiTab tab={tab} /> : <Tab tab={tab} />}
                    </div>
                ))}
                {overflowTabs.length > 0 && (
                    <div className={classNames(styles.tabContainer, styles.moreTab)}>
                        <MultiTab tab={moreTab} />
                    </div>
                )}
            </span>
        );
    }
}

TabsContainer.propTypes = {
    tabset: PropTypes.array,
    className: PropTypes.string
};

TabsContainer.contextTypes = {
    checkPermission: PropTypes.func
};
