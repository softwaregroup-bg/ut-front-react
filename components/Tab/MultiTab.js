import React, { Component, PropTypes } from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import Link from './../Link';
import Tab from './Tab';
import Menu from './../MenuNew';
import styles from './styles.css';

export default class MultiTab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            menuToggled: false
        };

        this.toggleMenu = debounce(this.toggleMenu, 200);
        this.onClick = this.onClick.bind(this);
        this.getMenuItems = this.getMenuItems.bind(this);
        this.requestCloseMenu = this.requestCloseMenu.bind(this);
    }

    getMenuItems() {
        const { multi } = this.props.tab;

        return multi.reduce((tabs, currentTab) => {
            tabs.push((
              <Tab
                key={currentTab.routeName}
                tab={currentTab} />
            ));

            return tabs;
        }, []);
    }

    requestCloseMenu() {
        this.toggleMenu();
    }

    onClick(e) {
        e.preventDefault();
        this.toggleMenu();
    }

    toggleMenu(e) {
        this.setState({
            menuToggled: !this.state.menuToggled
        });
    }

    render() {
        const { tab } = this.props;

        return (
            <div
              className={styles.navigationMultiTab}
              onClick={this.props.onClick}
            >
                <Link
                  onClick={this.onClick}
                  to={tab.routeName}
                  params={tab.routeParams}
                  className={classNames(styles.navigationTab)}
                  activeClassName={styles.navigationTabActive} >
                    {tab.title}
                </Link>
                <Menu
                  fields={this.getMenuItems()}
                  open={this.state.menuToggled}
                  requestClose={this.requestCloseMenu}
                  closeOnSelect />
            </div>
        );
    }
}

MultiTab.propTypes = {
    tab: PropTypes.object,
    onClick: PropTypes.func
};
