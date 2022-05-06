import PropTypes from 'prop-types';
import React from 'react';
import Text from '../Text';
import { Link } from 'react-router-dom';
import { matchPath, withRouter } from 'react-router';
import style from './style.css';
import classnames from 'classnames';
class TabLink extends React.Component {
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
        const {pathname, onClick, location, search} = this.props;
        let activeClassName = '';
        if (matchPath(location.pathname, {path: pathname, exact: true})) {
            activeClassName = this.getStyle('tabMenuWrapSelected');
        }
        const onClickHandler = () => {
            onClick(this.props);
        };
        return (
            <li className={this.getStyle('tabMenuItem')}>
                {pathname !== ''
                    ? <Link className={classnames(this.getStyle('tabMenuWrap'), activeClassName)} to={{pathname, search}}>
                        {this.renderMainContent()}
                    </Link>
                    : <div className={classnames(this.getStyle('tabMenuWrap'), activeClassName)} onClick={onClickHandler}>
                        {this.renderMainContent()}
                    </div>}
            </li>
        );
    }
}

TabLink.propTypes = {
    location: PropTypes.object.isRequired,
    pathname: PropTypes.string, // If pathname is not given onClick func will be called
    search: PropTypes.string,
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
    implementationStyle: PropTypes.object
};

export default withRouter(TabLink);
