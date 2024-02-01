import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../../containers/HeaderNew';
import TabMenu from '../../containers/TabMenu';
import { logout } from '../../containers/LoginForm/actions';
import { Vertical } from '../../components/Layout';
import styles from './style.css';
import classnames from 'classnames';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: window.innerHeight
        };
        this.resize = () => this.setState({
            height: window.innerHeight
        });
    }

    componentDidMount() {
        window.addEventListener('resize', this.resize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

    getStyle(name) {
        return (this.context.implementationStyle && this.context.implementationStyle[name]) || '';
    }

    render() {
        const result = this.props.login.get('result');
        const header = (
            <Header
                currentLocation={this.props.location.pathname}
                personInfo={result && result.toJS()}
                logout={this.props.logout}
                replaceWithBrakes
                tabset={this.context.mainTabset}
                headerText={this.props.headerText}
            />
        );
        const tabMenu = (
            <TabMenu defaultLocation={this.context.mainUrl} />
        );
        if (result) {
            return (
                <div className={classnames(this.getStyle('implWrapper'), styles.h100pr)} style={{height: this.state.height}}>
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
            login: state.login
        };
    },
    { logout }
)(Layout);
