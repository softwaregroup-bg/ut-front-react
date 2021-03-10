import PropTypes from 'prop-types';
import React, { Component } from 'react';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import classnames from 'classnames';
import Text from '../Text';
import style from './style.css';
import { textValidations } from '../../validator/constants';
import Popover from '@material-ui/core/Popover';
import SvgDropdownIcon from '@material-ui/icons/ArrowDropDown';

class Dropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            value: props.defaultSelected || this.props.placeholderValue,
            valid: {isValid: this.props.isValid, errorMessage: this.props.errorMessage}
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    static propTypes = {
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
    }

    static defaultProps = {
        label: undefined,
        boldLabel: true,
        placeholder: 'Select',
        placeholderValue: '__placeholder__',
        canSelectPlaceholder: false,
        disabled: false,
        keyProp: '__no_source_prop_key__',
        onSelect: () => {},
        isValid: true,
        errorMessage: ''
    }

    componentWillReceiveProps({defaultSelected, data, isValid, errorMessage}) {
        // when item is saved defaultSelected should be restored to placeholder
        if (!defaultSelected) {
            this.setState({value: this.props.placeholderValue});
        }

        if (defaultSelected !== this.props.defaultSelected || this.props.data !== data) {
            const value = data.find(
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

    handleOpen(event) {
        this.setState({open: true, anchorEl: event.currentTarget});
    }

    handleClose(event) {
        event.preventDefault();
        this.setState({open: false, anchorEl: null});
    }

    handleChange(event, value) {
        const { onSelect, keyProp } = this.props;
        const objectToPassOnChange = {key: keyProp, value: value, initValue: this.state.value};

        this.setState({value: value, valid: {isValid: true, errorMessage: ''}});
        onSelect(objectToPassOnChange);
        this.handleClose(event);
    }

    get dropdownPlaceholder() {
        const {defaultSelected, data, placeholder} = this.props;
        const selected = data.find(item => item.key === defaultSelected);
        return (selected && selected.name) || placeholder;
    }

    getTitle(name) {
        const title = name && typeof name === 'object' ? name.props.children : name;
        return title;
    }

    getMenuItems(width) {
        const { data, placeholder, canSelectPlaceholder, cssStyle, mergeStyles } = this.props;
        const ddstyles = mergeStyles ? Object.assign({}, style, mergeStyles) : cssStyle || style;
        const menuItems = [];

        menuItems.push(
            <MenuItem
                className={ddstyles.dropdownMenuItemWrap}
                key={Math.random() + '-ddfg'}
                disabled={!canSelectPlaceholder}
                value={this.props.placeholderValue}
                onClick={(event) => this.handleChange(event, this.props.placeholderValue)}
            >
                <div title={this.getTitle(placeholder)}>{placeholder}</div>
            </MenuItem>
        );

        data.forEach((item, i) => {
            menuItems.push(
                <MenuItem
                    className={ddstyles.dropdownMenuItemWrap}
                    key={item.key + '-' + i}
                    disabled={item.disabled}
                    value={item.key}
                    onClick={(event) => this.handleChange(event, item.key)}
                >
                    {item.leftIcon && <img src={item.leftIcon} />}
                    <div title={this.getTitle(item.name)}>{item.name}</div>
                    {item.rightIcon && <img src={item.rightIcon} />}
                </MenuItem>
            );
        });

        return menuItems;
    }

    renderDropDown() {
        const { cssStyle, mergeStyles } = this.props;
        const ddstyles = mergeStyles ? Object.assign({}, style, mergeStyles) : cssStyle || style;
        const errorDropDownStyle = !this.state.valid.isValid ? ddstyles.error : '';
        const arrowIconDisabled = this.props.disabled ? style.arrowIconDisabled : '';
        const inputDisabled = this.props.disabled ? ddstyles.readonlyInput : '';
        const iconBackground = this.props.disabled ? ddstyles.dropdownIconBackgroundDisabled : ddstyles.dropdownIconBackground;
        const rootElementWidth = this.state.anchorEl && this.state.anchorEl.offsetWidth;
        const menuItems = this.getMenuItems(rootElementWidth);
        // let labelMaxWidth = rootElementWidth && rootElementWidth - 30;
         
        return (
            <>
                <div className={classnames(ddstyles.dropdownWrap, errorDropDownStyle, inputDisabled)} onClick={!this.props.disabled ? this.handleOpen : undefined}>
                    <div className={classnames(iconBackground, ddstyles.dropDownRoot)}>
                        <div className={ddstyles.dropdownPlaceholder}>
                            <div title={this.getTitle(this.dropdownPlaceholder)}>
                                {this.dropdownPlaceholder}
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
                        <MenuList
                            open={this.state.open}
                            value={this.state.value}
                            onChange={this.handleChange}
                            disabled={this.props.disabled}
                            className={classnames(ddstyles.dropdownMenu)}
                        >
                            {menuItems}
                        </MenuList>
                    </Box>
                </Popover>
            </>
        );
    }

    render() {
        const { label, cssStyle, mergeStyles, containerClassName, labelWrap, inputWrap } = this.props;
        const ddstyles = mergeStyles ? Object.assign({}, style, mergeStyles) : cssStyle || style;
        const { isValid, errorMessage } = this.state.valid;
        const invalidStyle = isValid ? ddstyles.hiddenHeight : '';

        if (label) {
            return (
                <div className={classnames(containerClassName)}>
                    <div className={ddstyles.outerWrap}>
                        <div className={classnames(ddstyles.lableWrap, labelWrap, {[ddstyles.boldLabel]: this.props.boldLabel})}>
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

export default Dropdown;
