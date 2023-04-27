/* eslint-disable react/no-find-dom-node */
import React from 'react';
import PropTypes from 'prop-types';
import ReactDom from 'react-dom';
import classnames from 'classnames';
import style from './style.css';
import TabLink from './TabLink';
import TabDropdown from './TabDropdown';
import { matchPath } from 'react-router';

class TabMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDropdown: false,
            offset: 0
        };
        this.displayBtn = this.displayBtn.bind(this);
        this.setOffset = this.setOffset.bind(this);
        this.calculateLeftCoordinate = this.calculateLeftCoordinate.bind(this);
        this.calculateRightCoordinate = this.calculateRightCoordinate.bind(this);
    }

    getStyle(name) {
        return (this.context.implementationStyle && this.context.implementationStyle[name]) || style[name];
    }

    componentDidUpdate() {
        const node = ReactDom.findDOMNode(this.refs.tabset);
        const rowNodeRect = node.getElementsByTagName('tr')[0].getBoundingClientRect();
        const buttonWidth = 32; // the width of the dropdown button // TODO: consider taking this value dynamically
        const windowWidth = window.innerWidth; // TODO: consider taking the wrapper of the table instead of the window's width'
        if (rowNodeRect.width >= windowWidth - buttonWidth && this.state.showDropdown !== true) {
            this.displayBtn(true);
        } else if (rowNodeRect.width < windowWidth - buttonWidth && this.state.showDropdown !== false) {
            this.displayBtn(false);
        }
        const tabDimensions = [];
        const tds = node.getElementsByTagName('td');
        let tabsTotalWidth = 0;
        for (let i = 0; i < tds.length; i++) {
            tabDimensions.push(tds[i].getBoundingClientRect());
            tabsTotalWidth += tds[i].getBoundingClientRect().width;
        }
        const activeTabIndex = this.getActiveTabIndex();
        if (tabsTotalWidth >= windowWidth - buttonWidth && activeTabIndex && activeTabIndex < tabDimensions.length) {
            // if the tab is far left
            if (tabDimensions[activeTabIndex].left < 0 && tabDimensions[activeTabIndex].right < windowWidth - buttonWidth) {
                if (tabsTotalWidth + tabDimensions[0].left < windowWidth - buttonWidth) {
                    // if there is a gap between the last tab and the dropdown button
                    this.setOffset(this.calculateRightCoordinate(tabDimensions, tabDimensions.length - 1, windowWidth, buttonWidth, rowNodeRect.left));
                } else {
                    // if the tab is far left
                    this.setOffset(this.calculateLeftCoordinate(tabDimensions, activeTabIndex));
                }
            } else if (tabDimensions[activeTabIndex].right > windowWidth - buttonWidth && tabDimensions[activeTabIndex].left > 0) {
            // if the tab is far right
                this.setOffset(this.calculateRightCoordinate(tabDimensions, activeTabIndex, windowWidth, buttonWidth, rowNodeRect.left));
            } else if (tabsTotalWidth + tabDimensions[0].left < windowWidth - buttonWidth) {
            // if there is a gap between the last tab and the dropdown button
                this.setOffset(this.calculateRightCoordinate(tabDimensions, tabDimensions.length - 1, windowWidth, buttonWidth, rowNodeRect.left));
            }
        } else if (activeTabIndex && activeTabIndex >= tabDimensions.length) {
            // do nothing for now
        } else {
            this.setOffset(0);
        }
        //        }
    }

    displayBtn(state) {
        if (this.state.showDropdown !== state) { // DO NOT CHANGE THIS LINE
            this.setState({
                showDropdown: state
            });
        }
    }

    setOffset(offset) {
        if (this.state.offset !== offset) { // DO NOT CHANGE THIS LINE
            this.setState({
                offset
            });
        }
    }

    getActiveTabIndex() {
        for (let i = 0; i < this.props.tabs.length; i++) {
            if (matchPath(this.context.router.route.location.pathname, {path: this.props.tabs[i].pathname, exact: true})) {
                return i; // 0 based index
            }
        }
    }

    calculateLeftCoordinate(tabDimensions, activeTabIndex) {
        const leftCoordinate = tabDimensions[0].left;
        const activeTabCoordinate = tabDimensions[activeTabIndex].left;
        return leftCoordinate - activeTabCoordinate;
    }

    calculateRightCoordinate(tabDimensions, activeTabIndex, windowWidth, buttonWidth, currentOffset) {
        const activeTabCoordinate = tabDimensions[activeTabIndex].right;
        const result = ((activeTabCoordinate - windowWidth + buttonWidth) * -1) + currentOffset;
        return result;
    }

    render() {
        const displayBtnStyle = this.state.showDropdown ? 'block' : 'none';
        let offsetStyle;
        if (this.state.offset > 0) {
            offsetStyle = '-' + this.state.offset + 'px';
        } else {
            offsetStyle = this.state.offset + 'px';
        }
        return (
            <div className={classnames(style.TabMenu, this.getStyle('tabMenu'))}>
                <div className={this.getStyle('tabSelectorWrapper')} style={{display: displayBtnStyle}}>
                    <TabDropdown data={this.props.tabs} activeItem={this.state.activeTabIndex} onSelectItem={this.props.onClick} />
                </div>
                <div className={style.relativeWrapper}>
                    <div className={style.absoluteWrapper}>
                        <table ref='tabset' className={this.getStyle('tabNavbar')} style={{left: offsetStyle}}>
                            <tbody>
                                <tr>
                                    {this.props.tabs.map((tab, i) => {
                                        const onClose = (e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            const prev = this.props.tabs[i - 1]; // TODO: check perf
                                            const next = this.props.tabs[i + 1]; // TODO: check perf
                                            this.props.onTabClose(tab, prev, next);
                                        };
                                        const handleClick = () => this.props.onClick(tab);
                                        return (
                                            <td key={i}>
                                                <TabLink onClose={onClose} {...tab} onClick={handleClick} />
                                            </td>
                                        );
                                    })}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
};

TabMenu.propTypes = {
    defaultLocation: PropTypes.string.isRequired,
    tabs: PropTypes.array.isRequired,
    onTabClose: PropTypes.func,
    onClick: PropTypes.func // used when pathname is not given to the tabLink
};

TabMenu.defaultProps = {
    onTabClose: function() {}
};

TabMenu.contextTypes = {
    router: PropTypes.object.isRequired,
    implementationStyle: PropTypes.object
};

export default TabMenu;
