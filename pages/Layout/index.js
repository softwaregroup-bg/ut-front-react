import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Header from '../../components/HeaderNew';
import TabMenu from '../../containers/TabMenu';
import { logout } from '../../containers/LoginForm/actions';
import { Vertical } from '../../components/Layout';
import styles from './style.css';
import classnames from 'classnames';

class Layout extends Component {
    getStyle(name) {
        return (this.context.implementationStyle && this.context.implementationStyle[name]) || '';
    }

    render() {
        let result = this.props.login.get('result');
        let header = (
            <Header
                currentLocation={this.props.location.pathname}
                personInfo={result && result.toJS()}
                logout={this.props.logout}
                replaceWithBrakes
                tabset={this.context.mainTabset}
                headerText={this.props.headerText} />
        );
        let tabMenu = (
            <TabMenu defaultLocation={this.context.mainUrl} />
        );
        if (result) {
            return (
                <div className={classnames(this.getStyle('implWrapper'), styles.h100pr)}>
                    <Vertical fixedComponent={header}>
                        <Vertical fixedComponent={tabMenu}>
                            <div id='appContent' className={styles.h100pr}>
                                {this.props.children}
                            </div>
                        </Vertical>
                    </Vertical>
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
