import React, { PropTypes, Component } from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import classnames from 'classnames';
import style from './style.css';

class Dropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.defaultSelected || '__placeholder__',
            valid: {isValid: this.props.isValid, errorMessage: this.props.errorMessage}
        };

        this.getMenuItems = this.getMenuItems.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.renderDropDown = this.renderDropDown.bind(this);
    }

    componentWillReceiveProps({defaultSelected, data, isValid, errorMessage}) {
        // when item is saved defaultSelected should be restored to placeholder
        if (!defaultSelected) {
            this.setState({value: '__placeholder__'});
        }

        if (defaultSelected !== this.props.defaultSelected || this.props.data !== data) {
            let value = data.find(
                (item) => {
                    return item.key === defaultSelected;
                }
            );
            if (value) this.setState({value: value.key});
        }

        if (this.state.valid.isValid !== isValid) {
            this.setState({valid: {isValid: isValid, errorMessage: errorMessage}});
        }
    }

    handleChange(event, index, value) {
        let { onSelect, keyProp } = this.props;
        let objectToPassOnChange = {key: keyProp, value: value, initValue: this.state.value};

        this.setState({value: value, valid: {isValid: true, errorMessage: ''}});
        onSelect(objectToPassOnChange);
    }

    getMenuItems() {
        let { data, placeholder, canSelectPlaceholder } = this.props;
        let menuItems = [];

        menuItems.push(
            <MenuItem
              key={Math.random() + '-ddfg'}
              disabled={!canSelectPlaceholder}
              value={'__placeholder__'}
              primaryText={placeholder}
            />
        );

        data.forEach((item, i) => {
            menuItems.push(
                <MenuItem
                  key={item.key + '-' + i}
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
        let errorDropDownStyle = !this.state.valid.isValid ? ddstyles.error : '';
        let editedInputStyle = this.props.isEdited ? ddstyles.editedInputStyle : '';
        let arrowIconDisabled = this.props.disabled ? style.arrowIconDisabled : '';
        let inputDisabled = this.props.disabled ? ddstyles.readonlyInput : '';

        let iconStyles = {
            fill: '#FFF',
            right: '0px',
            top: '1px',
            width: '26px',
            height: '26px'
        };
        if (this.props.iconStyles) {
            iconStyles = Object.assign(iconStyles, this.props.iconStyles);
        }
        if (this.props.disabled) {
            iconStyles.background = '#d7d6d6';
        }

        return (
            <div className={classnames(ddstyles.dropdownWrap, errorDropDownStyle, editedInputStyle, inputDisabled)}>
                <div className={classnames(arrowIconDisabled, ddstyles.arrowIcon)} />
                <div className={ddstyles.hideTextWrap} />
                <DropDownMenu
                  value={this.state.value}
                  onChange={this.handleChange}
                  autoWidth={this.props.menuAutoWidth}
                  disabled={this.props.disabled}
                  className={classnames(ddstyles.dropdownIconBackground, ddstyles.dropDownRoot)}
                  iconStyle={iconStyles}
                  maxHeight={300}
                >
                    {menuItems}
                </DropDownMenu>
            </div>
        );
    }

    render() {
        let { label, cssStyle, mergeStyles, containerClassName } = this.props;
        let ddstyles = mergeStyles ? Object.assign({}, style, mergeStyles) : cssStyle || style;
        let { isValid, errorMessage } = this.state.valid;
        let invalidStyle = isValid ? ddstyles.hiddenHeight : '';

        if (label) {
            return (
                <div className={classnames(containerClassName)}>
                    <div className={ddstyles.outerWrap}>
                        <div className={classnames(ddstyles.lableWrap, {[ddstyles.boldLabel]: this.props.boldLabel})}>
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
                <div className={classnames(containerClassName)}>
                    <div className={ddstyles.outerWrap}>
                        {this.renderDropDown()}
                    </div>
                    <div className={classnames(ddstyles.errorWrap, invalidStyle)}>{!isValid && <div className={ddstyles.errorMessage}>{errorMessage}</div>}</div>
                </div>
            );
        }
    }
}

Dropdown.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        name: PropTypes.any.isRequired
    })).isRequired,
    defaultSelected: PropTypes.any,
    label: PropTypes.node,
    boldLabel: PropTypes.bool,
    containerClassName: PropTypes.string,
    placeholder: PropTypes.any,
    keyProp: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array
    ]),
    canSelectPlaceholder: PropTypes.bool,
    onSelect: PropTypes.func,
    disabled: PropTypes.bool,
    menuAutoWidth: PropTypes.bool,
    mergeStyles: PropTypes.object,
    iconStyles: PropTypes.object,
    // if you want to style the width of the dropdown, add a wrapper element that has min-width and max-width properties
    cssStyle: PropTypes.any, // css file to take styles [Should have the same classes/divs like in styles.css]

    // Validation
    isValid: PropTypes.bool,
    errorMessage: PropTypes.string,

    // Edited
    isEdited: PropTypes.bool
};

Dropdown.defaultProps = {
    label: undefined,
    boldLabel: false,
    placeholder: 'Select',
    canSelectPlaceholder: false,
    disabled: false,
    keyProp: '__no_source_prop_key__',
    onSelect: () => {},
    isValid: true,
    errorMessage: '',
    isEdited: false,
    menuAutoWidth: false
};

export default Dropdown;
