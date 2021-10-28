import PropTypes from 'prop-types';
import React from 'react';
import style from './style.css';
// import classnames from 'classnames';
import { NavLink } from 'react-router-dom';
import { matchPath, withRouter } from 'react-router';
import enhanceWithClickOutside from 'react-click-outside';

import checkImage from './images/check.png';

class TabDropDown extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false
        };
        this.toggleOpen = this.toggleOpen.bind(this);
    }

    handleClickOutside(event) {
        this.setState({
            open: false
        });
    }

    toggleOpen() {
        this.setState({
            open: !this.state.open
        });
    }

    render() {
        const list = this.props.data.map((tab, i) => {
            let activeClassName;
            const isLinkActive = tab && tab.pathname && matchPath(this.props.location.pathname, {path: tab.pathname, exact: true});
            const handleClick = () => {
                this.setState({
                    open: false
                });
                this.props.onSelectItem(tab);
            };
            if (tab && tab.pathname) {
                if (isLinkActive) {
                    activeClassName = style.selected;
                }
            }
            return (
                <li className={style.tabDdListItem} key={i}>
                    <NavLink
                        activeClassName={activeClassName}
                        className={style.tabDdLink}
                        to={(tab && tab.pathname) ? tab.pathname : '#/'}
                        title={tab.title && tab.title.props && tab.title.props.children}
                        onClick={handleClick}
                    >{isLinkActive && <img src={checkImage} className={style.img} />}{tab.title}</NavLink>
                </li>
            );
        });
        const opened = this.state.open ? 'block' : 'none';
        return (
            <div style={{height: '100%'}}>
                <div className={style.tabDdBtn} onClick={this.toggleOpen} />
                <ul className={style.tabDdList} style={{display: opened}}>
                    {list}
                </ul>
            </div>
        );
    }
}

TabDropDown.propTypes = {
    data: PropTypes.array,
    onSelectItem: PropTypes.func,
    activeItem: PropTypes.number,
    location: PropTypes.object.isRequired
};

TabDropDown.defaultProps = {
    data: [],
    onSelectItem: () => {}
};

export default withRouter(enhanceWithClickOutside(TabDropDown));
