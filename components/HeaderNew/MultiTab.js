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
        this.onBlur = this.onBlur.bind(this);
    }

    onBlur() {
        this.setState({
            menuToggled: false
        });
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
            <div
              className={styles.navigationMultiTab}
              onClick={this.props.onClick}
            >
                <Link
                  onClick={this.toggleMenu}
                  to={tab.routeName}
                  params={tab.routeParams}
                  className={classNames(styles.navigationTab)}
                  activeClassName={styles.navigationTabActive} >
                    {tab.title}
                </Link>
                <Menu fields={this.getMenuItems()} open={this.state.menuToggled} onBlur={this.onBlur} />
            </div>
        );
    }
}

MultiTab.propTypes = {
    tab: PropTypes.object,
    onClick: PropTypes.func
};
