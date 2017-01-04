import React, { Component, PropTypes } from 'react';
import HeaderLogo from './HeaderLogo';
import TabsContainer from './TabsContainer';
import HeaderProfileInfo from './HeaderProfileInfo';
import styles from './styles.css';

export default class HeaderNew extends Component {
    render() {
        const { tabset, personInfo, logout, currentLocation, text, replaceWithBrakes } = this.props;
        return (
            <div className={styles.headerContainer}>
                <HeaderLogo
                  text={text}
                  replaceWithBrakes={!!replaceWithBrakes} />
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
    text: PropTypes.string,
    personInfo: PropTypes.object,
    logout: PropTypes.func,
    currentLocation: PropTypes.string,
    replaceWithBrakes: PropTypes.bool
};
