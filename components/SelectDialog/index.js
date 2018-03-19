import React, { Component, PropTypes } from 'react';
import immutable from 'immutable';
import Popup from '../Popup';
import Input from '../Input';
import Checkbox from '../Input/CheckboxNew';
import style from './style.css';

export default class SelectDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            selectedUnitIds: props.selectedIds || immutable.List()
        };
        this.selectUnit = this.selectUnit.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.handleSelectUnit = this.handleSelectUnit.bind(this);
        this.onSearchInputChange = this.onSearchInputChange.bind(this);
        this.renderItems = this.renderItems.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.open && nextProps.open && this.state.selectedUnitIds !== nextProps.selectedIds) {
            this.setState({
                selectedUnitIds: nextProps.selectedIds || immutable.List()
            });
        }
    }

    get dialogButtons() {
        const { selectedUnitIds } = this.state;
        return [
            {
                label: this.props.confirmButtonLabel,
                className: 'primaryDialog',
                styleType: 'primaryLight',
                disabled: !selectedUnitIds.size,
                onClick: this.selectUnit
            },
            {
                label: this.props.cancelButtonLabel,
                className: 'secondaryDialog',
                styleType: 'secondaryDark',
                onClick: this.closeDialog
            }
        ];
    }

    onSearchInputChange({ value }) {
        this.setState({
            searchValue: value
        });
    }

    handleSelectUnit({ value, checked }) {
        const { multiSelect } = this.props;
        const { selectedUnitIds } = this.state;
        if (multiSelect) {
            const unitIndex = selectedUnitIds.findIndex(unit => unit === value);
            this.setState({
                selectedUnitIds: checked ? selectedUnitIds.push(value) : selectedUnitIds.delete(unitIndex > -1 && unitIndex)
            });
        } else {
            this.setState({
                selectedUnitIds: checked ? immutable.List().push(value) : immutable.List()
            });
        }
    }

    selectUnit() {
        let param;
        if (this.props.multiSelect) {
            param = this.props.data.filter((obj) => {
                return this.state.selectedUnitIds.contains(obj.get('id'));
            });
        } else {
            param = this.props.data.filter((obj) => {
                return obj.get('id') === this.state.selectedUnitIds.get(0);
            });
            param = param.get(0);
        }
        this.props.onConfirm(param);
        this.closeDialog();
    }

    closeDialog() {
        this.setState({
            searchValue: '',
            selectedUnitIds: this.props.selectedIds || immutable.List()
        }, this.props.onClose);
    }

    get filteredUnits() {
        const { searchValue } = this.state;
        const { data } = this.props;
        return !searchValue ? data : data.filter(unit => {
            return unit.get('title').toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
        });
    }

    renderItems() {
        if (this.filteredUnits && this.filteredUnits.size > 0) {
            return (
                this.filteredUnits.map(item => {
                    return (
                        <Checkbox
                          key={item.get('id')}
                          label={item.get('title')}
                          value={item.get('id')}
                          checked={!!this.state.selectedUnitIds.find(unit => item.get('id') === unit)}
                          fullWidth
                          handleChange={this.handleSelectUnit} />
                    );
                })
            );
        } else {
            return <span>No data</span>;
        }
    }

    render() {
        const { open, searchPlaceholder, dialogMessage, title } = this.props;
        return (
            <Popup
              isOpen={open}
              header={{text: title, closePopup: this.closeDialog}}
              footer={{actionButtons: this.dialogButtons}}
              closePopup={this.closeDialog}
              closeOnEsc >
                <div className={style.selectDialogWrapper}>
                    <div className={style.searchInputWrapper}>
                      <Input
                        value={this.state.searchValue}
                        placeholder={searchPlaceholder || 'Search'}
                        onChange={this.onSearchInputChange} />
                    </div>
                    <div className={style.UnitsMessage}>{dialogMessage}</div>
                    <div className={style.unitsContainer}>
                        {this.renderItems()}
                    </div>
                </div>
              </Popup>
        );
    }
}

SelectDialog.defaultProps = {
    title: 'Select',
    confirmButtonLabel: 'Select',
    cancelButtonLabel: 'Cancel'
};

SelectDialog.propTypes = {
    data: PropTypes.object, // immutable List, objects inside should be {id: '', title: ''}
    open: PropTypes.bool,
    searchPlaceholder: PropTypes.string,
    title: PropTypes.string,
    dialogMessage: PropTypes.string,
    multiSelect: PropTypes.bool,
    selectedIds: PropTypes.object, // immutable List
    // selectUnit: PropTypes.func,
    // closeDialog: PropTypes.func,
    confirmButtonLabel: PropTypes.string,
    cancelButtonLabel: PropTypes.string,
    onConfirm: PropTypes.func.isRequired, // if (MultiSelect) { returns Immutable.List } else { returns Immutable.Object }
    onClose: PropTypes.func.isRequired
};
