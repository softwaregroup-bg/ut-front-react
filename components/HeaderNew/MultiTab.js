import React, { Component, PropTypes } from 'react';
import Link from './Link';
import Tab from './Tab';
import Menu from './../MenuNew';

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
            tabs.push((<Tab key={currentTab.routeName} tab={currentTab} />));

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
        const menuItems = this.getMenuItems();

        return (
            <Link
              widematch
              onClick={this.toggleMenu}
              to={tab.routeName}
              params={tab.routeParams}
              style={{
                  position: 'relative'
              }} >
                {tab.title}
                {this.state.menuToggled ? <Menu fields={this.getMenuItems()} /> : false}
            </Link>
        );
    }
}

MultiTab.propTypes = {
    tab: PropTypes.object
};
