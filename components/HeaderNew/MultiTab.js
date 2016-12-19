import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Link from './Link';
import Tab from './Tab';
import Menu from './../MenuNew';
import styles from './styles.css';

export default class MultiTab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            menuToggled: false
        };

        this.toggleMenu = this.toggleMenu.bind(this);
        this.getMenuItems = this.getMenuItems.bind(this);
    }

    getMenuItems() {
        const { multi } = this.props.tab;

        return multi.reduce((tabs, currentTab) => {
            tabs.push((
              <Tab
                key={currentTab.routeName}
                tab={currentTab}
                onClick={(e) => { e.preventDefault(); }}
              />
            ));

            return tabs;
        }, []);
    }

    toggleMenu(e) {
        e.preventDefault();
        this.setState({
            menuToggled: !this.state.menuToggled
        });
    }

    render() {
        const { tab } = this.props;

        return (
            <div className={styles.navigationMultiTab}>
            <Link
              onClick={this.toggleMenu}
              to={tab.routeName}
              params={tab.routeParams}
              className={classNames(styles.navigationTab)} >
                {tab.title}
            </Link>
              {this.state.menuToggled ? <Menu fields={this.getMenuItems()} /> : false}
            </div>
        );
    }
}

MultiTab.propTypes = {
    tab: PropTypes.object
};
