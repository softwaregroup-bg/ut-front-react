import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
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
    }

    toggleOpen(event) {
        return this.setState({open: true, anchorEl: event.currentTarget});
    }

    render() {
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
                        <div className={ddstyles.multiSelectDropdownPlaceholder}>
                            <div style={{maxWidth: labelMaxWidth}}>
                                {this.props.placeholder}
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
                      value={this.state.value}
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

GroupDropdown.propTypes = {

};

export default GroupDropdown;