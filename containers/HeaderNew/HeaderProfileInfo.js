import PropTypes from 'prop-types';
import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import MenuNew from '../../components/MenuNew';
import { Tab } from '../../components/Tab';
import styles from './styles.css';
import tabStyles from '../../components/Tab/styles.css';

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
        const items = [
            { text: 'Help', onClick: this.openHelp },
            { text: 'Settings', routeName: 'ut-user:userProfile' },
            { text: 'Log out', onClick: this.onLogOutClick }
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
                    onClick={currentItem.onClick}
                />
            );

            return items;
        }, []);
    }

    get initials() {
        let { firstName, lastName } = this.props.personInfo.person;
        if (!firstName || !lastName) {
            // Fallback if a user does not have these field filled
            return 'n/a';
        }
        const regex = /[a-zA-Zа-яА-Я]?/;
        firstName = firstName.match(regex)[0];
        lastName = lastName.match(regex)[0];

        return `${firstName}${lastName}`;
    }

    render() {
        const { className } = this.props;
        const { menuToggled } = this.state;

        const direction = document.getElementsByTagName('html')[0].getAttribute('dir') || 'ltr';
        const offsets = direction === 'ltr' ? { right: 5, bottom: 9 } : { left: 5, bottom: 9 };
        const positioningDirections = direction === 'ltr' ? 'right-bottom' : 'bottom-left';

        return (
            <span className={styles.profileInfo}>
                <span
                    className={className}
                    ref={(element) => { this.infoArrowNode = element; }}
                >
                    <div className={styles.profileInfoContainer}>
                        <div
                            className={styles.avatarContainer}
                            onClick={this.onClick}
                        >
                            {this.initials}
                        </div>
                        <div
                            className={styles.avatarInfoArrow}
                            onClick={this.onClick}
                            ref={(element) => { this.anchorEl = element; }}
                        />
                    </div>
                    <MenuNew
                        open={menuToggled}
                        fields={this.getMenuItems()}
                        anchorEl={this.infoArrowNode}
                        requestClose={this.requestCloseMenu}
                        additionalOffsets={offsets}
                        positioningDirections={positioningDirections}
                        className={styles.profileInfoPopoverMenu}
                        separatorsOnIndex={[2]}
                        closeOnSelect
                    />
                </span>
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
