import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import Link from './../Link';
import Text from '../Text';
import styles from './styles.css';

export default class Tab extends Component {
    constructor(props) {
        super(props);
        this.checkPermission = this.checkPermission.bind(this);
        this.onTabClick = this.onTabClick.bind(this);
    }

    checkPermission(permission) {
        return permission.indexOf('!') === 0
            ? !this.context.checkPermission(permission.substr(1))
            : this.context.checkPermission(permission);
    }

    onTabClick(e) {
        const { disabled } = this.props;
        if (disabled) {
            e.preventDefault();
            e.stopPropagation();

            return false;
        }

        const { onClick } = this.props;
        onClick && onClick(e);
    }

    render() {
        const { tab, disabled, className } = this.props;

        if (!tab.routeName) {
            return (
                <span
                    style={this.props.style}
                    className={!disabled ? classNames(className, styles.navigationTab) : classNames(styles.navigationTab, styles.navigationTabDisabled)}
                    onClick={this.onTabClick}
                    {...{activeClassName: styles.navigationTabActive}}
                >
                    <Text>{tab.title}</Text>
                </span>
            );
        }

        return (
            <Link
                style={this.props.style}
                to={tab.routeName}
                className={!disabled ? classNames(className, styles.navigationTab) : classNames(styles.navigationTab, styles.navigationTabDisabled)}
                activeClassName={styles.navigationTabActive}
                params={tab.routeParams}
                onClick={this.onTabClick}
            >
                <Text>{tab.title}</Text>
            </Link>
        );
    }
}

Tab.deafultProps = {
    disabled: false,
    onClick: () => {}
};

Tab.propTypes = {
    tab: PropTypes.object,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    style: PropTypes.object
};

Tab.contextTypes = {
    checkPermission: PropTypes.func
};
