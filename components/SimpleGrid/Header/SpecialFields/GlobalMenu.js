import React, { Component, PropTypes } from 'react';
import Menu from 'material-ui/Menu';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import MenuItem from 'material-ui/MenuItem';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Checkbox from '../../../Input/Checkbox';
import style from './GlobalMenu.css';

export default class GlobalMenu extends Component {
    constructor(props) {
        super(props);
        this.handleMenuOpen = this.handleMenuOpen.bind(this);
        this.handleMenuClose = this.handleMenuClose.bind(this);
        this.toggleColumnVisibility = this.toggleColumnVisibility.bind(this);
        this.state = {menuOpened: false};
    }
    getStyle(name) {
        return this.props.externalStyle[name] || this.context.implementationStyle[name] || style[name];
    }
    handleMenuOpen(event) {
        event.preventDefault();

        this.setState({
            menuOpened: true,
            anchorEl: event.currentTarget
        });
    }
    handleMenuClose() {
        this.setState({
            menuOpened: false
        });
    }
    toggleColumnVisibility(field) {
        return () => {
            this.handleMenuClose();
            this.props.toggleColumnVisibility(field);
        };
    }
    getItems() {
        return this.props
            .fields
            .filter((f) => (!f.internal))
            .map((f) => (
                <MenuItem
                  children={
                      <div onTouchTap={this.toggleColumnVisibility(f)} className={this.getStyle('headerGlobalMenuFieldControlContainer')}>
                        <div className={this.getStyle('headerGlobalMenuFieldControlCheckbox')}><Checkbox isDisabled={false} checked={f.visible} /></div>
                        <span className={this.getStyle('headerGlobalMenuFieldControlTitle')}>{this.props.transformCellValue(f.title || '', f.name, undefined, true)}</span>
                      </div>
                  }
                />
            ));
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
            >
                <Menu>
                    <MenuItem
                      primaryText='Columns'
                      rightIcon={<ArrowDropRight />}
                      menuItems={this.getItems()}
                    />
                </Menu>
            </Popover>
        );
    }
    render() {
        return (<th className={style.headerGlobalMenuField}>
            <div onTouchTap={this.handleMenuOpen} className={this.getStyle('headerGlobalMenuFieldControl')}><SettingsIcon /></div>
            {this.getMenu()}
        </th>);
    }
}

GlobalMenu.propTypes = {
    fields: PropTypes.array,
    handleCheckboxSelect: PropTypes.func,
    externalStyle: PropTypes.object,
    isChecked: PropTypes.bool,
    toggleColumnVisibility: PropTypes.func,
    transformCellValue: PropTypes.func
};

GlobalMenu.defaultProps = {
    externalStyle: {},
    handleCheckboxSelect: (currentValue) => {},
    toggleColumnVisibility: (field) => ({}),
    transformCellValue: (value, field, data, isHeader) => (value)
};

GlobalMenu.contextTypes = {
    implementationStyle: PropTypes.object
};
