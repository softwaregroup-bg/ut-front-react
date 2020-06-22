import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import Popover from '@material-ui/core/Popover';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import style from './style.css';
import classnames from 'classnames';
import dropdownIcon from './images/dropdown.png';

export default class DropdownSelect extends Component {
    constructor(props, context) {
        super(props, context);
        this.handleToggle = this.handleToggle.bind(this);
        let selected = null;
        if (props.defaultSelected !== undefined) {
            selected = props.data.find(
                (item) => {
                    return item[props.keyProp] === props.defaultSelected;
                }
            );
        }
        this.state = {
            dropdownOpen: false,
            selected: selected || {[props.keyProp]: '_placeholder_'},
            valid: {isValid: this.props.isValid, errorMessage: this.props.errorMessage}
        };
    }

    static propTypes = {
        label: PropTypes.string,
        data: PropTypes.arrayOf(PropTypes.shape({
            disabled: PropTypes.bool,
            header: PropTypes.bool,
            selected: PropTypes.bool
        })),
        customTheme: PropTypes.bool,
        placeholder: PropTypes.string,
        defaultSelected: PropTypes.any,
        onSelect: PropTypes.func,
        onClick: PropTypes.func,
        keyProp: PropTypes.string,
        valueProp: PropTypes.string,
        canSelectPlaceholder: PropTypes.bool,
        showPlaceHolderAsFirstOption: PropTypes.bool,
        isValid: PropTypes.bool,
        errorMessage: PropTypes.string,
        updateError: PropTypes.func
    }

    static defaultProps = {
        data: [],
        customTheme: false,
        placeholder: 'Select',
        onSelect: function() {},
        keyProp: 'key',
        valueProp: 'name',
        canSelectPlaceholder: false,
        showPlaceHolderAsFirstOption: true,
        isValid: true,
        errorMessage: '',
        updateError: () => {}
    }

    componentWillReceiveProps({defaultSelected, keyProp, data, isValid, errorMessage}) {
        if ((defaultSelected !== this.props.defaultSelected && this.state.selected[keyProp] !== defaultSelected) || this.props.data !== data) {
            let selected = data.find(
                (item) => item[keyProp] === defaultSelected
            );
            selected = selected || {[keyProp]: '_placeholder_'};
            this.setState({selected: selected});
        }

        if (this.state.valid.isValid !== isValid) {
            this.setState({valid: {isValid: isValid, errorMessage: errorMessage}});
        }
    }

    handleToggle(event) {
        if (event) {
            this.setState({
                dropdownOpen: !this.state.dropdownOpen,
                anchorEl: event.currentTarget
            });
        } else {
            this.setState({
                dropdownOpen: !this.state.dropdownOpen
            });
        }
    }

    select(item) {
        return () => {
            this.handleToggle();
            this.props.updateError({key: this.props.keyProp});
            this.setState({selected: item, valid: {isValid: true, errorMessage: ''}});

            if (item[this.props.keyProp] === '_placeholder_') {
                this.props.onSelect(undefined);
            } else {
                this.props.onSelect(item);
            }
        };
    }

    renderDropdownItems() {
        const selectedItem = this.state.selected || {};
        const items = [];

        if (this.props.showPlaceHolderAsFirstOption) {
            items.push(
                <MenuItem
                    key='_placeholder_'
                    primaryText={this.props.placeholder}
                    disabled={!this.props.canSelectPlaceholder || selectedItem[this.props.keyProp] === '_placeholder_'}
                    onClick={this.select({key: '_placeholder_'})}
                />
            );
        }

        this.props.data.forEach((item) => {
            const disabled = item.disabled || selectedItem[this.props.keyProp] === item[this.props.keyProp];
            items.push(
                <MenuItem
                    key={item[this.props.keyProp]}
                    primaryText={item[this.props.valueProp]}
                    disabled={disabled}
                    onClick={this.select(item)}
                />
            );
        });

        return items;
    }

    getSelected() {
        return this.state.selected;
    }

    render() {
        const { isValid, errorMessage } = this.state.valid;
        const errorDropDownStyle = !isValid ? style.error : '';
        const asd = isValid ? style.hh : '';

        if (this.props.customTheme) {
            const dropDownWrapStyle = [style.dropDownWrap];
            if (!this.props.label) {
                dropDownWrapStyle.push(style.noLabel);
            }
            return (
                <div>
                    {this.props.label ? (<span className={style.label}>{this.props.label}</span>) : ''}
                    <div onClick={this.props.onClick} className={classnames.apply(undefined, dropDownWrapStyle)}>
                        {/* animated=false prevents bugs caused by animation delay */}
                        <div className={classnames('dropdownSelect', style.selectWithArrowWrap, errorDropDownStyle)} onClick={this.handleToggle}>
                            <span className={style.defaultSelection}>{this.getSelected()[this.props.valueProp] || this.props.placeholder}</span>
                            <div className={style.arrowWrap}><img src={dropdownIcon} /></div>
                        </div>
                    </div>
                    <Popover
                        open={this.state.dropdownOpen}
                        animated={false}
                        anchorEl={this.state.anchorEl}
                        onClose={this.handleToggle}
                        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                        transformOrigin={{horizontal: 'right', vertical: 'top'}}
                    >
                        <MenuList>
                            {this.renderDropdownItems()}
                        </MenuList>
                    </Popover>
                    <div className={classnames(style.errorWrap, asd)}>{!isValid && <div className={style.errorMessage}>{errorMessage}</div>}</div>
                </div>
            );
        } else {
            return (
                <Dropdown {...this.props} isOpen={this.state.dropdownOpen} onToggle={this.handleToggle} onClick={this.props.onClick}>
                    <DropdownToggle caret>
                        {this.getSelected()[this.props.valueProp] || this.props.placeholder}
                    </DropdownToggle>
                    <DropdownMenu>
                        {this.renderDropdownItems(this)}
                    </DropdownMenu>
                </Dropdown>
            );
        }
    }
}
