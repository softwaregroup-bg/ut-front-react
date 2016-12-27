import React, { Component, PropTypes } from 'react';
import Link from './Link';
import style from './styles.css';

export default class Tab extends Component {
    constructor(props) {
        super(props);
        this.checkPermission = this.checkPermission.bind(this);
    }

    checkPermission(permission) {
        return permission.indexOf('!') === 0
            ? !this.context.checkPermission(permission.substr(1))
            : this.context.checkPermission(permission);
    }

    render() {
        const { tab, onClick } = this.props;

        return (
            <Link
              to={tab.routeName}
              className={style.navigationTab}
              activeClassName={style.navigationTabActive}
              params={tab.routeParams}
              onTouchTap={onClick}>
                {tab.title}
              </Link>
        );
    }
};

Tab.propTypes = {
    tab: PropTypes.object,
    onClick: PropTypes.func
};

Tab.contextTypes = {
    checkPermission: PropTypes.func
};
