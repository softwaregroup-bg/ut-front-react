import PropTypes from 'prop-types';
import React from 'react';
import style from './style.css';
// import classnames from 'classnames';
import { NavLink } from 'react-router-dom';
import { matchPath, withRouter } from 'react-router';

import checkImage from './images/check.png';

class TabDropDown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
        this.toggleOpen = this.toggleOpen.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({
                open: false
            });
        }
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
            <div style={{height: '100%'}} ref={this.setWrapperRef}>
                <div className={style.tabDdBtn} onClick={this.toggleOpen} />
                <ul className={style.tabDdList} style={{display: opened}}>
                    {list}
                </ul>
            </div>
        );
    }
}

TabDropDown.propTypes = {
    location: PropTypes.object.isRequired,
    data: PropTypes.array,
    onSelectItem: PropTypes.func,
    activeItem: PropTypes.number
};

TabDropDown.defaultProps = {
    data: [],
    onSelectItem: () => {}
};

export default withRouter(TabDropDown);
