import React, { Component, PropTypes } from 'react';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'ut-front-react/components/Input/Checkbox';
import classnames from 'classnames';
import style from './style.css';

const menuFieldControl = 'menuFieldControlAD';

class GridMenu extends Component {
    constructor(props) {
        super(props);
        this.onRefresh = this.onRefresh.bind(this);
        this.onToggleColumn = this.onToggleColumn.bind(this);
        this.state = {menuOpened: false};
        this.handleMenuOpen = this.handleMenuOpen.bind(this);
        this.handleMenuClose = this.handleMenuClose.bind(this);
    }
    onToggleColumn(field) {
        let {onToggleColumn} = this.props;
        field.visible = field.visible === false ? !1 : !0;
        onToggleColumn && onToggleColumn(field);
    }
    onRefresh() {
        let {onRefresh} = this.props;
        onRefresh && onRefresh();
    }
    handleMenuOpen(event) {
        event.preventDefault();
        var target = event.currentTarget && event.currentTarget.parentElement;
        this.setState({
            menuOpened: true,
            anchorEl: target
        });
    }
    handleMenuClose() {
        this.setState({
            menuOpened: false
        });
    }
    getStyle(name) {
        return style[name];
    }
    getMenu() {
        return (
            <Popover
              open={this.state.menuOpened}
              anchorEl={this.state.anchorEl}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              onRequestClose={this.handleMenuClose}
              animation={PopoverAnimationVertical}
              className={this.getStyle('headerGlobalMenuPopoverWrap')}>
                <Menu className={this.getStyle('headerGlobalMenuItemWrap')} >
                    {this.props.onRefresh && (<div className={style.refreshContainer}>
                        <MenuItem onTouchTap={this.props.onRefresh} style={{minHeight: 'auto'}}
                          children={
                            <div className={classnames(this.getStyle('headerGlobalMenuFieldControlContainer'), style.reloadContainer, style.menuItem)}>
                                <div className={style.refreshIcon} />
                                <div className={style.refreshLabel}> Reload Grid </div>
                            </div>}
                            />
                    </ div>)}
                    <div className={style.columnWrap}>
                        <label className={style.menuLabel}> Manage Columns </label>
                        { this.getItems() }
                    </div>
                </Menu>
            </Popover>
        );
    }
    getItems() {
        return this.props
            .columns
            .map((f, idx) => (
                <div className={style.menuItem}>
                  <MenuItem
                    key={idx}
                    onTouchTap={(event) => {
                        event.stopPropagation();
                        this.onToggleColumn(f);
                    }}
                    children={
                        <div className={this.getStyle('headerGlobalMenuFieldControlContainer')}>
                            <Checkbox isDisabled={false} checked={f.visible !== false} />
                                {f.name}
                        </div>
                    } />
                </div>
            ));
    }
    render() {
        return (
        <th id={menuFieldControl} key={'settingsMenu'} className={classnames(style.headerGlobalMenuField, style.settings)}>
            <div onTouchTap={this.handleMenuOpen} className={this.getStyle('headerGlobalMenuFieldControl')}><SettingsIcon /></div>
            {this.getMenu()}
        </th>);
    }
};

GridMenu.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        visible: PropTypes.bool
    })).isRequired,
    onToggleColumn: PropTypes.func,
    onRefresh: PropTypes.func
};

export default GridMenu;
