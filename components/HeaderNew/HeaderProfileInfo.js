import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import MenuNew from './../MenuNew';
import { Tab } from './../Tab';
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
        this.onLogOutClick = this.onLogOutClick.bind(this);
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

    onLogOutClick() {
        const { logout } = this.props;
        logout();
    }

    getMenuItems() {
        let items = [
          {text: 'Help', disabled: true},
          {text: 'Settings', disabled: true},
          {separator: true},
          {text: 'Log out', onClick: this.onLogOutClick}
        ];

        return items.reduce((items, currentItem, index) => {
            items.push(
              !currentItem.separator
              ? <Tab
                key={currentItem.text}
                tab={{
                    routeName: currentItem.text.toLowerCase(),
                    routeParams: {},
                    title: currentItem.text
                }}
                disabled={currentItem.disabled}
                onClick={currentItem.onClick} />
              : <div
                key={index}
                className={styles.menuSeparator} />
              );

            return items;
        }, []);
    }

    render() {
        const { menuToggled } = this.state;
        const { firstName, lastName } = this.props.personInfo.person;
        const fullName = `${firstName} ${lastName}`;

        return (
            <span
              className={classNames(styles.headerComponent, styles.profileContainer)}
              ref={(element) => { this.infoArrowNode = element; }} >
                <div className={styles.profileInfoContainer}>
                  <div className={styles.avatarContainer} />
                  <div
                    className={styles.avatarInfoArrow}
                    onClick={this.onClick}
                    ref={(node) => { this.anchorEl = node; }} />
                </div>
                <div className={styles.personalInfoName}>{fullName}</div>
                <MenuNew
                  open={menuToggled}
                  anchorEl={this.anchorEl}
                  fields={this.getMenuItems()}
                  requestClose={this.requestCloseMenu}
                  dimensions={this.getDimensions()}
                  style={{ padding: '0', minWidth: '110px' }}
                  closeOnSelect />
            </span>
        );
    }
}

HeaderProfileInfo.propTypes = {
    logout: PropTypes.func,
    personInfo: PropTypes.object
};
