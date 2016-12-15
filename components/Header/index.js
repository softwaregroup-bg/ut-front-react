import React, { PropTypes } from 'react';
import classnames from 'classnames';

import Logo from './Logo';
import User from './User';
import style from './style.css';
import docsConfig from './../../config/docs.config';

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
        onLogOut: PropTypes.func,
        currentLocation: PropTypes.object
    },
    contextTypes: {
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
    openHelp() {
        const { currentLocation } = this.props;
        const url = docsConfig[currentLocation];

        window.open(url, '_blank');
    },
    render() {
      debugger;
        return (
            <div className={this.getStyle('header')}>
                <div className={this.getStyle('headerCell')}>
                    <Logo version={this.props.version} headerCellText={this.props.headerCellText} />
                </div>

                <div className={[this.getStyle('headerCell'), this.getStyle('headerCellCenter')].join(' ')}>
                    {this.props.children}
                </div>

                <div className={classnames(this.getStyle('headerCell'), this.getStyle('headerCellProfile'))}>
                    <div className={this.getStyle('headerCellProfileWrap')}>
                        <User personInfo={this.props.personInfo} onLogOut={this.props.onLogOut} />
                    </div>
                    <div onClick={this.openHelp} className={this.getStyle('helpWrap')} />
                </div>
            </div>
        );
    }
});

export default Header;
