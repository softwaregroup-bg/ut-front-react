import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { propTypeField } from '../common';
import Menu from 'material-ui/Menu';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Checkbox from '../../Input/Checkbox';
import style from './styles.css';

export default class Field extends Component {
    constructor(props) {
        super(props);
        this.handleOrder = this.handleOrder.bind(this);
        this.handleMenuOpen = this.handleMenuOpen.bind(this);
        this.handleMenuClose = this.handleMenuClose.bind(this);
        this.toggleColumnVisibility = this.toggleColumnVisibility.bind(this);
        this.state = {menuOpened: false};
    }
    getStyle(name) {
        return this.props.externalStyle[name] || this.context.implementationStyle[name] || style[name];
    }
    handleOrder() {
        this.props.handleOrder(this.props.field.name);
    }
    handleMenuOpen(event) {
        event.preventDefault();

        this.setState({
            menuOpened: true,
            anchorEl: event.currentTarget
        });
    }
    handleMenuClose() {
        this.setState({
            menuOpened: false
        });
    }
    toggleColumnVisibility(field) {
        return () => {
            this.handleMenuClose();
            this.props.toggleColumnVisibility(field);
        };
    }
    getMenuColumnItems() {
        return this.props
            .fields
            .filter((f) => (!f.internal))
            .map((f) => (
                <MenuItem
                  children={
                      <div onTouchTap={this.toggleColumnVisibility(f)}>
                        <Checkbox isDisabled={false} checked={f.visible} />
                        <span>{f.title}</span>
                      </div>
                  }
                />
            ));
    }
    getMenu() {
        return (
            <Popover
              open={this.state.menuOpened}
              anchorEl={this.state.anchorEl}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              onRequestClose={this.handleMenuClose}
              animation={PopoverAnimationVertical}
            >
                <Menu>
                    <Divider />
                    <MenuItem
                      primaryText='Columns'
                      rightIcon={<ArrowDropRight />}
                      menuItems={this.getMenuColumnItems()}
                    />
                </Menu>
            </Popover>
        );
    }
    render() {
        if (this.props.field.visible === false) {
            return false;
        }
        let styles = [this.getStyle('girdOrderHeadingStyle')];
        let {orderDirection} = this.props;

        if (orderDirection) {
            styles.push(this.getStyle('girdOrderHeadingStyle' + orderDirection));
        }
        return (
            <th className={this.getStyle('girdHeading')}>
                <span onTouchTap={this.handleMenuOpen} className={this.getStyle('girdHeadingMenu')} />
                {this.getMenu()}
                <span onTouchTap={this.handleOrder} className={classnames.apply(undefined, styles)}>{this.props.field.title || ''}</span>
            </th>
        );
    }
}

Field.propTypes = {
    field: propTypeField,
    fields: PropTypes.array,
    externalStyle: PropTypes.object,
    orderDirection: PropTypes.string,
    toggleColumnVisibility: PropTypes.func,
    handleOrder: PropTypes.func
};

Field.defaultProps = {
    field: {},
    orderBy: [],
    handleOrder: (field) => ({}),
    toggleColumnVisibility: (field) => ({})
};

Field.contextTypes = {
    implementationStyle: PropTypes.object
};
