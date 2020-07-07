import React from 'react';
import classnames from 'classnames';
import Popover from '@material-ui/core/Popover';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import SvgDropdownIcon from '@material-ui/icons/ArrowDropDown';
import Box from '@material-ui/core/Box';
import style from './style.css';

import Dropdown from './Dropdown';
import Checkbox from './Checkbox';

class MultiSelectDropdown extends Dropdown {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    static defaultProps = {
        isValid: true,
        errorMessage: '',
        defaultSelected: []
    }

    handleChange(menuItem) {
        const { onSelect, keyProp, defaultSelected } = this.props;
        const itemIndex = defaultSelected.findIndex((value) => {
            return value.key === menuItem.key;
        });
        const values = defaultSelected.slice();
        if (itemIndex > -1) {
            values.splice(itemIndex, 1);
        } else {
            values.push(menuItem);
        }

        onSelect({key: keyProp, value: values});
    }

    handleClick() {
        const { onSelect, keyProp, data, defaultSelected } = this.props;

        let values = [];
        if (defaultSelected.length !== data.length) {
            values = data;
        }
        onSelect({key: keyProp, value: values});
    }

    getMenuItems() {
        const {data, placeholder, cssStyle, mergeStyles, defaultSelected} = this.props;
        const ddstyles = mergeStyles ? Object.assign({}, style, mergeStyles) : cssStyle || style;

        let menuItems = [
            <MenuItem
                disabled
                className={ddstyles.multiSelectDropdownMenuItemWrap}
                key='ddhdr'
            >
                <div className={ddstyles.multiSelectDropdownMenuItem}>
                    <span>{placeholder}</span>
                </div>
            </MenuItem>
        ];

        if (data.length) {
            menuItems = [
                <MenuItem
                    className={ddstyles.multiSelectDropdownMenuItemWrap}
                    onClick={this.handleClick}
                    key='1-ddfg'
                >
                    <div className={ddstyles.multiSelectDropdownMenuItem}>
                        <Checkbox
                            checked={defaultSelected.length === data.length}
                        />
                        <span>{placeholder}</span>
                    </div>
                </MenuItem>,
                <Divider
                    key='2-ddfg'
                />
            ];
            data.forEach((item) => {
                const isChecked = (data.length === defaultSelected.length || defaultSelected.findIndex(d => d.key === item.key) > -1);
                menuItems.push(
                    <MenuItem
                        className={ddstyles.multiSelectDropdownMenuItemWrap}
                        onClick={() => { this.handleChange(item); }}
                        key={item.key}
                    >
                        <div className={ddstyles.multiSelectDropdownMenuItem}>
                            <Checkbox
                                checked={isChecked}
                                disabled={item.disabled}
                            />
                            <span>{item.name}</span>
                        </div>
                    </MenuItem>
                );
            });
        }

        return menuItems;
    }

    renderDropDown() {
        const { cssStyle, mergeStyles, defaultSelected, isValid } = this.props;
        const ddstyles = mergeStyles ? Object.assign({}, style, mergeStyles) : cssStyle || style;
        const arrowIconDisabled = this.props.disabled ? ddstyles.arrowIconDisabled : '';
        const errorDropDownStyle = !isValid ? ddstyles.error : '';
        const iconBackground = this.props.disabled ? ddstyles.dropdownIconBackgroundDisabled : ddstyles.dropdownIconBackground;
        const rootElementWidth = this.state.anchorEl && this.state.anchorEl.offsetWidth;
        const inputDisabled = this.props.disabled ? ddstyles.readonlyInput : '';
        // 30 px for dropdown icon
        const labelMaxWidth = rootElementWidth && rootElementWidth - 30;

        const selectedItems = defaultSelected.map((value) => (value.name)).join(', ');

        return (
            <>
                <div className={classnames(ddstyles.pointer, ddstyles.dropdownWrap, errorDropDownStyle, inputDisabled)} onClick={!this.props.disabled ? this.handleOpen : undefined}>
                    <div className={classnames(iconBackground, ddstyles.dropDownRoot)}>
                        <div className={ddstyles.multiSelectDropdownPlaceholder}>
                            <div style={{maxWidth: labelMaxWidth}}>
                                {selectedItems || this.props.placeholder}
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
                        <MenuList className={ddstyles.multiSelectDropdownMenu}>
                            {this.state.open && this.getMenuItems()}
                        </MenuList>
                    </Box>
                </Popover>
            </>
        );
    }
}

export default MultiSelectDropdown;
