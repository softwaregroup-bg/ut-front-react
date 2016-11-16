import React, { PropTypes } from 'react';
import style from './style.css';
// import classnames from 'classnames';
import { Link } from 'react-router';
import enhanceWithClickOutside from 'react-click-outside';

class TabDropDown extends React.Component {
    constructor(props) {
        super(props);
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
        let list = this.props.data.map((tab, i) => {
            let activeClassName;
            let handleClick = () => {
                this.setState({
                    open: false
                });
                this.props.onSelectItem(tab);
            };
            if (tab && tab.pathname) {
                if (this.context.router.isActive(tab.pathname, true)) {
                    activeClassName = style.selected;
                }
            }
            return (
                <li className={style.tabDdListItem} key={i}>
                    <Link
                      activeClassName={activeClassName}
                      className={style.tabDdLink}
                      to={(tab && tab.pathname) ? tab.pathname : '#/'}
                      title={tab.title}
                      onClick={handleClick}
                    >{tab.title}</Link>
                </li>
            );
        });
        let opened = this.state.open ? 'block' : 'none';
        return (
            <div style={{height: '100%'}}>
                <div className={style.tabDdBtn} onClick={this.toggleOpen}>{''}</div>
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
    activeItem: PropTypes.number
};

TabDropDown.defaultProps = {
    data: [],
    onSelectItem: () => {}
};

TabDropDown.contextTypes = {
    router: PropTypes.object.isRequired
};

export default enhanceWithClickOutside(TabDropDown);
