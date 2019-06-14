import React from 'react';
import classnames from 'classnames';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import SvgDropdownIcon from 'material-ui/svg-icons/navigation/arrow-drop-down';
import style from './style.css';

import Dropdown from './Dropdown';

class GroupDropdown extends Dropdown {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            value: props.defaultSelected || '__placeholder__',
            valid: {isValid: this.props.isValid, errorMessage: this.props.errorMessage}
        };
        this.toggleOpen = this.toggleOpen.bind(this);
        this.toggleClose = this.toggleClose.bind(this);
    }

    toggleOpen(event) {
        return this.setState({open: true, anchorEl: event.currentTarget});
    }

    toggleClose() {
        return this.setState({open: false});
    }

    handleChange(item) {
        let { onSelect, keyProp } = this.props;
        let objectToPassOnChange = {key: keyProp, value: item.key, initValue: this.state.value};

        this.setState({value: item.key, valid: {isValid: true, errorMessage: ''}});
        onSelect(objectToPassOnChange);
        this.toggleClose();
    }

    get dropdownPlaceholder() {
        const {defaultSelected, data, placeholder} = this.props;
        const selected = data.find(item => item.key === defaultSelected);
        return (selected && selected.name) || placeholder;
    }

    getMenuItems() {
        let { data } = this.props;
        const groups = data.reduce((acc, curr) => {
            let group = acc[curr.group] = acc[curr.group] || [];
            group.push({
                key: curr.key,
                name: curr.name
            });
            return acc;
        }, {});
        const menuItems = Object.keys(groups).map(group => {
            return (
                <div key={group}>
                    {/* the material ui api allows manipulation of  */}
                    <MenuItem
                        key={group}
                        className={style.groupDropdownMenuItem}
                        disabled
                        primaryText={group} />
                    <Divider />
                    {
                        groups[group].map((item, i) => {
                            let isSelected = this.state.value === item.key;
                            let className = isSelected
                                ? classnames(style.groupDropdownMenuItem, style.groupDropdownMenuSelectedItem)
                                : style.groupDropdownMenuItem;
                            return (
                                <MenuItem
                                    key={item.key + '-' + i}
                                    className={className}
                                    disabled={item.disabled}
                                    value={item.key}
                                    onTouchTap={() => { this.handleChange(item); }}
                                    primaryText={item.name} />
                            );
                        })
                    }
                </div>
            );
        });
        menuItems.unshift(
            <MenuItem
                disabled={false}
                className={style.groupDropdownMenuItem}
                key={Math.random() + '-ddfg'}
                value={this.props.placeholderValue}
                onTouchTap={() => { this.handleChange({ key: '__placeholder__' }); }}
                primaryText={this.props.placeholder} />
        );
        return menuItems;
    }

    renderDropDown() {
        let menuItems = this.getMenuItems();
        let { cssStyle, mergeStyles } = this.props;
        let ddstyles = mergeStyles ? Object.assign({}, style, mergeStyles) : cssStyle || style;
        let arrowIconDisabled = this.props.disabled ? ddstyles.arrowIconDisabled : '';
        let errorDropDownStyle = !this.state.valid.isValid ? ddstyles.error : '';
        let cursorStyle = this.props.disabled ? ddstyles.notAllowed : ddstyles.pointer;
        let iconBackground = this.props.disabled ? ddstyles.dropdownIconBackgroundDisabled : ddstyles.dropdownIconBackground;
        let rootElementWidth = this.state.anchorEl && this.state.anchorEl.offsetWidth;
        // 30 px for dropdown icon
        let labelMaxWidth = rootElementWidth && rootElementWidth - 30;

        return (
            <div className={classnames(ddstyles.dropdownWrap, errorDropDownStyle, cursorStyle)} onClick={!this.props.disabled && this.toggleOpen}>
                <div className={classnames(iconBackground, ddstyles.dropDownRoot)}>
                    <div className={ddstyles.groupDropdownPlaceholder}>
                        <div style={{maxWidth: labelMaxWidth}}>
                            {this.dropdownPlaceholder}
                        </div>
                    </div>
                    <div className={classnames(ddstyles.dropdownIconWrap, arrowIconDisabled)}>
                        <SvgDropdownIcon color='#fff' style={{width: '26px', height: '26px'}} />
                    </div>
                    <div className={ddstyles.hideTextWrap} />
                </div>
                <Popover
                    open={this.state.open}
                    onRequestClose={this.toggleClose}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    animation={PopoverAnimationVertical} >
                    <Menu
                        autoWidth={false}
                        disableAutoFocus
                        value={this.state.value}
                        maxHeight={300}
                        style={{width: rootElementWidth}}
                        className={ddstyles.groupDropdownMenu}>
                        {menuItems}
                    </Menu>
                </Popover>
            </div>
        );
    }
}

export default GroupDropdown;
