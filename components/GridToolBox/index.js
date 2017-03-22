import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { filterElementTypes, actionButtonElementTypes, actionButtonClickFunctionality } from './types';
import { Link } from 'react-router';

import Dropdown from '../Input/Dropdown';
import Input from '../Input/TextField';
import SearchBox from '../SearchBox';
import DatePickerBetween from './../DatePicker/Between';
import DateTimePickerBetween from '../DateTimePicker/Between';
import ConfirmDialog from '../ConfirmDialog';
import StandardDialog from '../Popup';
import StandardButton from '../StandardButton';
import { Button } from 'reactstrap';
import { formatIso } from 'material-ui/DatePicker/dateUtils';
import { formatTime } from 'material-ui/TimePicker/timeUtils';

import {generateUniqueId} from '../../utils/helpers';

import classnames from 'classnames';
import style from './style.css';

const dropDrownAllOptionKey = '__all__';
const dropDrownPlaceholderOptionKey = '__placeholder__';

const defaultTimeFormat = { hour: '2-digit', minute: '2-digit', hour12: false };
const defaultDateFormat = { day: 'numeric', month: 'numeric', year: 'numeric' };

class GridToolBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showFilters: true,
            hasActiveFilters: false,
            showFiltersPopup: false,
            filters: {}
        };

        this.propStatus = this.propStatus.bind(this);
        this.openRefDialogWithMessage = this.openRefDialogWithMessage.bind(this);
        this.renderActionButton = this.renderActionButton.bind(this);
        this.toggleAdvancedSearch = this.toggleAdvancedSearch.bind(this);
        this.applyFilters = this.applyFilters.bind(this);
    }

    componentWillMount() {
        this.checkActiveFilters(this.props.filterElements);
    }

    componentWillReceiveProps({ selected, checked, filterElements }) {
        let showFilters = (selected.size === 0 && checked.size === 0);
        this.setState({showFilters});

        this.checkActiveFilters(filterElements);
    }

    checkActiveFilters(filterElements = []) {
        let foundActiveFilter = false;
        filterElements.forEach((filter) => {
            let hasValue;
            switch (filter.type) {
                case filterElementTypes.datePickerBetween:
                case filterElementTypes.dateTimePickerBetween:
                    hasValue = !!(filter.defaultValue.from ||
                        filter.defaultValue.to);
                    break;
                case filterElementTypes.dropDown:
                    hasValue = !!(filter.defaultValue &&
                        filter.defaultValue !== dropDrownAllOptionKey &&
                        filter.defaultValue !== dropDrownPlaceholderOptionKey);
                    break;
                default:
                    hasValue = !!filter.defaultValue;
                    break;
            }

            foundActiveFilter = foundActiveFilter || hasValue;
        });

        this.setState({hasActiveFilters: foundActiveFilter});
    }

    hasSelectedOrChecked() {
        let { selected, checked } = this.props;

        return selected.size > 0 || checked.size > 0;
    }

    renderFilter(filterElement, inDialog = false) {
        let { filterAutoFetch } = this.props;
        let { filters, showFiltersPopup } = this.state;

        let onChange = (key, value) => {
            filters[key] = value;
            this.setState({filters});
        };

        let filterValue;

        if (filterElement.type === filterElementTypes.datePickerBetween || filterElement.type === filterElementTypes.dateTimePickerBetween) {
            let defaultEmpty = true;
            Object.keys(filterElement.defaultValue).forEach(k => {
                defaultEmpty = defaultEmpty && !!filterElement.defaultValue[k];
            });

            // dont change values in the background when advanced is open
            filterValue = (showFiltersPopup && !inDialog)
                ? filterElement.defaultValue
                : ((!defaultEmpty && filterElement.defaultValue) || {
                    from: filters[filterElement.name.from],
                    to: filters[filterElement.name.to]
                });
        } else {
            // dont change values in the background when advanced is open
            filterValue  = (showFiltersPopup && !inDialog)
                ? filterElement.defaultValue
                : (filterElement.defaultValue || filters[filterElement.name]);
        }

        let label = inDialog
            ? filterElement.label
            : null;

        switch (filterElement.type) {
            case filterElementTypes.dropDown:
                return (
                    <Dropdown
                      label={label}
                      boldLabel={inDialog}
                      data={filterElement.data}
                      customTheme
                      placeholder={filterElement.placeholder}
                      defaultSelected={filterValue}
                      onSelect={filterAutoFetch && !inDialog
                        ? filterElement.onSelect
                        : function(obj) {
                            onChange(filterElement.name, obj.value);
                        }}
                      canSelectPlaceholder={filterElement.canSelectPlaceholder} />
                );
            case filterElementTypes.searchBox:
                return (filterAutoFetch && !inDialog)
                    ? (<div>
                            <SearchBox
                              defaultValue={filterValue}
                              placeholder={filterElement.placeholder}
                              onSearch={filterElement.onSearch} />
                        </div>)
                    : (<div>
                        <Input
                          label={label}
                          defaultValue={filterValue}
                          placeholder={filterElement.placeholder}
                          onChange={function(e) {
                              onChange(filterElement.name, e.target.value);
                          }} />
                    </div>);
            case filterElementTypes.datePickerBetween:              
                return (<div>
                            <DatePickerBetween
                              onChange={filterAutoFetch
                                  ? filterElement.onChange
                                  : function(obj) {
                                      onChange(filterElement.name[obj.key], obj.value);
                                  }}
                              withVerticalClass={inDialog}
                              defaultValue={filterValue}
                              dateFormat={filterElement.dateFormat || defaultDateFormat}
                              locale={filterElement.locale}
                              masterLabel={filterElement.masterLabel}
                              labelFrom={filterElement.labelFrom}
                              labelTo={filterElement.labelTo}
                              boldLabel={inDialog} />
                        </div>);
            case filterElementTypes.dateTimePickerBetween:
                return (<div>
                            <DateTimePickerBetween
                              onChange={filterAutoFetch
                                  ? filterElement.onChange
                                  : function(obj) {
                                      onChange(filterElement.name[obj.key], obj.value);
                                  }}
                              withVerticalClass={inDialog}
                              defaultValue={filterValue}
                              timeFormat={filterElement.timeFormat || defaultTimeFormat}
                              dateFormat={filterElement.dateFormat || defaultDateFormat}
                              locale={filterElement.locale}
                              labelFrom={filterElement.labelFrom}
                              labelTo={filterElement.labelTo}
                              boldLabel={inDialog} />
                        </div>);
            default:
                return <div />;
        }
    }

    getDefaultValuesFromProps() {
        let { filterElements } = this.props;
        let defaultValues = {};

        filterElements.forEach(filter => {
            if (typeof filter.name === typeof {}) {
                // range filters
                Object.keys(filter.name).forEach(key => {
                    defaultValues[filter.name[key]] = filter.defaultValue[key];
                });
            } else {
                defaultValues[filter.name] = filter.defaultValue;
            }
        });

        return defaultValues;
    }

    toggleAdvancedSearch() {
        let {showFiltersPopup} = this.state;

        let defaultValues = {};

        if (!showFiltersPopup) {
            // get applied filters when opening advanced search;
            defaultValues = this.getDefaultValuesFromProps();
        }

        this.setState({
            showFiltersPopup: !showFiltersPopup,
            filters: defaultValues
        });
    }

    getTooltip() {
        let { filterElements } = this.props;

        let content = [];

        filterElements.forEach((filter) => {
            switch (filter.type) {
                case filterElementTypes.datePickerBetween:
                case filterElementTypes.dateTimePickerBetween:
                    let timeFormat = filter.timeFormat || defaultTimeFormat;
                    let dateFormat = filter.dateFormat || defaultDateFormat;

                    Object.keys(filter.defaultValue).forEach(key => {
                        if (!filter.defaultValue[key]) {
                            return;
                        }

                        let date = new Date(filter.defaultValue[key]);
                        let dateValue;
                        let timeValue;

                        if (filter.locale) {
                            dateValue = date.toLocaleDateString(filter.locale, dateFormat);
                            timeValue = date.toLocaleTimeString(filter.locale, timeFormat);
                        } else {
                            dateValue = formatIso(date);
                            timeValue = formatTime(date);
                        }

                        let value = dateValue;

                        if (filter.type === filterElementTypes.dateTimePickerBetween) {
                            value = `${value} ${timeValue}`;
                        }

                        key = `label${key.charAt(0).toUpperCase() + key.slice(1)}`;

                        content.push(<div key={generateUniqueId()}>
                            <span><span className={style.bold}>{filter[key]}: </span> {value}</span>
                        </div>);
                    });
                    break;
                case filterElementTypes.dropDown:
                    if (filter.defaultValue && filter.defaultValue !== dropDrownAllOptionKey && filter.defaultValue !== dropDrownPlaceholderOptionKey) {
                        let obj = filter.data.filter((dropdownItem) => {
                            if (filter.defaultValue === dropdownItem.key) {
                                return true;
                            }
                        });

                        content.push(<div key={generateUniqueId()}>
                            <span><span className={style.bold}>{filter.label}: </span> {obj[0].name}</span>
                        </div>);
                    }
                    break;
                default:
                    if (filter.defaultValue) {
                        content.push(<div key={generateUniqueId()}>
                            <span><span className={style.bold}>{filter.label}: </span> {filter.defaultValue}</span>
                        </div>);
                    }
                    break;
            }
        });

        return content;
    }

    getInputsCount() {
        let { filterElements } = this.props;

        let count = filterElements.reduce((previousValue, currentValue) => {
            switch (currentValue.type) {
                case filterElementTypes.datePickerBetween:
                case filterElementTypes.dateTimePickerBetween:
                    return previousValue + 2;
                default:
                    return previousValue + 1;
            }
        }, 0);

        return count;
    }

    renderAdvancedButton() {
        let tooltipContent = this.getTooltip();
        let el = <span key={1} className={style.advancedSearchIconWrapper}>
            <button className={classnames(style.toolbarElement, style.noRightMargin, style.advancedSearchIcon)} onClick={this.toggleAdvancedSearch} />
            {tooltipContent.length ? <div className={style.advancedSearchPopOver}>
                {tooltipContent}
            </div> : null}
        </span>;

        return el;
    }

    renderAdvancedSearchDialog() {
        if (!this.state.showFiltersPopup) {
            return;
        }

        let apply = () => {
            this.applyFilters();
            this.toggleAdvancedSearch();
        };

        let actionButtons = [
            {label: 'Apply Search', onClick: apply, styleType: 'primaryDialog'},
            {label: 'Cancel', onClick: this.toggleAdvancedSearch, styleType: 'secondaryDialog'}
        ];

        return <StandardDialog
          closePopup={this.toggleAdvancedSearch}
          header={{text: 'Advanced Search'}}
          isOpen={this.state.showFiltersPopup}
          footer={{actionButtons: actionButtons}}
          className={style.advancedSearchDialog}>
            {this.props.filterElements.map((el, i) => {
                return (
                    <div key={i} className={style.advancedSearchInputWrapper}>
                        {this.renderFilter(el, true)}
                    </div>
                );
            })}
        </StandardDialog>;
    }

    renderAdvanced() {
        let { maxVisibleInputs, showAdvanced } = this.props;
        let count = this.getInputsCount();
        if (count > maxVisibleInputs || showAdvanced) {
            let advancedSearchBtn = this.renderAdvancedButton();
            let advancedDialog = this.renderAdvancedSearchDialog();

            return [advancedSearchBtn, advancedDialog];
        }

        return null;
    }

    renderFilters() {
        let { filterElements } = this.props;

        let hasSelectedOrChecked = this.hasSelectedOrChecked();

        let labelClass = hasSelectedOrChecked ? style.link : '';
        let toggle = () => hasSelectedOrChecked && this.setState({showFilters: false});
        let filtersNumber = 0;
        let leftSide;
        if (filterElements.length === 1 && filterElements[0]['type'] === filterElementTypes.searchBox) {
            leftSide = hasSelectedOrChecked ? <span className={style.link}>Show buttons</span> : '';
        } else {
            leftSide = hasSelectedOrChecked ? <span className={style.link}>Show buttons</span> : 'Filter by';
        }

        return (
            <div className={style.toolbarWrap}>
                <div className={classnames(style.toolbarElement, style.label, labelClass)} onClick={toggle}>
                    {leftSide}
                </div>
                <div className={style.pullRight}>
                    {filterElements.map((el, i) => {
                        let incrementNum = (el.type === filterElementTypes.datePickerBetween || el.type === filterElementTypes.dateTimePickerBetween) ? 2 : 1; // datePicker has two input fields
                        filtersNumber += incrementNum;
                        if (filtersNumber > this.props.maxVisibleInputs) {
                            return null;
                        } else {
                            return (
                                <div key={i} className={classnames(style.toolbarElement, style.minWidthed)} style={el.styles}>
                                    {this.renderFilter(el)}
                                </div>
                            );
                        }
                    })}
                    {this.renderAdvanced()}
                    {!this.state.showFiltersPopup && !this.props.filterAutoFetch && Object.keys(this.state.filters).length > 0 && <StandardButton onClick={this.applyFilters} styleType='secondaryLight' label='Apply Search' className={style.toolbarElement} />}
                    {this.state.hasActiveFilters && <div onClick={() => { this.setState({filters: {}}); this.props.clearFilters(); }} className={classnames(style.toolbarElement, style.closeArrow)} />}
                </div>
            </div>
        );
    }

    applyFilters() {
        let result = {};
        Object.keys(this.state.filters).forEach((objKey) => {
            let objectKey = this.state.filters[objKey];
            if (objectKey === dropDrownAllOptionKey || objectKey === dropDrownPlaceholderOptionKey) {
                result[objKey] = '';
            } else {
                result[objKey] = objectKey;
            }
        });

        this.props.batchChange(result);
        this.setState({filters: {}});
    }

    renderActionButton(actionButtonElement, index) {
        // Check if button can be clicked when multimple items are checked
        let isSingleSelected = actionButtonElement.clickFunctionality === actionButtonClickFunctionality.singleSelect;
        let isDisabled = actionButtonElement.isDisabled; // false
        if (!isDisabled && isSingleSelected && this.props.checked.size >= 2) {
            isDisabled = true;
        }

        switch (actionButtonElement.type) {
            case actionButtonElementTypes.link:
                if (isDisabled) {
                    return <Button disabled className={classnames('button', style.button)}>{actionButtonElement.label}</Button>;
                } else {
                    return (
                        <Link to={actionButtonElement.path}><Button className={classnames('button', style.button)}>{actionButtonElement.label}</Button></Link>
                    );
                }
            case actionButtonElementTypes.button:
                return (
                    <Button disabled={isDisabled} onClick={actionButtonElement.onClick} className={classnames('button', style.button)}>{actionButtonElement.label}</Button>
                );
            case actionButtonElementTypes.buttonWithConfirmPopUp:
                let handleButtonClick = () => this.refs['confirmDialog-' + index].open();
                return (
                    <div>
                        <ConfirmDialog
                          ref={'confirmDialog-' + index}
                          cancelLabel={actionButtonElement.confirmDialog.cancelLabel}
                          submitLabel={actionButtonElement.confirmDialog.submitLabel}
                          title={actionButtonElement.confirmDialog.title}
                          message={actionButtonElement.confirmDialog.message}
                          onSubmit={actionButtonElement.onClick}
                          cannotSubmit={actionButtonElement.confirmDialog.cannotSubmit}
                        />
                        <Button disabled={isDisabled} onClick={handleButtonClick} className={classnames('button', style.button)}>{actionButtonElement.label}</Button>
                    </div>
                );
            case actionButtonElementTypes.buttonWithPopUpsDependingOnProperty:
                let propStatus = this.propStatus(actionButtonElement.property, actionButtonElement.selectProperty);
                let buttonLabel = propStatus.status ? actionButtonElement.oppositeLabel : actionButtonElement.label;
                let handleAction = () => {
                    if (propStatus.canDoAction) {
                        this.refs['confirmDialog-' + index].open();
                    } else {
                        this.refs['errorDialog-' + index].open();
                    }
                };

                return (
                    <div>
                        <ConfirmDialog
                          ref={'confirmDialog-' + index}
                          cancelLabel={actionButtonElement.confirmDialog.cancelLabel}
                          submitLabel={actionButtonElement.confirmDialog.submitLabel}
                          title={actionButtonElement.confirmDialog.title}
                          message={actionButtonElement.confirmDialog.message}
                          onSubmit={actionButtonElement.onClick}
                          cannotSubmit={actionButtonElement.confirmDialog.cannotSubmit}
                        />
                        <ConfirmDialog
                          ref={'errorDialog-' + index}
                          cancelLabel={actionButtonElement.errorDialog.cancelLabel}
                          submitLabel=''
                          title={actionButtonElement.errorDialog.title}
                          message={actionButtonElement.errorDialog.message}
                          cannotSubmit={actionButtonElement.errorDialog.cannotSubmit}
                        />
                        <Button disabled={isDisabled} onClick={handleAction} className={classnames('button', style.button)}>{buttonLabel}</Button>
                    </div>
                );
            case actionButtonElementTypes.buttonWithPopUpsDependingOnPropertyValue:
                let canDoAction = true;

                if (this.props.checked.size > 0) {
                    for (let checkedItem of this.props.checked) {
                        if (!checkedItem.get(actionButtonElement.property)) {
                            canDoAction = false;
                            break;
                        }
                    }
                } else {
                    let selected = this.props.selected;
                    canDoAction = selected.getIn(actionButtonElement.property) || selected.get(actionButtonElement.selectProperty);
                }

                let handleActionDependingOnPropertyValue = () => {
                    if (canDoAction) {
                        this.refs['confirmDialog-' + index].open();
                    } else {
                        this.refs['errorDialog-' + index].open();
                    }
                };

                return (
                    <div>
                        <ConfirmDialog
                          ref={'confirmDialog-' + index}
                          cancelLabel={actionButtonElement.confirmDialog.cancelLabel}
                          submitLabel={actionButtonElement.confirmDialog.submitLabel}
                          title={actionButtonElement.confirmDialog.title}
                          message={actionButtonElement.confirmDialog.message}
                          onSubmit={actionButtonElement.onClick}
                          cannotSubmit={actionButtonElement.confirmDialog.cannotSubmit}
                        />
                        <ConfirmDialog
                          ref={'errorDialog-' + index}
                          cancelLabel={actionButtonElement.errorDialog.cancelLabel}
                          submitLabel=''
                          title={actionButtonElement.errorDialog.title}
                          message={actionButtonElement.errorDialog.message}
                          cannotSubmit={actionButtonElement.errorDialog.cannotSubmit}
                        />
                        <Button disabled={isDisabled} onClick={handleActionDependingOnPropertyValue} className={classnames('button', style.button)}>{actionButtonElement.label}</Button>
                    </div>
                );
            case actionButtonElementTypes.buttonWithMultipleDialogs:
                let dialogs = actionButtonElement.dialogs.map((dialog, i) => {
                    return (
                        <ConfirmDialog key={i}
                          ref={'dialog-' + dialog.identifier}
                          cancelLabel={dialog.cancelLabel}
                          submitLabel={dialog.submitLabel}
                          title={dialog.title}
                          message={dialog.message}
                          onSubmit={dialog.onSubmit}
                          cannotSubmit={dialog.cannotSubmit}
                        />
                    );
                });

                return (
                    <div>
                        {dialogs}
                        <Button disabled={isDisabled} onClick={actionButtonElement.onClick} className={classnames('button', style.button)}>{actionButtonElement.label}</Button>
                    </div>
                );
        }
    }

    openRefDialogWithMessage({ identifier, message }) { // this function is called from outside using refs
        this.refs['dialog-' + identifier].open(message);
    }

    propStatus(property, selectProperty) {
        let { selected, checked } = this.props;

        let canDoAction = true;
        let status = null;

        if (checked.size > 0) {
            for (let checkedItem of checked) {
                if (status !== null && status !== checkedItem.get(property)) {
                    canDoAction = false;
                    break;
                }
                status = checkedItem.get(property);
            }
        } else {
            status = selected.getIn(selectProperty) || selected.get(property);
        }

        return {canDoAction, status: !status};
    }

    renderActionButtons() {
        let toggle = () => this.setState({showFilters: true});

        return (
            <div className={style.toolbarWrap}>

                <div className={classnames(style.toolbarElement, style.label, style.link)} onClick={toggle}>
                    Show filters
                </div>

                <div className={style.pullRight}>
                    {this.props.actionButtonElements.map((el, i) => {
                        return (
                            <div key={i} className={style.leftFloat}>
                                {this.renderActionButton(el, i)}
                            </div>
                        );
                    })}
                </div>

            </div>
        );
    }

    render() {
        let showFilter = this.state.showFilters;

        return (
            <div>
                {showFilter && this.renderFilters()}
                {!showFilter && this.renderActionButtons()}
            </div>
        );
    }
}

GridToolBox.propTypes = {
    filterElements: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.oneOf([
                filterElementTypes.dropDown,
                filterElementTypes.searchBox,
                filterElementTypes.datePickerBetween,
                filterElementTypes.dateTimePickerBetween,
                filterElementTypes.clear
            ]).isRequired,
            // Common
            placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
            defaultValue: PropTypes.any,

            // DropDown
            data: PropTypes.arrayOf(
                PropTypes.shape({
                    disabled: PropTypes.bool,
                    header: PropTypes.bool,
                    selected: PropTypes.bool
                })
            ),
            customTheme: PropTypes.bool,
            canSelectPlaceholder: PropTypes.bool,
            onSelect: PropTypes.func,
            // SearchBox
            onSearch: PropTypes.func,
            // Optional
            styles: PropTypes.object
        })
    ),
    actionButtonElements: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.oneOf([
                actionButtonElementTypes.link,
                actionButtonElementTypes.button,
                actionButtonElementTypes.buttonWithConfirmPopUp,
                actionButtonElementTypes.buttonWithPopUpsDependingOnProperty,
                actionButtonElementTypes.buttonWithMultipleDialogs
            ]),
            // Common
            label: PropTypes.string.isRequired,
            // Determines if the button can be clicked when multiple items are checked. If not passed by default it is multiSelect
            clickFunctionality: PropTypes.oneOf([actionButtonClickFunctionality.singleSelect, actionButtonClickFunctionality.multiSelect]),
            l: PropTypes.bool,

            // Link
            path: PropTypes.string,
            // Buttons
            onClick: PropTypes.func,
            // Button with confirm pop up
            confirmDialog: PropTypes.shape({
                cancelLabel: PropTypes.string,
                submitLabel: PropTypes.string,
                title: PropTypes.string,
                message: PropTypes.string,
                cannotSubmit: PropTypes.bool
            }),
            // Button with pop ups depending on property (true/false)
            oppositeLabel: PropTypes.string,
            propery: PropTypes.string,
            selectProperty: PropTypes.oneOfType([PropTypes.string, PropTypes.array]), // required only if checked and select properties are different
            errorDialog: PropTypes.shape({
                cancelLabel: PropTypes.string,
                title: PropTypes.string,
                message: PropTypes.string,
                cannotSubmit: PropTypes.bool
            }),
            // buttonWithMultipleDialogs
            dialogs: PropTypes.arrayOf(
                PropTypes.shape({
                    identifier: PropTypes.string,
                    cancelLabel: PropTypes.string,
                    submitLabel: PropTypes.string,
                    title: PropTypes.string,
                    message: PropTypes.string,
                    cannotSubmit: PropTypes.bool,
                    onSubmit: PropTypes.func
                })
            )
        })
    ),
    maxVisibleInputs: PropTypes.number,
    showAdvanced: PropTypes.bool,
    filterAutoFetch: PropTypes.bool,
    clearFilters: PropTypes.func,
    selected: PropTypes.object.isRequired, // immutable
    checked: PropTypes.object.isRequired, // immutable list
    batchChange: PropTypes.func
};

GridToolBox.defaultProps = {
    maxVisibleInputs: 4,
    showAdvanced: false,
    filterAutoFetch: true,
    clearFilters: () => {},
    batchChange: () => {},
    selected: Immutable.Map({}),
    checked: Immutable.List()
};

export default GridToolBox;
