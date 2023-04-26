import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Link from './../Link';
import Tab from './Tab';
import Menu from './../MenuNew';
import Text from '../Text';
import styles from './styles.css';
import {closest} from '../../utils/dom';
import {generateUniqueId} from '../../utils/helpers';

const multiTab = 'multiTab';

export default class MultiTab extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            menuToggled: false,
            hasValidChildren: false
        };

        this.toggleMenu = this.toggleMenu.bind(this);
        this.onClick = this.onClick.bind(this);
        this.getMenuItems = this.getMenuItems.bind(this);
        this.requestCloseMenu = this.requestCloseMenu.bind(this);
    }

    componentWillMount() {
        this.isComponentMounted = true;
    }

    componentWillUnmount() {
        this.isComponentMounted = false;
    }

    getMenuItems() {
        const { multi } = this.props.tab;
        return multi.reduce((tabs, currentTab) => {
            let tab;
            if (currentTab.multi) {
                tab = (<MultiTab
                    tab={currentTab}
                    key={generateUniqueId()}
                    positioningDirections={'top-right'}
                    rightArrowIcon
                    className={styles.menuItemTab}
                />);
            } else {
                tab = (<Tab
                    key={generateUniqueId()}
                    tab={currentTab}
                    className={styles.menuItemTab}
                />);
            }

            tabs.push(tab);

            return tabs;
        }, []);
    }

    requestCloseMenu({target}) {
        // close menu if event target is not another multitab nor is child of the root element
        (!this.rootElement.contains(target) || closest(target, 'div').getAttribute('data-type') !== multiTab) && this.toggleMenu();
    }

    onClick(e) {
        e.preventDefault();
        this.toggleMenu();
    }

    toggleMenu(e) {
        this.isComponentMounted && this.setState({
            menuToggled: !this.state.menuToggled
        });
    }

    render() {
        const { className, tab } = this.props;
        const menuItems = this.getMenuItems();
        if (!menuItems.length) {
            return null;
        }

        return (
            <div
                className={styles.navigationMultiTab}
                onClick={this.props.onClick}
                ref={(element) => { this.rootElement = element; }}
                data-type={multiTab}
            >
                <Link
                    onClick={this.onClick}
                    to={tab.routeName}
                    params={tab.routeParams}
                    className={classNames(className, styles.navigationTab)}
                    activeClassName={styles.navigationTabActive}
                >
                    <Text>{tab.title}</Text>
                    {this.props.rightArrowIcon && <span className={styles.navigationMultiTabArrow} />}
                </Link>
                <Menu
                    fields={menuItems}
                    open={this.state.menuToggled}
                    requestClose={this.requestCloseMenu}
                    anchorEl={this.rootElement}
                    positioningDirections={this.props.positioningDirections}
                    className={styles.multiTabMenu}
                    closeOnSelect
                />
            </div>
        );
    }
}

MultiTab.propTypes = {
    className: PropTypes.string,
    positioningDirections: PropTypes.string,
    tab: PropTypes.object,
    onClick: PropTypes.func,
    dataType: PropTypes.string,
    rightArrowIcon: PropTypes.bool
};

MultiTab.defaultProps = {
    positioningDirections: 'bottom-left',
    rightArrowIcon: false
};
