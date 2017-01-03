import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Link from './../Link';
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

            return false;
        }

        const { onClick } = this.props;
        onClick && onClick(e);
    }

    render() {
        const { tab, disabled } = this.props;

        return (
            <Link
              style={this.props.style}
              to={tab.routeName}
              className={!disabled ? styles.navigationTab : classNames(styles.navigationTab, styles.navigationTabDisabled)}
              activeClassName={styles.navigationTabActive}
              params={tab.routeParams}
              onClick={this.onTabClick}>
                {tab.title}
              </Link>
        );
    }
};

Tab.deafultProps = {
    disabled: false,
    onClick: () => {}
};

Tab.propTypes = {
    tab: PropTypes.object,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    style: PropTypes.object
};

Tab.contextTypes = {
    checkPermission: PropTypes.func
};
