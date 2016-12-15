import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// import classNames from 'classnames';
import HeaderLogo from './HeaderLogo';
import TabsContainer from './TabsContainer';
import HeaderProfileInfo from './HeaderProfileInfo';
import styles from './styles.css';

class HeaderNew extends Component {
    render() {
        const { tabset } = this.props;
        return (
            <div className={styles.headerContainer}>
                <HeaderLogo text='Administration Portal' />
                <TabsContainer tabset={tabset} />
                <HeaderProfileInfo />
            </div>
        );
    }
}

HeaderNew.propTypes = {
    tabset: PropTypes.array
};

HeaderNew.contextTypes = {
    mainTabset: PropTypes.array
};

export default connect(
    null,
    null
)(HeaderNew);
