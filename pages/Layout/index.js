import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// import Header from '../../components/Header';
import Header from '../../components/HeaderNew';
import TabMenu from '../../containers/TabMenu';
import Link from '../../components/Header/Link';
import { getLink } from 'ut-front/react/routerHelper';
import {Popover, PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { logout } from '../../containers/LoginForm/actions';
import style from './style.css';

class Tab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        };
        this.handleTouchTap = this.handleTouchTap.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
    }

    handleTouchTap(event) {
        event.preventDefault();
        this.setState({
            open: true,
            anchorEl: event.currentTarget
        });
    }

    handleRequestClose() {
        this.setState({
            open: false
        });
    }
    render() {
        if (typeof (this.props.tabData.permission) === 'undefined') {
            return (
                !this.props.tabData.multi
                    ? <Link to={getLink(this.props.tabData.routeName, this.props.tabData.routeParams || {}) || this.props.currentLocation} {...this.props.tabData.props}>
                        {this.props.tabData.title}
                    </Link>
                    : <Link wideMatch onClick={function(e) { e.preventDefault(); }} to={this.props.currentLocation} style={{display: 'inline'}} {...this.props.tabData.props} onTouchTap={this.handleTouchTap}>
                        {this.props.tabData.title}
                    </Link>
            );
        } else {
            let permitted = this.props.tabData.permission.reduce((result, permission) => {
                if (!result) {
                    return result;
                }
                return permission.indexOf('!') === 0
                ? !this.context.checkPermission(permission.substr(1))
                : this.context.checkPermission(permission);
            }, true);

            if (permitted) {
                return (
                    !this.props.tabData.multi
                        ? <Link to={getLink(this.props.tabData.routeName, this.props.tabData.routeParams || {}) || this.props.currentLocation} {...this.props.tabData.props}>
                            {this.props.tabData.title}
                        </Link>
                        : <Link wideMatch onClick={function(e) { e.preventDefault(); }} to={getLink(this.props.tabData.routeName, this.props.tabData.routeParams || {}) || this.props.currentLocation} style={{display: 'inline', position: 'relative'}} {...this.props.tabData.props} onTouchTap={this.handleTouchTap}>
                            {this.props.tabData.title}
                            <div style={{position: 'absolute', top: '0', left: '0'}}>
                                <Popover
                                  open={this.state.open}
                                  anchorEl={this.state.anchorEl}
                                  anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                  targetOrigin={{horizontal: 'left', vertical: 'top'}}
                                  onRequestClose={this.handleRequestClose}
                                  animation={PopoverAnimationVertical}
                                >
                                    <Menu onTouchTap={this.handleRequestClose}>
                                        {this.props.tabData.multi.map((tab, i) => (
                                            <MenuItem key={i} innerDivStyle={{fontSize: '14px'}} onTouchTap={this.handleRequestClose}>
                                                <div className={style.submenuLink}>
                                                    <Tab tabData={tab} currentLocation={this.props.currentLocation} />
                                                </div>
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </Popover>
                            </div>
                        </Link>
                );
            }
        }

        return false;
    }
}

Tab.propTypes = {
    tabData: PropTypes.object,
    currentLocation: PropTypes.string
};

Tab.contextTypes = {
    checkPermission: PropTypes.func
};

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
                      style={{height: '59px'}}
                      text='Administration\nPortal'
                      replaceWithBrakes
                      tabset={this.context.mainTabset} />
                    <TabMenu defaultLocation={this.context.mainUrl} />
                    {this.props.children}
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
