import React, { Component, PropTypes } from 'react';
import Menu from 'material-ui/Menu';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import MenuItem from 'material-ui/MenuItem';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Checkbox from '../../../Input/Checkbox';
import style from './MenuColumn.css';

export default class MenuColumn extends Component {
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
    getMenuColumnItems() {
        return this.props
            .fields
            .filter((f) => (!f.internal))
            .map((f) => (
                <MenuItem
                  children={
                      <div onTouchTap={this.toggleColumnVisibility(f)} className={this.getStyle('headerGlobalMenuFieldControlContainer')}>
                        <div className={this.getStyle('headerGlobalMenuFieldControlCheckbox')}><Checkbox isDisabled={false} checked={f.visible} /></div>
                        <span className={this.getStyle('headerGlobalMenuFieldControlTitle')}>{f.title}</span>
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
                      menuItems={this.getMenuColumnItems()}
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

MenuColumn.propTypes = {
    fields: PropTypes.array,
    handleCheckboxSelect: PropTypes.func,
    externalStyle: PropTypes.object,
    isChecked: PropTypes.bool,
    toggleColumnVisibility: PropTypes.func
};

MenuColumn.defaultProps = {
    externalStyle: {},
    handleCheckboxSelect: (currentValue) => {},
    toggleColumnVisibility: (field) => ({})
};

MenuColumn.contextTypes = {
    implementationStyle: PropTypes.object
};
