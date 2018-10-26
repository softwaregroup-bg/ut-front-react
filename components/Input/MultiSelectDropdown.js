import React from 'react';
import classnames from 'classnames';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import style from './style.css';

import Dropdown from './Dropdown';
import Checkbox from './Checkbox';

class MultiSelectDropdown extends Dropdown {
    constructor(props) {
        super(props);

        this.toggleAllChecks = this.toggleAllChecks.bind(this);
    }

    handleChange(menuItem) {
        let { onSelect, keyProp, defaultSelected } = this.props;
        let itemIndex = defaultSelected.findIndex((value) => {
            return value.key === menuItem.key;
        });
        let values = defaultSelected.slice();
        if (itemIndex > -1) {
            values.splice(itemIndex, 1);
        } else {
            values.push(menuItem);
        }

        onSelect({key: keyProp, value: values});
    }

    toggleAllChecks() {
        let { onSelect, keyProp, data, defaultSelected } = this.props;

        let values = [];
        if (defaultSelected.length !== data.length) {
            values = data;
        }
        onSelect({key: keyProp, value: values});
    }

    getMenuItems() {
        let {data, placeholder, cssStyle, mergeStyles, defaultSelected} = this.props;
        let ddstyles = mergeStyles ? Object.assign({}, style, mergeStyles) : cssStyle || style;

        let menuItems = [
            <MenuItem
                disabled
                className={ddstyles.multiSelectDropdownMenuItemWrap}
                key={'ddhdr'}>
                <div className={ddstyles.multiSelectDropdownMenuItem}>
                    <span>{placeholder}</span>
                </div>
            </MenuItem>
        ];

        if (data.length) {
            menuItems = [
                <MenuItem
                    className={ddstyles.multiSelectDropdownMenuItemWrap}
                    onTouchTap={this.toggleAllChecks}
                    key={'1-ddfg'}>
                    <div className={ddstyles.multiSelectDropdownMenuItem}>
                        <Checkbox
                            checked={defaultSelected.length === data.length} />
                        <span>{placeholder}</span>
                    </div>
                </MenuItem>,
                <Divider
                    key={'2-ddfg'} />
            ];
            data.forEach((item) => {
                let isChecked = (data.length === defaultSelected.length || defaultSelected.findIndex(d => d.key === item.key) > -1);
                menuItems.push(
                    <MenuItem
                        className={ddstyles.multiSelectDropdownMenuItemWrap}
                        onTouchTap={() => { this.handleChange(item); }}
                        key={item.key}>
                        <div className={ddstyles.multiSelectDropdownMenuItem}>
                            <Checkbox
                                checked={isChecked}
                                disabled={item.disabled} />
                            <span>{item.name}</span>
                        </div>
                    </MenuItem>
                );
            });
        }

        return menuItems;
    }

    renderDropDown() {
        let { cssStyle, mergeStyles, defaultSelected, isValid } = this.props;
        let ddstyles = mergeStyles ? Object.assign({}, style, mergeStyles) : cssStyle || style;
        let arrowIconDisabled = this.props.disabled ? ddstyles.arrowIconDisabled : '';
        let errorDropDownStyle = !isValid ? ddstyles.error : '';
        let iconBackground = this.props.disabled ? ddstyles.dropdownIconBackgroundDisabled : ddstyles.dropdownIconBackground;
        let rootElementWidth = this.state.anchorEl && this.state.anchorEl.offsetWidth;
        let inputDisabled = this.props.disabled ? ddstyles.readonlyInput : '';
        // 30 px for dropdown icon
        let labelMaxWidth = rootElementWidth && rootElementWidth - 30;

        let selectedItems = defaultSelected.map((value) => (value.name)).join(', ');

        return (
            <div className={classnames(ddstyles.pointer, ddstyles.dropdownWrap, errorDropDownStyle, inputDisabled)} onClick={!this.props.disabled && this.toggleOpen}>
                <div className={classnames(iconBackground, ddstyles.dropDownRoot)}>
                    <div className={ddstyles.multiSelectDropdownPlaceholder}>
                        <div style={{maxWidth: labelMaxWidth}}>
                            {selectedItems || this.props.placeholder}
                        </div>
                    </div>
                    <svg className={classnames(arrowIconDisabled, ddstyles.arrowIcon, ddstyles.dropdownIconWrap)} />
                    <div className={ddstyles.hideTextWrap} />
                </div>

                <Popover
                    open={this.state.open}
                    onRequestClose={this.toggleClose}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    animation={PopoverAnimationVertical}>
                    <Menu
                        autoWidth={false}
                        disableAutoFocus
                        maxHeight={300}
                        style={{width: rootElementWidth}}
                        className={ddstyles.multiSelectDropdownMenu}>
                        {this.state.open && this.getMenuItems()}
                    </Menu>
                </Popover>
            </div>
        );
    }
}

MultiSelectDropdown.defaultProps = {
    isValid: true,
    errorMessage: '',
    defaultSelected: []
};

export default MultiSelectDropdown;
