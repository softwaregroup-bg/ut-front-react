import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { matchPath } from 'react-router';
import Text from '../Text';
import style from './style.css';
import classnames from 'classnames';

export default class TabLink extends React.Component {
    renderMainContent() {
        const {title, canClose, onClose} = this.props;

        return (
            <div className={this.getStyle('tabMenuItemContent')}>
                <Text>{title}</Text>
                {canClose && <div className={this.getStyle('xicon')} onClick={onClose} />}
            </div>
        );
    }

    getStyle(name) {
        return (this.context.implementationStyle && this.context.implementationStyle[name]) || style[name];
    }

    render() {
        const {pathname, onClick} = this.props;
        let activeClassName = '';
        if (matchPath(this.context.router.route.location.pathname, {path: pathname, exact: true})) {
            activeClassName = this.getStyle('tabMenuWrapSelected');
        }
        const onClickHandler = () => {
            onClick(this.props);
        };
        return (
            <li className={this.getStyle('tabMenuItem')}>
                {pathname !== ''
                    ? <Link className={classnames(this.getStyle('tabMenuWrap'), activeClassName)} to={pathname}>
                        {this.renderMainContent()}
                    </Link>
                    : <div className={classnames(this.getStyle('tabMenuWrap'), activeClassName)} onClick={onClickHandler}>
                        {this.renderMainContent()}
                    </div>
                }
            </li>
        );
    }
}

TabLink.propTypes = {
    pathname: PropTypes.string, // If pathname is not given onClick func will be called
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    canClose: PropTypes.bool,
    onClose: PropTypes.func,
    onClick: PropTypes.func
};

TabLink.defaultProps = {
    pathname: '',
    canClose: false,
    onClose: () => {},
    onClick: () => {}
};

TabLink.contextTypes = {
    router: PropTypes.object.isRequired,
    implementationStyle: PropTypes.object
};
