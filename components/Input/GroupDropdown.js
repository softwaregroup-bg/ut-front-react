import React from 'react';
import classnames from 'classnames';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import style from './style.css';

import Dropdown from './Dropdown';

class GroupDropdown extends Dropdown {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            value: props.defaultSelected || '__placeholder__',
            valid: { isValid: this.props.isValid, errorMessage: this.props.errorMessage }
        };
        this.toggleOpen = this.toggleOpen.bind(this);
        this.toggleClose = this.toggleClose.bind(this);
    }

    toggleOpen(event) {
        return this.setState({ open: true, anchorEl: event.currentTarget });
    }

    toggleClose() {
        return this.setState({ open: false });
    }

    handleChange(item) {
        let { onSelect, keyProp } = this.props;
        let objectToPassOnChange = { key: keyProp, value: item.key, initValue: this.state.value };

        this.setState({ value: item.key, valid: { isValid: true, errorMessage: '' } });
        onSelect(objectToPassOnChange);
        this.toggleClose();
    }

    get dropdownPlaceholder() {
        const { defaultSelected, data, placeholder } = this.props;
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
        return Object.keys(groups).map(group => {
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
                        groups[group].map((item, i) => (
                            <MenuItem
                                key={item.key + '-' + i}
                                className={style.groupDropdownMenuItem}
                                disabled={item.disabled}
                                value={item.key}
                                onTouchTap={() => { this.handleChange(item); }}
                                primaryText={item.name}
                            />
                        ))
                    }
                </div>
            );
        });
    }

    renderDropDown() {
        let menuItems = this.getMenuItems();
        let { cssStyle, mergeStyles } = this.props;
        let ddstyles = mergeStyles ? Object.assign({}, style, mergeStyles) : cssStyle || style;
        let arrowIconDisabled = this.props.disabled ? ddstyles.arrowIconDisabled : '';
        let errorDropDownStyle = !this.state.valid.isValid ? ddstyles.error : '';
        let editedInputStyle = this.props.isEdited ? ddstyles.editedInputStyle : '';
        let cursorStyle = this.props.disabled ? ddstyles.notAllowed : ddstyles.pointer;
        let iconBackground = this.props.disabled ? ddstyles.dropdownIconBackgroundDisabled : ddstyles.dropdownIconBackground;
        let rootElementWidth = this.state.anchorEl && this.state.anchorEl.offsetWidth;
        // 30 px for dropdown icon
        let labelMaxWidth = rootElementWidth && rootElementWidth - 30;

        return (
            <div className={classnames(ddstyles.dropdownWrap, errorDropDownStyle, editedInputStyle, cursorStyle)} onClick={!this.props.disabled && this.toggleOpen}>
                <div className={classnames(iconBackground, ddstyles.dropDownRoot)}>
                    <div className={ddstyles.groupDropdownPlaceholder}>
                        <div style={{ maxWidth: labelMaxWidth }}>
                            {this.dropdownPlaceholder}
                        </div>
                    </div>
                    <svg className={classnames(arrowIconDisabled, ddstyles.arrowIcon, ddstyles.dropdownIconWrap)} />
                    <div className={ddstyles.hideTextWrap} />
                </div>
                <Popover
                    open={this.state.open}
                    onRequestClose={this.toggleClose}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                    targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                    animation={PopoverAnimationVertical}
                >
                    <Menu
                        autoWidth={false}
                        disableAutoFocus
                        value={this.state.value}
                        maxHeight={300}
                        style={{ width: rootElementWidth }}
                        className={ddstyles.groupDropdownMenu}>
                        {menuItems}
                    </Menu>
                </Popover>
            </div>
        );
    }
}

export default GroupDropdown;
