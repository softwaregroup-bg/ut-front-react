import React, { PropTypes } from 'react';
import classnames from 'classnames';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
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

    handleChange(event, menuItem, index) {
        let { onSelect, keyProp, data } = this.props;
        let { values } = this.state;
        let itemIndex = values.findIndex((value) => {
            return value.key === menuItem.props.value;
        });
        if (itemIndex > -1) {
            values.splice(itemIndex, 1);
        } else {
            let item = data.find((value) => {
                return value.key === menuItem.props.value;
            });
            values.push(item);
        }

        this.setState({values: values, valid: {isValid: true, errorMessage: ''}});
        onSelect({key: keyProp, value: values});
    }

    renderDropDown() {
        let menuItems = this.getMenuItems();
        let { cssStyle, mergeStyles } = this.props;
        let ddstyles = mergeStyles ? Object.assign({}, style, mergeStyles) : cssStyle || style;
        let arrowIconDisabled = this.props.disabled ? ddstyles.arrowIconDisabled : '';
        let errorDropDownStyle = !this.state.valid.isValid ? ddstyles.error : '';
        let editedInputStyle = this.props.isEdited ? ddstyles.editedInputStyle : '';

        let selectedItems = this.state.values.map((value) => (value.name)).join(', ');
        if (selectedItems.length > this.props.placeholderMaxLength) {
            selectedItems = selectedItems.slice(0, this.props.placeholderMaxLength) + '...';
        }
        return (
            <div className={classnames(ddstyles.multiSelectDropdownWrap, errorDropDownStyle, editedInputStyle, ddstyles.pointer)} onClick={!this.props.disabled && this.toggleOpen}>
                    <div className={classnames(ddstyles.dropdownIconBackground, ddstyles.dropDownRoot)}>
                        <div className={ddstyles.multiSelectDropdownPlaceholder}>
                            {selectedItems || this.props.placeholder}
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
                  style={{height: '300px'}}
                >
                    <Menu
                      className={ddstyles.multiSelectDropdownMenu}
                      onItemTouchTap={this.handleChange}
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
    isEdited: false,
    placeholderMaxLength: 40,
    selectedItemStyle: {color: '#2881ec'}
};

export default MultiSelectDropdown;
