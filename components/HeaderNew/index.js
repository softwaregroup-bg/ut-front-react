import React, { Component, PropTypes } from 'react';
import HeaderLogo from './HeaderLogo';
import TabsContainer from './TabsContainer';
import HeaderProfileInfo from './HeaderProfileInfo';
import styles from './styles.css';

export default class HeaderNew extends Component {
    render() {
        const { tabset, personInfo, logout, currentLocation } = this.props;
        return (
            <div className={styles.headerContainer}>
                <HeaderLogo text='Administration Portal' />
                <TabsContainer tabset={tabset} />
                <HeaderProfileInfo
                  currentLocation={currentLocation}
                  personInfo={personInfo}
                  logout={logout} />
            </div>
        );
    }
}

HeaderNew.propTypes = {
    tabset: PropTypes.array,
    personInfo: PropTypes.object,
    logout: PropTypes.func,
    currentLocation: PropTypes.string
};
