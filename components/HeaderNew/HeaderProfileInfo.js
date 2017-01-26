import React, { Component, PropTypes } from 'react';
import debounce from 'lodash.debounce';
import MenuNew from '../MenuNew';
import { Tab } from '../Tab';
import styles from './styles.css';
import tabStyles from '../Tab/styles.css';

export default class HeaderProfileInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuToggled: false
        };
        this.onClick = this.onClick.bind(this);
        this.toggleMenu = debounce(this.toggleMenu, 200);
        this.requestCloseMenu = this.requestCloseMenu.bind(this);
        this.onLogOutClick = this.onLogOutClick.bind(this);
        this.openHelp = this.openHelp.bind(this);
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

    openHelp() {
        const { currentLocation } = this.props;
        const { getDocsUrl } = this.context;
        const url = getDocsUrl(currentLocation);

        url && window.open(url, '_blank');
    }

    onLogOutClick() {
        const { logout } = this.props;
        logout();
    }

    getMenuItems() {
        let items = [
          {text: 'Help', onClick: this.openHelp},
          {text: 'Settings', routeName: 'ut-user:userProfile'},
          {text: 'Log out', onClick: this.onLogOutClick}
        ];

        return items.reduce((items, currentItem, index) => {
            items.push(
              <Tab
                key={currentItem.text}
                tab={{
                    routeName: currentItem.routeName,
                    title: currentItem.text
                }}
                className={tabStyles.menuItemTab}
                disabled={currentItem.disabled}
                onClick={currentItem.onClick} />
              );

            return items;
        }, []);
    }

    render() {
        const { className } = this.props;
        const { menuToggled } = this.state;
        const { firstName, lastName } = this.props.personInfo.person;
        const fullName = `${firstName} ${lastName}`;

        return (
            <span
              className={className}
              ref={(element) => { this.infoArrowNode = element; }} >
                <div className={styles.profileInfoContainer}>
                  <div
                    className={styles.avatarContainer}
                    onClick={this.onClick} />
                  <div
                    className={styles.avatarInfoArrow}
                    onClick={this.onClick}
                    ref={(element) => { this.anchorEl = element; }} />
                </div>
                <div className={styles.personalInfoName}>{fullName}</div>
                <MenuNew
                  open={menuToggled}
                  fields={this.getMenuItems()}
                  anchorEl={this.infoArrowNode}
                  requestClose={this.requestCloseMenu}
                  additionalOffsets={{right: 5, bottom: 9}}
                  positioningDirections='right-bottom'
                  className={styles.profileInfoPopoverMenu}
                  separatorsOnIndex={[2]}
                  closeOnSelect />
            </span>
        );
    }
}

HeaderProfileInfo.contextTypes = {
    getDocsUrl: PropTypes.func
};

HeaderProfileInfo.defaultProps = {
    currentLocation: '/'
};

HeaderProfileInfo.propTypes = {
    logout: PropTypes.func,
    personInfo: PropTypes.object,
    currentLocation: PropTypes.string,
    className: PropTypes.string
};
