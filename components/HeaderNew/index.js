import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import HeaderLogo from './HeaderLogo';
import TabsContainer from './TabsContainer';
import HeaderProfileInfo from './HeaderProfileInfo';
import { logout } from '../../containers/LoginForm/actions';
import styles from './styles.css';

class HeaderNew extends Component {
    render() {
        const { tabset, personInfo, logout } = this.props;
        return (
            <div className={styles.headerContainer}>
                <HeaderLogo text='Administration Portal' />
                <TabsContainer tabset={tabset} />
                <HeaderProfileInfo
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
    onLogOut: PropTypes.func
};

HeaderNew.contextTypes = {
    mainTabset: PropTypes.array
};

export default connect(
    null,
    { logout }
)(HeaderNew);
