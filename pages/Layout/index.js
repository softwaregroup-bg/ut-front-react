import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Header from '../../components/HeaderNew';
import TabMenu from '../../containers/TabMenu';
import { logout } from '../../containers/LoginForm/actions';
import styles from './style.css';

class Layout extends Component {
    getStyle(name) {
        return (this.context.implementationStyle && this.context.implementationStyle[name]) || '';
    }

    render() {
        let result = this.props.login.get('result');

        if (result) {
            return (
                <div className={this.getStyle('implWrapper')}>
                    <Header
                      currentLocation={this.props.location.pathname}
                      personInfo={result.toJS()}
                      logout={this.props.logout}
                      replaceWithBrakes
                      tabset={this.context.mainTabset}
                      headerText={this.props.headerText} />
                    <TabMenu defaultLocation={this.context.mainUrl} />
                    <div id='appContent'>
                        {this.props.children}
                        <div id='controls' className={styles.controls} />
                    </div>
                </div>
            );
        } else {
            return false;
        }
    }
}

Layout.propTypes = {
    children: PropTypes.any,
    login: PropTypes.object,
    location: PropTypes.object,
    headerText: PropTypes.string,
    headerCellText: PropTypes.object,
    logout: PropTypes.func
};
Layout.contextTypes = {
    router: PropTypes.any,
    implementationStyle: PropTypes.object,
    mainTabset: PropTypes.array,
    checkPermission: PropTypes.func,
    mainUrl: PropTypes.string
};

export default connect(
    (state) => {
        return {
            tabs: state.tabMenu.tabs,
            login: state.login
        };
    },
    { logout }
)(Layout);
