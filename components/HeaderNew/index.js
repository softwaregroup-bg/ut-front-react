import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import HeaderLogo from './HeaderLogo';
import TabsContainer from './TabsContainer';
import HeaderProfileInfo from './HeaderProfileInfo';
import styles from './styles.css';

class HeaderNew extends Component {
    static defaultProps = {
        headerText: '',
        currentLocation: '/',
        replaceWithBrakes: false,
        classes: {
            classLogoContainer: '',
            classTabsContainer: '',
            classProfileInfoContainer: ''
        }
    }

    static propTypes = {
        tabset: PropTypes.array,
        headerText: PropTypes.string,
        personInfo: PropTypes.object,
        logout: PropTypes.func,
        currentLocation: PropTypes.string,
        replaceWithBrakes: PropTypes.bool,
        classes: PropTypes.object
    }

    render() {
        const { tabset, personInfo, logout, currentLocation, headerText, replaceWithBrakes } = this.props;
        const { classLogoContainer, classTabsContainer, classProfileInfoContainer } = this.props.classes;

        return (
            <div className={styles.headerContainer}>
                <HeaderLogo
                    text={headerText}
                    replaceWithBrakes={!!replaceWithBrakes}
                    className={classNames(styles.headerLogoContainer, classLogoContainer)}
                />
                <TabsContainer
                    tabset={tabset}
                    className={classNames(styles.tabsContainer, classTabsContainer)}
                />
                <FloatBalance portalName={this.context.portalName}/>
                <HeaderProfileInfo
                    currentLocation={currentLocation}
                    personInfo={personInfo}
                    logout={logout}
                    className={classNames(styles.profileContainer, classProfileInfoContainer)}
                />
            </div>
        );
    }
}
HeaderNew.contextTypes = {
    portalName: PropTypes.string
};

export default HeaderNew
