import React, { PropTypes } from 'react';
import classnames from 'classnames';
import get from 'lodash.get';
import Avatar from 'material-ui/Avatar';
import profilePicture from './images/profile_picture.png';
import style from './style.css';

export default class User extends React.Component {
    constructor(props) {
        super(props);
        this.toggleProfileInfoMenu = this.toggleProfileInfoMenu.bind(this);
        this.getStyle = this.getStyle.bind(this);
    }
    getStyle(name) {
        return (this.context.implementationStyle && this.context.implementationStyle[name]) || style[name];
    }
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
    }
    componentWillMount() {
        this.setState({userMenu: {open: false}});
    }
    render() {
        let {personInfo} = this.props;
        let person = personInfo.person;
        let firstEmail = get(personInfo, 'emails[0].value');
        let roles = get(personInfo, 'roles').map((role) => role.name).join(', ');
        let headProfileInfoWrapStyles = this.state.userMenu.open ? '' : this.getStyle('headerCellProfileWrapHidden');

        return (
            <div className={this.getStyle('headerCellProfile')}>
                <div onClick={this.toggleProfileInfoMenu} className={this.getStyle('navigationExpandMoreIcon')}>
                    <Avatar src={(this.context.assets && this.context.assets.headerMenu && this.context.assets.headerMenu.profilePicture) || profilePicture} size={30} />
                </div>

                <div className={classnames(headProfileInfoWrapStyles, this.getStyle('headerCellProfileWrapInfo'))}>
                    <div className={this.getStyle('headerCellProfileWrapInfoTopWrap')} data-profileWrap>
                        <div className={this.getStyle('headerCellProfileWrapInfoTopWrapUpArrow')} data-profileWrap />

                        <div className={this.getStyle('headerCellProfileWrapInfoTopWrapInner')} data-profileWrap>
                            <div className={this.getStyle('headerCellProfileWrapInfoTopWrapInnerProfileImage')} data-profileWrap>
                                <div className={this.getStyle('profileImage')} data-profileWrap />
                                <div className={this.getStyle('changeButton')} data-profileWrap>Change</div>
                            </div>
                            <div className={this.getStyle('headerCellProfileWrapInfoTopWrapInnerInfoWrap')} data-profileWrap>
                                <div data-profileWrap className={classnames(this.getStyle('fullName'), this.getStyle('longDOttedText'))}>{person.firstName} {person.lastName}</div>
                                <div data-profileWrap className={classnames(this.getStyle('email'), this.getStyle('longDOttedText'))}>{firstEmail}</div>
                                <div data-profileWrap className={classnames(this.getStyle('roles'), this.getStyle('longDOttedText'))}>{roles}</div>
                            </div>
                        </div>

                    </div>

                    <div className={this.getStyle('bottomWrap')} data-profileWrap>
                        <button className={classnames('buttonOnBg', this.getStyle('button'))} onClick={this.props.onLogOut} data-profileWrap data-unbindAll>
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

User.propTypes = {
    personInfo: PropTypes.object,
    onLogOut: PropTypes.func
};

User.contextTypes = {
    mainUrl: PropTypes.string,
    router: PropTypes.object.isRequired
};
