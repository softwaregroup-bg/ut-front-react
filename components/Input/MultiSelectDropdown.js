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

        this.state = {
            open: false,
            values: props.defaultSelected || [],
            valid: {isValid: this.props.isValid, errorMessage: this.props.errorMessage}
        };

        this.toggleOpen = this.toggleOpen.bind(this);
        this.toggleClose = this.toggleClose.bind(this);
        this.toggleAllChecks = this.toggleAllChecks.bind(this);
    }

    componentWillReceiveProps({defaultSelected, isValid, errorMessage}) {
        if (this.state.valid.isValid !== isValid) {
            this.setState({valid: {isValid: isValid, errorMessage: errorMessage}});
        }
        if (this.state.values !== defaultSelected) {
            this.setState({values: defaultSelected});
        }
    }

    toggleOpen(event) {
        return this.setState({open: true, anchorEl: event.currentTarget});
    }

    toggleClose() {
        return this.setState({open: false});
    }

    handleChange(menuItem) {
        let { onSelect, keyProp, data } = this.props;
        let { values } = this.state;
        let itemIndex = values.findIndex((value) => {
            return value.key === menuItem.key;
        });
        if (itemIndex > -1) {
            values.splice(itemIndex, 1);
        } else {
            let item = data.find((value) => {
                return value.key === menuItem.key;
            });
            values.push(item);
        }

        this.setState({open: false, values: values, valid: {isValid: true, errorMessage: ''}});
        onSelect({key: keyProp, value: values});
    }

    toggleAllChecks() {
        let { onSelect, keyProp, data } = this.props;
        let { values } = this.state;

        if (values.length === data.length) {
            values = [];
        } else {
            values = data;
        }
        this.setState({values: values, valid: {isValid: true, errorMessage: ''}});
        onSelect({key: keyProp, value: values});
    }

    getMenuItems() {
        let {data, placeholder, cssStyle, mergeStyles} = this.props;
        let {values} = this.state;

        let ddstyles = mergeStyles ? Object.assign({}, style, mergeStyles) : cssStyle || style;

        let menuItems = [
            <MenuItem
              className={ddstyles.multiSelectDropdownMenuItemWrap}
              onTouchTap={this.toggleAllChecks}
              key={'1-ddfg'}>
                <div className={ddstyles.multiSelectDropdownMenuItem}>
                    <Checkbox
                      checked={values.length === data.length} />
                    <span>{placeholder}</span>
                </div>
            </MenuItem>,
            <Divider
              key={'2-ddfg'} />
        ];
        data.forEach((item) => {
            let isChecked = values.findIndex((i) => {
                return item.key === i.key;
            }) > -1;
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

        return menuItems;
    }

    renderDropDown() {
        let menuItems = this.getMenuItems();
        let { cssStyle, mergeStyles } = this.props;
        let ddstyles = mergeStyles ? Object.assign({}, style, mergeStyles) : cssStyle || style;
        let arrowIconDisabled = this.props.disabled ? ddstyles.arrowIconDisabled : '';
        let errorDropDownStyle = !this.state.valid.isValid ? ddstyles.error : '';
        let editedInputStyle = this.props.isEdited ? ddstyles.editedInputStyle : '';
        let iconBackground = this.props.disabled ? ddstyles.dropdownIconBackgroundDisabled : ddstyles.dropdownIconBackground;
        let rootElementWidth = this.state.anchorEl && this.state.anchorEl.offsetWidth;
        let inputDisabled = this.props.disabled ? ddstyles.readonlyInput : '';
        // 30 px for dropdown icon
        let labelMaxWidth = rootElementWidth && rootElementWidth - 30;

        let selectedItems = this.state.values.map((value) => (value.name)).join(', ');

        return (
            <div className={classnames(ddstyles.pointer, ddstyles.dropdownWrap, errorDropDownStyle, editedInputStyle, inputDisabled)} onClick={!this.props.disabled && this.toggleOpen}>
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
                  animation={PopoverAnimationVertical}
                >
                    <Menu
                      autoWidth={false}
                      disableAutoFocus
                      multiple
                      value={this.state.values.map((value) => (value.key))}
                      maxHeight={300}
                      style={{width: rootElementWidth}}
                      className={ddstyles.multiSelectDropdownMenu}>
                        {menuItems}
                    </Menu>
                </Popover>
            </div>
        );
    }
}

MultiSelectDropdown.defaultProps = {
    isValid: true,
    errorMessage: '',
    isEdited: false
};

export default MultiSelectDropdown;
