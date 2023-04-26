import React, { PropTypes } from 'react';
import classnames from 'classnames';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import SvgDropdownIcon from 'material-ui/svg-icons/navigation/arrow-drop-down';
import style from './style.css';

import Dropdown from './Dropdown';
import Checkbox from './Checkbox';
import Text from '../Text';

class MultiSelectDropdown extends Dropdown {
    constructor(props, context) {
        super(props, context);
        this.translate = this.translate.bind(this);
        this.toggleAllChecks = this.toggleAllChecks.bind(this);
    }

    translate(text) {
        return typeof this.context.translate === 'function' ? this.context.translate(text) : text;
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

    toggleAllChecks() {
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
                key={'ddhdr'}
            >
                <div className={ddstyles.multiSelectDropdownMenuItem}>
                    <span>{placeholder && <Text>{placeholder}</Text>}</span>
                </div>
            </MenuItem>
        ];

        if (data.length) {
            menuItems = [
                <MenuItem
                    className={ddstyles.multiSelectDropdownMenuItemWrap}
                    onTouchTap={this.toggleAllChecks}
                    key={'1-ddfg'}
                >
                    <div className={ddstyles.multiSelectDropdownMenuItem}>
                        <Checkbox
                            checked={defaultSelected.length === data.length}
                        />
                        <span>{placeholder && <Text>{placeholder}</Text>}</span>
                    </div>
                </MenuItem>,
                <Divider
                    key={'2-ddfg'}
                />
            ];
            data.forEach((item) => {
                const isChecked = (data.length === defaultSelected.length || defaultSelected.findIndex(d => d.key === item.key) > -1);
                menuItems.push(
                    <MenuItem
                        className={ddstyles.multiSelectDropdownMenuItemWrap}
                        onTouchTap={() => { this.handleChange(item); }}
                        key={item.key}
                    >
                        <div className={ddstyles.multiSelectDropdownMenuItem}>
                            <Checkbox
                                checked={isChecked}
                                disabled={item.disabled}
                            />
                            <span><Text>{item.name}</Text></span>
                        </div>
                    </MenuItem>
                );
            });
        }

        return menuItems;
    }

    renderDropDown() {
        // const { cssStyle, mergeStyles, defaultSelected, isValid, translate } = this.props;
        const { cssStyle, mergeStyles, defaultSelected, isValid } = this.props;
        const self = this;
        const ddstyles = mergeStyles ? Object.assign({}, style, mergeStyles) : cssStyle || style;
        const arrowIconDisabled = this.props.disabled ? ddstyles.arrowIconDisabled : '';
        const errorDropDownStyle = !isValid ? ddstyles.error : '';
        const iconBackground = this.props.disabled ? ddstyles.dropdownIconBackgroundDisabled : ddstyles.dropdownIconBackground;
        const rootElementWidth = this.state.anchorEl && this.state.anchorEl.offsetWidth;
        const inputDisabled = this.props.disabled ? ddstyles.readonlyInput : '';
        // 30 px for dropdown icon
        const labelMaxWidth = rootElementWidth && rootElementWidth - 30;

        const selectedItems = defaultSelected.map((value) => {
            return value.name && self.translate(value.name);
        }).join(', ');
        // const selectedItems = defaultSelected.map((value) => (value.name)).join(', ');

        return (
            <div className={classnames(ddstyles.pointer, ddstyles.dropdownWrap, errorDropDownStyle, inputDisabled)} onClick={!this.props.disabled && this.toggleOpen}>
                <div className={classnames(iconBackground, ddstyles.dropDownRoot)}>
                    <div className={ddstyles.multiSelectDropdownPlaceholder}>
                        <div style={{maxWidth: labelMaxWidth}}>
                            <Text>{selectedItems || this.props.placeholder}</Text>
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
                    animation={PopoverAnimationVertical}
                >
                    <Menu
                        autoWidth={false}
                        disableAutoFocus
                        maxHeight={300}
                        style={{width: rootElementWidth}}
                        className={ddstyles.multiSelectDropdownMenu}
                    >
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

MultiSelectDropdown.contextTypes = {
    translate: PropTypes.func
};

export default MultiSelectDropdown;
