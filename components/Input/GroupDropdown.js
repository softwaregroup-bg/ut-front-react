import React from 'react';
import classnames from 'classnames';
import Popover from '@material-ui/core/Popover';
import MenuList from '@material-ui/core/MenuList';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import SvgDropdownIcon from '@material-ui/icons/ArrowDropDown';
import Box from '@material-ui/core/Box';
import style from './style.css';

import {Dropdown} from './Dropdown';

class GroupDropdown extends Dropdown {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            value: props.defaultSelected || '__placeholder__',
            valid: {isValid: this.props.isValid, errorMessage: this.props.errorMessage}
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleOpen(event) {
        return this.setState({open: true, anchorEl: event.currentTarget});
    }

    handleClose() {
        return this.setState({open: false});
    }

    handleChange(item) {
        const { onSelect, keyProp } = this.props;
        const objectToPassOnChange = {key: keyProp, value: item.key, initValue: this.state.value};

        this.setState({value: item.key, valid: {isValid: true, errorMessage: ''}});
        onSelect(objectToPassOnChange);
        this.handleClose();
    }

    get dropdownPlaceholder() {
        const {defaultSelected, data, placeholder} = this.props;
        const selected = data.find(item => item.key === defaultSelected);
        return (selected && selected.name) || placeholder;
    }

    getMenuItems() {
        const { data } = this.props;
        const groups = data.reduce((acc, curr) => {
            const group = acc[curr.group] = acc[curr.group] || [];
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
                        primaryText={group}
                    />
                    <Divider />
                    {
                        groups[group].map((item, i) => {
                            const isSelected = this.state.value === item.key;
                            const className = isSelected
                                ? classnames(style.groupDropdownMenuItem, style.groupDropdownMenuSelectedItem)
                                : style.groupDropdownMenuItem;
                            return (
                                <MenuItem
                                    key={item.key + '-' + i}
                                    className={className}
                                    disabled={item.disabled}
                                    value={item.key}
                                    onClick={() => { this.handleChange(item); }}
                                    primaryText={item.name}
                                />
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
                onClick={() => { this.handleChange({ key: '__placeholder__' }); }}
                primaryText={this.props.placeholder}
            />
        );
        return menuItems;
    }

    renderDropDown() {
        const menuItems = this.getMenuItems();
        const { cssStyle, mergeStyles } = this.props;
        const ddstyles = mergeStyles ? Object.assign({}, style, mergeStyles) : cssStyle || style;
        const arrowIconDisabled = this.props.disabled ? ddstyles.arrowIconDisabled : '';
        const errorDropDownStyle = !this.state.valid.isValid ? ddstyles.error : '';
        const cursorStyle = this.props.disabled ? ddstyles.notAllowed : ddstyles.pointer;
        const iconBackground = this.props.disabled ? ddstyles.dropdownIconBackgroundDisabled : ddstyles.dropdownIconBackground;
        const rootElementWidth = this.state.anchorEl && this.state.anchorEl.offsetWidth;
        // 30 px for dropdown icon
        const labelMaxWidth = rootElementWidth && rootElementWidth - 30;

        return (
            <>
                <div className={classnames(ddstyles.dropdownWrap, errorDropDownStyle, cursorStyle)} onClick={!this.props.disabled ? this.handleOpen : undefined}>
                    <div className={classnames(iconBackground, ddstyles.dropDownRoot)}>
                        <div className={ddstyles.groupDropdownPlaceholder}>
                            <div style={{maxWidth: labelMaxWidth}}>
                                {this.dropdownPlaceholder}
                            </div>
                        </div>
                        <div className={classnames(ddstyles.dropdownIconWrap, arrowIconDisabled)}>
                            <SvgDropdownIcon htmlColor='white' style={{width: '100%', height: '100%'}} />
                        </div>
                        <div className={ddstyles.hideTextWrap} />
                    </div>
                </div>
                <Popover
                    open={this.state.open}
                    onClose={this.handleClose}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                    transformOrigin={{horizontal: 'left', vertical: 'top'}}
                >
                    <Box maxHeight={300} width={rootElementWidth}>
                        <MenuList value={this.state.value} className={ddstyles.groupDropdownMenu}>
                            {menuItems}
                        </MenuList>
                    </Box>
                </Popover>
            </>
        );
    }
}

export default GroupDropdown;
