import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import HeaderLogo from './HeaderLogo';
import TabsContainer from './TabsContainer';
import HeaderProfileInfo from './HeaderProfileInfo';
import styles from './styles.css';

export default class HeaderNew extends Component {
    render() {
        const { tabset, personInfo, logout, currentLocation, text, replaceWithBrakes } = this.props;
        const { classLogoContainer, classTabsContainer, classProfileInfoContainer } = this.props.classes;

        return (
            <div className={styles.headerContainer}>
                <HeaderLogo
                  text={text}
                  replaceWithBrakes={!!replaceWithBrakes}
                  className={classNames(styles.headerLogoContainer, classLogoContainer)} />
                <TabsContainer
                  tabset={tabset}
                  className={classNames(styles.tabsContainer, classTabsContainer)} />
                <HeaderProfileInfo
                  currentLocation={currentLocation}
                  personInfo={personInfo}
                  logout={logout}
                  className={classNames(styles.profileContainer, classProfileInfoContainer)} />
            </div>
        );
    }
}

HeaderNew.defaultProps = {
    text: 'Administration\\nPortal',
    currentLocation: '/',
    replaceWithBrakes: false,
    classes: {
        'classLogoContainer': '',
        'classTabsContainer': '',
        'classProfileInfoContainer': ''
    }
};

HeaderNew.propTypes = {
    tabset: PropTypes.array,
    text: PropTypes.string,
    personInfo: PropTypes.object,
    logout: PropTypes.func,
    currentLocation: PropTypes.string,
    replaceWithBrakes: PropTypes.bool,
    classes: PropTypes.object
};
