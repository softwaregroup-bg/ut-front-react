import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import get from 'lodash.get';

import Avatar from 'material-ui/Avatar';
import profilePicture from './images/profile_picture.png';
import style from './style.css';

const Header = React.createClass({
    propTypes: {
        headerCellText: PropTypes.object,
        children: PropTypes.any,
        personInfo: PropTypes.shape({
            person: PropTypes.shape({
                firstName: PropTypes.string.isRequired,
                lastName: PropTypes.string.isRequired
            }).isRequired
        }).isRequired,
        version: PropTypes.string,
        onLogOut: PropTypes.func
    },
    contextTypes: {
        mainUrl: PropTypes.string,
        implementationStyle: PropTypes.object,
        assets: PropTypes.shape({
            headerMenu: PropTypes.shape({
                profilePicture: PropTypes.string
            })
        })
    },
    defaultProps: {
        version: '',
        onLogOut: () => {}
    },
    getStyle(name) {
        return (this.context.implementationStyle && this.context.implementationStyle[name]) || style[name];
    },
    toggleProfileInfoMenu() {
        let self = this;
        let handleCloseDocFunc = function(e) {
            if (!e.target.attributes.getNamedItem('data-profileWrap')) {
                document.removeEventListener('click', handleCloseDocFunc);
                self.setState({userMenu: {open: false}});
            }
            if (e.target.attributes.getNamedItem('data-unbindAll')) {
                document.removeEventListener('click', handleCloseDocFunc);
            }
        };
        if (!this.state.userMenu.open) {
            document.addEventListener('click', handleCloseDocFunc);
        }
        this.setState({userMenu: {open: !this.state.userMenu.open}});
    },
    componentWillMount() {
        this.setState({userMenu: {open: false}});
    },
    render() {
        let { children, personInfo, onLogOut } = this.props;
        let person = personInfo.person;
        let firstEmail = get(personInfo, 'emails[0].value');

        let roles = get(personInfo, 'roles').map((role) => role.name).join(', ');
        let headProfileInfoWrapStyles = this.state.userMenu.open ? '' : this.getStyle('hidden');
        let version = this.props.version;
        return (
            <div id={this.getStyle('header')}>
                <div id={this.getStyle('logoWrap')} className={this.getStyle('headerCell')}>
                    <Link to={this.context.mainUrl} id={this.getStyle('logo')}>
                        &nbsp;
                    </Link>
                    <h2 className='f-semibold'>{this.props.headerCellText}</h2>
                    {version && <span className={this.getStyle('version')}>{version}</span>}
                </div>

                <div id={this.getStyle('mainNavigationWrap')} className={this.getStyle('headerCell')}>
                    {children}
                </div>

                <div id={this.getStyle('headProfileWrap')} className={this.getStyle('headerCell')}>
                    <div className={this.getStyle('profileWrap')}>
                        <div onClick={this.toggleProfileInfoMenu} className={this.getStyle('navigationExpandMoreIcon')}>
                            <Avatar src={(this.context.assets && this.context.assets.headerMenu && this.context.assets.headerMenu.profilePicture) || profilePicture} size={30} />
                        </div>

                        <div id={this.getStyle('headProfileInfoWrap')} className={headProfileInfoWrapStyles}>
                            <div className={this.getStyle('topWrap')} data-profileWrap>
                                <div id={this.getStyle('upArrow')} data-profileWrap />

                                <div className={this.getStyle('innerWrap')} data-profileWrap>
                                    <div id={this.getStyle('profileImageWrap')} data-profileWrap>
                                        <div id={this.getStyle('profileImage')} data-profileWrap />
                                        <div className={this.getStyle('changeButton')} data-profileWrap>Change</div>
                                    </div>
                                    <div id={this.getStyle('infoWrap')} data-profileWrap>
                                        <div data-profileWrap className={classnames(this.getStyle('fullName'), this.getStyle('longDOttedText'))}>{person.firstName} {person.lastName}</div>
                                        <div data-profileWrap className={classnames(this.getStyle('email'), this.getStyle('longDOttedText'))}>{firstEmail}</div>
                                        <div data-profileWrap className={classnames(this.getStyle('roles'), this.getStyle('longDOttedText'))}>{roles}</div>
                                    </div>
                                </div>

                            </div>

                            <div className={this.getStyle('bottomWrap')} data-profileWrap>
                                <button className={classnames('buttonOnBg', this.getStyle('button'))} onClick={onLogOut} data-profileWrap data-unbindAll>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={this.getStyle('tasksWrap')} />
                </div>
            </div>
        );
    }
});

export default Header;
