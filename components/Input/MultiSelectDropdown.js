import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import style from './style.css';

class MultiSelectDropdown extends Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            values: props.defaultSelected || [],
            valid: {isValid: this.props.isValid, errorMessage: this.props.errorMessage}
        };

        this.toggle = this.toggle.bind(this);
        this.getMenuItems = this.getMenuItems.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.renderDropDown = this.renderDropDown.bind(this);
    }

    componentWillReceiveProps(props) {
        if (this.state.values !== props.defaultSelected) {
            this.setState({values: props.defaultSelected});
        }
    }

    toggle(event) {
        return this.setState({open: !this.state.open});
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
        if (selectedItems.length > 40) {
            selectedItems = selectedItems.slice(0, 40) + '...';
        }
        return (
            <div className={classnames(ddstyles.dropdownWrap)}>
                <div className={classnames(iconBackground, ddstyles.dropDownRoot)} onClick={!this.props.disabled && this.toggle} >
                    {selectedItems || this.props.placeholder}
                    <svg className={classnames(arrowIconDisabled, ddstyles.arrowIcon, ddstyles.dropdownIconWrap)} />
                </div>
                <Popover
                  open={this.state.open}
                  onRequestClose={this.toggle}
                  anchorEl={this.state.anchorEl}
                  anchorOrigin={{horizontal: 'middle', vertical: 'top'}}
                  targetOrigin={{horizontal: 'middle', vertical: 'top'}}
                  style={{height: '300px'}}
                >
                    <Menu
                      multiple
                      value={this.state.values.map((value) => (value.key))}
                      selectedMenuItemStyle={{color: '#2881ec'}}>
                        {menuItems}
                    </Menu>
                </Popover>
            </div>
        );
    }

    render() {
        let { label, cssStyle, mergeStyles } = this.props;
        let ddstyles = mergeStyles ? Object.assign({}, style, mergeStyles) : cssStyle || style;
        let { isValid, errorMessage } = this.state.valid;
        let invalidStyle = isValid ? ddstyles.hiddenHeight : '';

        if (label) {
            return (
                <div>
                    <div className={ddstyles.outerWrap}>
                        <div className={ddstyles.lableWrap}>
                            {this.props.label}
                        </div>
                        <div className={classnames(ddstyles.inputWrap)}>
                            {this.renderDropDown()}
                            <div className={classnames(ddstyles.errorWrap, invalidStyle)}>{!isValid && <div className={ddstyles.errorMessage}>{errorMessage}</div>}</div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <div className={ddstyles.outerWrap}>
                        {this.renderDropDown()}
                    </div>
                    <div className={classnames(ddstyles.errorWrap, invalidStyle)}>{!isValid && <div className={ddstyles.errorMessage}>{errorMessage}</div>}</div>
                </div>
            );
        }
    }
}

MultiSelectDropdown.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        name: PropTypes.any.isRequired
    })).isRequired,
    defaultSelected: PropTypes.any,
    label: PropTypes.string,
    placeholder: PropTypes.any,
    keyProp: PropTypes.string,
    onSelect: PropTypes.func,
    disabled: PropTypes.bool,
    mergeStyles: PropTypes.object,
    // if you want to style the width of the dropdown, add a wrapper element that has min-width and max-width properties
    cssStyle: PropTypes.any, // css file to take styles [Should have the same classes/divs like in styles.css]

    // Validation
    isValid: PropTypes.bool,
    errorMessage: PropTypes.string,

    // Edited
    isEdited: PropTypes.bool
};

MultiSelectDropdown.defaultProps = {
    label: undefined,
    placeholder: 'Select',
    keyProp: '__no_source_prop_key__',
    onSelect: () => {},
    isValid: true,
    errorMessage: '',
    isEdited: false
};

export default MultiSelectDropdown;
