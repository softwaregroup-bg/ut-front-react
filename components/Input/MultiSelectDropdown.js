import React, { PropTypes } from 'react';
import classnames from 'classnames';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import style from './style.css';

import Dropdown from './Dropdown';

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
        this.getMenuItems = this.getMenuItems.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.renderDropDown = this.renderDropDown.bind(this);
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

    handleChange(itemKey) {
        let { onSelect, keyProp, data } = this.props;
        let { values } = this.state;
        let itemIndex = values.findIndex((value) => {
            return value.key === itemKey;
        });
        if (itemIndex > -1) {
            values.splice(itemIndex, 1);
        } else {
            let item = data.find((value) => {
                return value.key === itemKey;
            });
            values.push(item);
        }

        this.setState({values: values, valid: {isValid: true, errorMessage: ''}});
        onSelect({key: keyProp, value: values});
    }

    getMenuItems() {
        let { data, placeholder } = this.props;
        let menuItems = [];

        menuItems.push(
            <MenuItem
              key={Math.random() + '-ddfg'}
              disabled
              value={'__placeholder__'}
              primaryText={placeholder}
            />
        );

        data.forEach((item, i) => {
            menuItems.push(
                <MenuItem
                  onTouchTap={() => { this.handleChange(item.key); }}
                  key={item.key}
                  disabled={item.disabled}
                  value={item.key}
                  primaryText={item.name}
                />
            );
        });

        return menuItems;
    }

    renderDropDown() {
        let menuItems = this.getMenuItems();
        let { cssStyle, mergeStyles } = this.props;
        let ddstyles = mergeStyles ? Object.assign({}, style, mergeStyles) : cssStyle || style;
        let arrowIconDisabled = this.props.disabled ? style.arrowIconDisabled : '';
        let iconBackground = style.dropdownIconBackground;

        let selectedItems = this.state.values.map((value) => (value.name)).join(', ');
        if (selectedItems.length > this.props.placeholderMaxLength) {
            selectedItems = selectedItems.slice(0, this.props.placeholderMaxLength) + '...';
        }
        return (
            <div className={classnames(ddstyles.dropdownWrap, ddstyles.pointer)} onClick={!this.props.disabled && this.toggleOpen}>
                <div className={classnames(iconBackground, ddstyles.dropDownRoot)} >
                    <div className={ddstyles.multiSelectDropdownPlaceholder}>
                        {selectedItems || this.props.placeholder}
                    </div>
                    <svg className={classnames(arrowIconDisabled, ddstyles.arrowIcon, ddstyles.dropdownIconWrap)} />
                </div>
                <div className={ddstyles.hideTextWrap} />

                <Popover
                  open={this.state.open}
                  onRequestClose={this.toggleClose}
                  anchorEl={this.state.anchorEl}
                  anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                  targetOrigin={{horizontal: 'left', vertical: 'top'}}
                  style={{height: '300px', cursor: 'pointer'}}
                >
                    <Menu
                      disableAutoFocus
                      multiple
                      value={this.state.values.map((value) => (value.key))}
                      selectedMenuItemStyle={this.props.selectedItemStyle}>
                        {menuItems}
                    </Menu>
                </Popover>
            </div>
        );
    }
}

MultiSelectDropdown.propTypes = {
    placeholderMaxLength: PropTypes.number,
    selectedItemStyle: PropTypes.object
};

MultiSelectDropdown.defaultProps = {
    isValid: true,
    errorMessage: '',
    placeholderMaxLength: 40,
    selectedItemStyle: {color: '#2881ec'}
};

export default MultiSelectDropdown;
