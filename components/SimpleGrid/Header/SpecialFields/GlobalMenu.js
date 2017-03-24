import React, { Component, PropTypes } from 'react';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Checkbox from '../../../Input/Checkbox';
import style from './GlobalMenu.css';

import { closest } from '../../../../utils/dom';

const menuFieldControl = 'menuFieldControl';

export default class GlobalMenu extends Component {
    constructor(props) {
        super(props);
        this.handleMenuOpen = this.handleMenuOpen.bind(this);
        this.handleMenuClose = this.handleMenuClose.bind(this);
        this.toggleColumnVisibility = this.toggleColumnVisibility.bind(this);
        this.state = {menuOpened: false};
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.fields.filter(f => (f.visible)).length > this.props.fields.filter(f => (f.visible)).length) {
            // prevents horizontal scroll /if any/ movement when adding visible columns
            let fieldControlEl = document.getElementById(menuFieldControl);
            let tableWrap = closest(fieldControlEl, 'table').parentNode.parentNode;
            tableWrap.scrollLeft = tableWrap.scrollWidth - tableWrap.clientWidth;

            // update thyself
            this.setState({});
        }
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
            if (this.props.fields.filter(f => (f.visible)).length > 1 || !field.visible) {
                this.props.toggleColumnVisibility(field);
            }

            return false;
        };
    }
    getItems() {
        return this.props
            .fields
            .filter((f) => (!f.internal))
            .map((f, idx) => (
                <MenuItem
                  key={idx}
                  onTouchTap={this.toggleColumnVisibility(f)}
                  children={
                      <div className={this.getStyle('headerGlobalMenuFieldControlContainer')}>
                        <Checkbox isDisabled={false} checked={f.visible} />
                        {this.props.transformCellValue(f.title || '', f.name, undefined, true)}
                      </div>
                  } />
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
              className={this.getStyle('headerGlobalMenuPopoverWrap')}>
                <Menu
                  className={this.getStyle('headerGlobalMenuItemWrap')}
                  disableAutoFocus>
                    { this.getItems() }
                </Menu>
            </Popover>
        );
    }
    render() {
        return (<th id={menuFieldControl} className={style.headerGlobalMenuField}>
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
