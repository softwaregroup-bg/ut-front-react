import React, { PropTypes, Component } from 'react';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Text from '../Text';
import classnames from 'classnames';
import style from './style.css';
import { textValidations } from '../../validator/constants';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import SvgIcon from 'material-ui/SvgIcon';

class Dropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            value: props.defaultSelected || this.props.placeholderValue,
            valid: {isValid: this.props.isValid, errorMessage: this.props.errorMessage}
        };

        this.getMenuItems = this.getMenuItems.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.toggleOpen = this.toggleOpen.bind(this);
        this.toggleClose = this.toggleClose.bind(this);
        this.getTitle = this.getTitle.bind(this);
        this.renderDropDown = this.renderDropDown.bind(this);
    }

    componentWillReceiveProps({defaultSelected, data, isValid, errorMessage}) {
        // when item is saved defaultSelected should be restored to placeholder
        if (!defaultSelected) {
            this.setState({value: this.props.placeholderValue});
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
    toggleOpen(event) {
        return this.setState({open: true, anchorEl: event.currentTarget});
    }

    toggleClose() {
        return this.setState({open: false});
    }

    handleChange(event, value) {
        let { onSelect, keyProp } = this.props;
        let objectToPassOnChange = {key: keyProp, value: value, initValue: this.state.value};

        this.setState({value: value, valid: {isValid: true, errorMessage: ''}});
        onSelect(objectToPassOnChange);
        this.toggleClose();
    }

    get dropdownPlaceholder() {
        const {defaultSelected, data, placeholder} = this.props;
        const selected = data.find(item => item.key === defaultSelected);
        return (selected && selected.name) || placeholder;
    }
    getTitle(name) {
        var title = name && typeof name === 'object' ? name.props.children : name;
        return title;
    }
    getMenuItems() {
        let { data, placeholder, canSelectPlaceholder, cssStyle, mergeStyles } = this.props;
        let ddstyles = mergeStyles ? Object.assign({}, style, mergeStyles) : cssStyle || style;
        let menuItems = [];

        menuItems.push(
            <MenuItem
              key={Math.random() + '-ddfg'}
              disabled={!canSelectPlaceholder}
              value={this.props.placeholderValue || '__placeholder__'}
              primaryText={this.context.translate(placeholder)}
              className={ddstyles.dropdownMenuItemWrap}
            />
        );

        data.forEach((item, i) => {
            menuItems.push(
                <MenuItem
                    className={ddstyles.dropdownMenuItemWrap}
                    key={item.key + '-' + i}
                    disabled={item.disabled}
                    value={item.key}
                    primaryText={<div title={this.getTitle(item.name)}>{item.name}</div>}
                    leftIcon={item.leftIcon && <img src={item.leftIcon} />}
                    rightIcon={item.rightIcon && <img src={item.rightIcon} />} />
            );
        });

        return menuItems;
    }

    renderDropDown() {
        let menuItems = this.getMenuItems();
        let { cssStyle, mergeStyles } = this.props;
        let ddstyles = mergeStyles ? Object.assign({}, style, mergeStyles) : cssStyle || style;
        let errorDropDownStyle = !this.state.valid.isValid ? ddstyles.error : '';
        let arrowIconDisabled = this.props.disabled ? style.arrowIconDisabled : '';
        let inputDisabled = this.props.disabled ? ddstyles.readonlyInput : '';
        let iconBackground = this.props.disabled ? ddstyles.dropdownIconBackgroundDisabled : ddstyles.dropdownIconBackground;
        let rootElementWidth = this.state.anchorEl && this.state.anchorEl.offsetWidth;
        // let labelMaxWidth = rootElementWidth && rootElementWidth - 30;

        return (
            <div className={classnames(ddstyles.dropdownWrap, errorDropDownStyle, inputDisabled)} onClick={!this.props.disabled && this.toggleOpen}>
                <div className={classnames(iconBackground, ddstyles.dropDownRoot)}>
                    <div className={ddstyles.dropdownPlaceholder}>
                        <p title={this.getTitle(this.dropdownPlaceholder)}>
                            {this.dropdownPlaceholder}
                        </p>
                    </div>
                    <div className={classnames(ddstyles.dropdownIconWrap, arrowIconDisabled)}>
                        <svg style={{width: '26px', height: '26px'}}>
                            <path d="M7 10l5 5 5-5z" style={{fill:'#fff'}}/>
                        </svg>
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
                        value={this.state.value}
                        onChange={this.handleChange}
                        autoWidth={false}
                        disabled={this.props.disabled}
                        className={classnames(ddstyles.dropdownMenu)}
                        style={{width: rootElementWidth}}
                        maxHeight={300}>
                        {menuItems}
                    </Menu>
                </Popover>
            </div>
        );
    }

    render() {
        let { label, cssStyle, mergeStyles, containerClassName, labelWrap, inputWrap } = this.props;
        let ddstyles = mergeStyles ? Object.assign({}, style, mergeStyles) : cssStyle || style;
        let { isValid, errorMessage } = this.state.valid;
        let invalidStyle = isValid ? ddstyles.hiddenHeight : '';

        if (label) {
            return (
                <div className={classnames(containerClassName)}>
                    <div className={ddstyles.outerWrap}>
                        <div className={classnames(ddstyles.lableWrap, {[ddstyles.boldLabel]: this.props.boldLabel})}>
                            <Text>{this.props.label}</Text> {this.props.validators && this.props.validators.find(validator => validator.type === textValidations.isRequired) && '*'}
                        </div>
                        <div className={classnames(ddstyles.inputWrap, inputWrap)}>
                            {this.renderDropDown()}
                            <div className={classnames(ddstyles.errorWrap, invalidStyle)}>{!isValid && <div className={ddstyles.errorMessage}><Text>{errorMessage}</Text></div>}</div>
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
                    <div className={classnames(ddstyles.errorWrap, invalidStyle)}>{!isValid && <div className={ddstyles.errorMessage}><Text>{errorMessage}</Text></div>}</div>
                </div>
            );
        }
    }
}

Dropdown.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        name: PropTypes.any.isRequired,
        leftIcon: PropTypes.string,
        rightIcon: PropTypes.string
    })).isRequired,
    defaultSelected: PropTypes.any,
    label: PropTypes.node,
    boldLabel: PropTypes.bool,
    containerClassName: PropTypes.string,
    placeholder: PropTypes.any,
    placeholderValue: PropTypes.any,
    labelWrap: PropTypes.string,
    inputWrap: PropTypes.string,
    keyProp: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array
    ]),
    canSelectPlaceholder: PropTypes.bool,
    onSelect: PropTypes.func,
    disabled: PropTypes.bool,
    menuAutoWidth: PropTypes.bool,
    mergeStyles: PropTypes.object,
    cssStyle: PropTypes.any, // css file to take styles [Should have the same classes/divs like in styles.css]

    // Validation
    validators: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.oneOf([textValidations.isRequired, textValidations.length, textValidations.numberOnly, textValidations.decimalOnly, textValidations.email, textValidations.uniqueValue, textValidations.regex]).isRequired,
            values: PropTypes.any,
            errorMessage: PropTypes.string
        })
    ),
    isValid: PropTypes.bool,
    errorMessage: PropTypes.string
};

Dropdown.defaultProps = {
    label: undefined,
    boldLabel: true,
    placeholder: 'Select',
    placeholderValue: '__placeholder__',
    canSelectPlaceholder: false,
    disabled: false,
    keyProp: '__no_source_prop_key__',
    onSelect: () => {},
    isValid: true,
    errorMessage: '',
    menuAutoWidth: false
};

Dropdown.contextTypes = {
    translate: PropTypes.func
};

export default Dropdown;
