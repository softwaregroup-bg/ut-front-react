import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Link from './../Link';
import Tab from './Tab';
import Menu from './../MenuNew';
import styles from './styles.css';
import {closest} from '../../utils/dom';
import {generateUniqueId} from '../../utils/helpers';

const multiTab = 'multiTab';

export default class MultiTab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            menuToggled: false
        };

        this.toggleMenu = this.toggleMenu.bind(this);
        this.onClick = this.onClick.bind(this);
        this.getMenuItems = this.getMenuItems.bind(this);
        this.requestCloseMenu = this.requestCloseMenu.bind(this);
    }

    getMenuItems() {
        const { multi } = this.props.tab;

        return multi.reduce((tabs, currentTab) => {
            if (currentTab.multi) {
                tabs.push((
                    <MultiTab
                      tab={currentTab}
                      key={generateUniqueId()}
                      positioningDirections={'top-right'}
                      rightArrowIcon />
                ));
            } else {
                tabs.push((
                    <Tab
                      key={generateUniqueId()}
                      tab={currentTab}
                      className={styles.menuItemTab} />
                    ));
            }

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
        this.updater.isMounted(this) && this.setState({
            menuToggled: !this.state.menuToggled
        });
    }

    render() {
        const { tab } = this.props;

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
                  className={classNames(styles.navigationTab)}
                  activeClassName={styles.navigationTabActive} >
                    {tab.title}
                    {this.props.rightArrowIcon && <span className={styles.navigationMultiTabArrow} />}
                </Link>
                <Menu
                  fields={this.getMenuItems()}
                  open={this.state.menuToggled}
                  requestClose={this.requestCloseMenu}
                  anchorEl={this.rootElement}
                  positioningDirections={this.props.positioningDirections}
                  className={styles.multiTabMenu}
                  closeOnSelect />
            </div>
        );
    }
}

MultiTab.propTypes = {
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
