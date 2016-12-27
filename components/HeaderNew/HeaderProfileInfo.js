import React, { Component } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import MenuNew from './../MenuNew';
import Tab from './Tab';
import styles from './styles.css';
import { getMarginBox } from '../../utils/dom';
import { getDimensions } from '../../utils/positioning';

export default class HeaderProfileInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuToggled: false
        };
        this.getDimensions = this.getDimensions.bind(this);
        this.onClick = this.onClick.bind(this);
        this.calculateDimensions = this.calculateDimensions.bind(this);
        this.toggleMenu = debounce(this.toggleMenu, 200);
        this.requestCloseMenu = this.requestCloseMenu.bind(this);
    }

    calculateDimensions() {
        return getMarginBox(this.infoArrowNode);
    }

    getDimensions() {
        return this.state.menuToggled
            ? getDimensions('right-bottom', this.calculateDimensions(), {right: 5, bottom: 9})
            : {};
    }

    onClick(e) {
        this.toggleMenu();
    }

    requestCloseMenu() {
        this.toggleMenu();
    }

    toggleMenu() {
        this.setState({
            menuToggled: !this.state.menuToggled
        });
    }

    getMenuItems() {
        let items = ['About', 'Help', 'Settings', 'Log out'];

        return items.reduce((items, currentItem) => {
            items.push(
              <Tab
                key={currentItem}
                tab={{
                    routeName: currentItem.toLowerCase(),
                    routeParams: {},
                    title: currentItem
                }}
                onClick={(e) => { e.preventDefault(); }} />
              );

            return items;
        }, []);
    }

    render() {
        const { menuToggled } = this.state;

        return (
            <span
              className={classNames(styles.headerComponent, styles.profileContainer)}
              ref={(element) => { this.infoArrowNode = element; }} >
                <span
                  className={styles.avatarInfoArrow}
                  onClick={this.onClick} />
                <span className={styles.avatarContainer} />
                <MenuNew
                  open={menuToggled}
                  dimensions={this.getDimensions()}
                  fields={this.getMenuItems()}
                  requestClose={this.requestCloseMenu} />
            </span>
        );
    }
}
