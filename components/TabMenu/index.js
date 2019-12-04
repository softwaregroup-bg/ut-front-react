import React, { PropTypes } from 'react';
import ReactDom from 'react-dom';
import classnames from 'classnames';
import style from './style.css';
import TabLink from './TabLink';
import TabDropdown from './TabDropdown';

class TabMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDropdown: false,
            offset: 0,
            activeTabIndex: 0
        };
        this.displayBtn = this.displayBtn.bind(this);
        this.setOffset = this.setOffset.bind(this);
        this.getActiveTabIndex = this.getActiveTabIndex.bind(this);
        this.updateActiveTabIndex = this.updateActiveTabIndex.bind(this);
        this.calculateLeftCoordinate = this.calculateLeftCoordinate.bind(this);
        this.calculateRightCoordinate = this.calculateRightCoordinate.bind(this);
    }

    getStyle(name) {
        return (this.context.implementationStyle && this.context.implementationStyle[name]) || style[name];
    }

    componentWillReceiveProps(newProps) {
        if (this.props.activeTab === '') {
            this.updateActiveTabIndex(this.getActiveTabIndex());
        } else {
            this.updateActiveTabIndex(this.props.activeTab);
        }
    }

    componentDidUpdate() {
        //        if (this.state.activeTabIndex && this.state.activeTabIndex < this.props.tabs.length) {
        let node = ReactDom.findDOMNode(this.refs.tabset);
        let rowNodeRect = node.getElementsByTagName('tr')[0].getBoundingClientRect();
        let buttonWidth = 32; // the width of the dropdown button // TODO: consider taking this value dynamically
        let windowWidth = window.innerWidth; // TODO: consider taking the wrapper of the table instead of the window's width'
        if (rowNodeRect.width >= windowWidth - buttonWidth && this.state.showDropdown !== true) {
            this.displayBtn(true);
        } else if (rowNodeRect.width < windowWidth - buttonWidth && this.state.showDropdown !== false) {
            this.displayBtn(false);
        }
        let tabDimensions = [];
        let tds = node.getElementsByTagName('td');
        let tabsTotalWidth = 0;
        for (let i = 0; i < tds.length; i++) {
            tabDimensions.push(tds[i].getBoundingClientRect());
            tabsTotalWidth += tds[i].getBoundingClientRect().width;
        }
        if (tabsTotalWidth >= windowWidth - buttonWidth && this.state.activeTabIndex && this.state.activeTabIndex < tabDimensions.length) {
            // if the tab is far left
            if (tabDimensions[this.state.activeTabIndex].left < 0 && tabDimensions[this.state.activeTabIndex].right < windowWidth - buttonWidth) {
                if (tabsTotalWidth + tabDimensions[0].left < windowWidth - buttonWidth) {
                    // if there is a gap between the last tab and the dropdown button
                    this.setOffset(this.calculateRightCoordinate(tabDimensions, tabDimensions.length - 1, windowWidth, buttonWidth, rowNodeRect.left));
                } else {
                    // if the tab is far left
                    this.setOffset(this.calculateLeftCoordinate(tabDimensions, this.state.activeTabIndex));
                }
            } else if (tabDimensions[this.state.activeTabIndex].right > windowWidth - buttonWidth && tabDimensions[this.state.activeTabIndex].left > 0) {
                // if the tab is far right
                this.setOffset(this.calculateRightCoordinate(tabDimensions, this.state.activeTabIndex, windowWidth, buttonWidth, rowNodeRect.left));
            } else if (tabsTotalWidth + tabDimensions[0].left < windowWidth - buttonWidth) {
                // if there is a gap between the last tab and the dropdown button
                this.setOffset(this.calculateRightCoordinate(tabDimensions, tabDimensions.length - 1, windowWidth, buttonWidth, rowNodeRect.left));
            }
        } else if (this.state.activeTabIndex && this.state.activeTabIndex >= tabDimensions.length) {
            this.updateActiveTabIndex(this.state.activeTabIndex - 1);
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
                offset: offset
            });
        }
    }

    getActiveTabIndex() {
        for (let i = 0; i < this.props.tabs.length; i++) {
            if (this.context.router.isActive(this.props.tabs[i], true)) {
                return i; // 0 based index
            }
        }
    }

    updateActiveTabIndex(newIndex) {
        if (this.state.activeTabIndex !== newIndex) { // DO NOT CHANGE THIS LINE
            this.setState({
                activeTabIndex: newIndex
            });
        }
    }

    calculateLeftCoordinate(tabDimensions, activeTabIndex) {
        let leftCoordinate = tabDimensions[0].left;
        let activeTabCoordinate = tabDimensions[activeTabIndex].left;
        return leftCoordinate - activeTabCoordinate;
    }

    calculateRightCoordinate(tabDimensions, activeTabIndex, windowWidth, buttonWidth, currentOffset) {
        let activeTabCoordinate = tabDimensions[activeTabIndex].right;
        let result = ((activeTabCoordinate - windowWidth + buttonWidth) * -1) + currentOffset;
        return result;
    }

    render() {
        let displayBtnStyle = this.state.showDropdown ? 'block' : 'none';
        let offsetStyle;
        if (this.state.offset > 0) {
            offsetStyle = '-' + this.state.offset + 'px';
        } else {
            offsetStyle = this.state.offset + 'px';
        }
        return (
            <div className={classnames(style.TabMenu, this.getStyle('tabMenu'))}>
                <div className={this.getStyle('tabSelectorWrapper')} style={{ display: displayBtnStyle }}>
                    <TabDropdown data={this.props.tabs} activeItem={this.state.activeTabIndex} onSelectItem={this.props.onClick} />
                </div>
                <div className={style.relativeWrapper}>
                    <div className={style.absoluteWrapper}>
                        <table ref='tabset' className={this.getStyle('tabNavbar')} style={{ left: offsetStyle }}>
                            <tbody>
                                <tr>
                                    {this.props.tabs.map((tab, i) => {
                                        let onClose = (e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            let prev = this.props.tabs[i - 1]; // TODO: check perf
                                            let next = this.props.tabs[i + 1]; // TODO: check perf
                                            this.props.onTabClose(tab, prev, next);
                                        };
                                        let handleClick = () => this.props.onClick(tab);
                                        let isActive = tab.id === this.props.activeTab;
                                        return (
                                            <td key={i}>
                                                <TabLink onClose={onClose} {...tab} onClick={handleClick} isActive={isActive} />
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
    tabs: PropTypes.array.isRequired,
    activeTab: PropTypes.any,
    onTabClose: PropTypes.func,
    onClick: PropTypes.func // used when pathname is not given to the tabLink
};

TabMenu.defaultProps = {
    activeTab: '',
    onTabClose: function() { }
};

TabMenu.contextTypes = {
    router: PropTypes.object.isRequired,
    implementationStyle: PropTypes.object
};

export default TabMenu;
