import React from 'react';
import classnames from 'classnames';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
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

        let rootElementWidth = this.state.anchorEl && this.state.anchorEl.offsetWidth;
        // 30 px for dropdown icon
        let labelMaxWidth = rootElementWidth && rootElementWidth - 30;

        let selectedItems = this.state.values.map((value) => (value.name)).join(', ');

        return (
            <div className={classnames(ddstyles.dropdownWrap, errorDropDownStyle, editedInputStyle, ddstyles.pointer)} onClick={!this.props.disabled && this.toggleOpen}>
                    <div className={classnames(ddstyles.dropdownIconBackground, ddstyles.dropDownRoot)}>
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
                      onItemTouchTap={this.handleChange}
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
