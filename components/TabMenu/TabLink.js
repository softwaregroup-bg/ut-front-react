import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import style from './style.css';
import classnames from 'classnames';

export default class TabLink extends React.Component {
    renderMainContent() {
        let {title, canClose, onClose} = this.props;

        return (
            <div className={this.getStyle('tabMenuItemContent')}>
                {title}
                {canClose && <div className={this.getStyle('xicon')} onClick={onClose} />}
            </div>
        );
    }

    getStyle(name) {
        return (this.context.implementationStyle && this.context.implementationStyle[name]) || style[name];
    }

    render() {
        let {pathname, isActive, onClick} = this.props;
        let activeClassName = '';
        if (this.context.router.isActive(pathname, true) || isActive) {
            activeClassName = this.getStyle('tabMenuWrapSelected');
        }
        let onClickHandler = () => {
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
    title: PropTypes.string.isRequired,
    isActive: PropTypes.bool,
    canClose: PropTypes.bool,
    onClose: PropTypes.func,
    onClick: PropTypes.func
};

TabLink.defaultProps = {
    pathname: '',
    canClose: false,
    isActive: false,
    onClose: () => {},
    onClick: () => {}
};

TabLink.contextTypes = {
    router: PropTypes.object.isRequired,
    implementationStyle: PropTypes.object
};
