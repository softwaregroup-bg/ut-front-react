import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Immutable from 'immutable';
import { filterElementTypes, actionButtonElementTypes, actionButtonClickFunctionality } from './types';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import Dropdown from '../Input/Dropdown';
import Input from '../Input/TextField';
import SearchBox from '../SearchBox';
import AdvancedSearchButton from '../AdvancedSearchButton';
import DatePicker from './../DatePicker/Simple';
import DatePickerBetween from './../DatePicker/Between';
import DateTimePickerBetween from '../DateTimePicker/Between';
import ConfirmDialog from '../ConfirmDialog';
import StandardDialog from '../Popup';
import Button from '../StandardButton';
import ByCustomSearch from '../Filters/ByCustomSearch';
import Text from '../Text';

import classnames from 'classnames';
import style from './style.css';
import cssStandard from '../../assets/index.css';

const dropDrownAllOptionKey = '__all__';
const dropDrownPlaceholderOptionKey = '__placeholder__';

const defaultTimeFormat = 'HH:mm';
const defaultDateFormat = 'yyyy-MM-dd';

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
        const showFilters = (selected.size === 0 && checked.size === 0);
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
                    if (filter.defaultValue) {
                        if (!filter.initialValue) {
                            hasValue = !!(filter.defaultValue.from || filter.defaultValue.to);
                        } else {
                            hasValue = (filter.defaultValue.from !== filter.initialValue.from) || (filter.defaultValue.to !== filter.initialValue.to);
                        }
                    }
                    break;
                case filterElementTypes.dropDown:
                    hasValue = !!(filter.defaultValue &&
                        filter.defaultValue !== dropDrownAllOptionKey &&
                        filter.defaultValue !== dropDrownPlaceholderOptionKey &&
                        filter.defaultValue !== filter.initialValue);
                    break;
                case filterElementTypes.customSearch:
                    hasValue = !!filter.value;
                    break;
                default:
                    hasValue = !!filter.defaultValue && filter.defaultValue !== filter.initialValue;
                    break;
            }

            foundActiveFilter = foundActiveFilter || hasValue;
        });

        this.setState({hasActiveFilters: foundActiveFilter});
    }

    hasSelectedOrChecked() {
        const { selected, checked } = this.props;

        return selected.size > 0 || checked.size > 0;
    }

    renderFilter(filterElement, renderInDialog = false) {
        const { filterAutoFetch, customStyles } = this.props;
        const { filters, showFiltersPopup } = this.state;

        const onChange = (key, value) => {
            filters[key] = value;
            this.setState({filters});
        };

        let filterValue;

        if (filterElement.type === filterElementTypes.datePickerBetween || filterElement.type === filterElementTypes.dateTimePickerBetween) {
            filterValue = {
                from: Object.prototype.hasOwnProperty.call(filters, filterElement.name && filterElement.name.from)
                    ? filters[filterElement.name.from]
                    : filterElement.defaultValue.from,
                to: Object.prototype.hasOwnProperty.call(filters, filterElement.name && filterElement.name.to)
                    ? filters[filterElement.name.to]
                    : filterElement.defaultValue.to
            };
        } else {
            filterValue = (Object.prototype.hasOwnProperty.call(filters, filterElement.name))
                ? filters[filterElement.name]
                : filterElement.defaultValue;
        }

        if (showFiltersPopup && !renderInDialog) {
        // dont change values in the background when advanced is open
            filterValue = filterElement.defaultValue;
        }

        const label = renderInDialog
            ? filterElement.label
            : null;

        function onSelect(obj) {
            onChange(filterElement.name, obj.value);
        }

        function onChangeHandler(e) {
            onChange(filterElement.name, e.target.value);
        }

        function onChangeCustomSearch(value) {
            onChange(filterElement.type, {field: filterElement.field, value});
        }

        function onChangeBetween(obj) {
            onChange(filterElement.name[obj.key], obj.value);
        }

        switch (filterElement.type) {
            case filterElementTypes.dropDown:
                return (
                    <Dropdown
                        label={label}
                        boldLabel={renderInDialog}
                        data={filterElement.data}
                        customTheme
                        placeholder={filterElement.placeholder}
                        placeholderValue={filterElement.placeholderValue}
                        defaultSelected={filterValue}
                        onSelect={filterAutoFetch && !renderInDialog
                            ? filterElement.onSelect
                            : onSelect}
                        canSelectPlaceholder={filterElement.canSelectPlaceholder}
                        mergeStyles={customStyles}
                    />
                );
            case filterElementTypes.searchBox:
                return (filterAutoFetch && !renderInDialog)
                    ? (<div>
                        <SearchBox
                            defaultValue={filterValue}
                            placeholder={filterElement.placeholder}
                            onSearch={filterElement.onSearch}
                        />
                    </div>)
                    : (<div>
                        <Input
                            label={label}
                            value={filterValue || ''}
                            placeholder={filterElement.placeholder}
                            onChange={onChangeHandler}
                        />
                    </div>);
            case filterElementTypes.datePicker:
                return (<div>
                    <DatePicker
                        onChange={filterAutoFetch && !renderInDialog
                            ? filterElement.onChange
                            : onSelect}
                        withVerticalClass={renderInDialog}
                        locale={filterElement.locale}
                        defaultValue={filterValue}
                        label={filterElement.label}
                        boldLabel={renderInDialog}
                        maxDate={filterElement.maxDate}
                    />
                </div>);

            case filterElementTypes.datePickerBetween:
                return (<div>
                    <DatePickerBetween
                        onChange={filterAutoFetch && !renderInDialog
                            ? filterElement.onChange
                            : onChangeBetween}
                        withVerticalClass={renderInDialog}
                        defaultValue={filterValue}
                        dateFormat={filterElement.dateFormat || defaultDateFormat}
                        transformDate={filterElement.transformDate}
                        locale={filterElement.locale}
                        masterLabel={filterElement.masterLabel}
                        labelFrom={filterElement.labelFrom}
                        labelTo={filterElement.labelTo}
                        boldLabel={renderInDialog}
                        maxDate={filterElement.maxDate}
                    />
                </div>);
            case filterElementTypes.dateTimePickerBetween:
                return (<div>
                    <DateTimePickerBetween
                        onChange={filterAutoFetch && !renderInDialog
                            ? filterElement.onChange
                            : onChangeBetween}
                        withVerticalClass={renderInDialog}
                        defaultValue={filterValue}
                        timeFormat={filterElement.timeFormat || defaultTimeFormat}
                        dateFormat={filterElement.dateFormat || defaultDateFormat}
                        transformDate={filterElement.transformDate}
                        transformTime={filterElement.transformTime}
                        locale={filterElement.locale}
                        labelFrom={filterElement.labelFrom}
                        labelTo={filterElement.labelTo}
                        boldLabel={renderInDialog}
                        maxDate={filterElement.maxDate}
                        dateTimeCombined={filterElement.dateTimeCombined}
                    />
                </div>);
            case filterElementTypes.customSearch:
                return (<div>
                    <ByCustomSearch
                        fields={filterElement.fields}
                        defaultField={filterElement.defaultField}
                        setField={filterElement.setField}
                        setValue={renderInDialog ? onChangeCustomSearch : filterElement.setValue}
                        field={filterElement.field}
                        value={filterElement.value}
                        placeholder={filterElement.placeholder}
                        forbidInstantSearch={renderInDialog}
                    />
                </div>);
            default:
                return null;
        }
    }

    getDefaultValuesFromProps() {
        const { filterElements } = this.props;
        const defaultValues = {};

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
        const {showFiltersPopup} = this.state;

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
        const { filterElements } = this.props;

        const content = [];

        filterElements.forEach((filter, idx) => {
            switch (filter.type) {
                case filterElementTypes.datePickerBetween:
                case filterElementTypes.dateTimePickerBetween: {
                    const timeFormat = filter.timeFormat || defaultTimeFormat;
                    const dateFormat = filter.dateFormat || defaultDateFormat;

                    Object.keys(filter.defaultValue).forEach(key => {
                        if (!filter.defaultValue[key]) {
                            return;
                        }

                        const date = new Date(filter.defaultValue[key]);
                        let dateValue;
                        let timeValue;

                        if (filter.transformDate) {
                            dateValue = filter.transformDate(date, dateFormat, filter.locale);
                        } else {
                            dateValue = date.toISOString();
                        }
                        if (filter.transformTime) {
                            timeValue = filter.transformTime(date, timeFormat, filter.locale);
                        } else {
                            timeValue = date.toISOString().substr(11, 5);
                        }

                        let value = dateValue;

                        if (filter.type === filterElementTypes.dateTimePickerBetween) {
                            value = `${value} ${timeValue}`;
                        }

                        key = `label${key.charAt(0).toUpperCase() + key.slice(1)}`;

                        content.push(<div key={idx + key}>
                            <span className={style.bold}>{filter[key]}: </span>
                            <span> {value} </span>
                        </div>);
                    });
                    break;
                }
                case filterElementTypes.dropDown:
                    if (filter.defaultValue && filter.defaultValue !== dropDrownAllOptionKey && filter.defaultValue !== dropDrownPlaceholderOptionKey) {
                        const obj = filter.data.filter((dropdownItem) => {
                            if (filter.defaultValue === dropdownItem.key) {
                                return true;
                            }
                        });

                        content.push(<div key={idx}>
                            <span className={style.bold}>{filter.label}: </span>
                            <span>{obj[0].name}</span>
                        </div>);
                    }
                    break;
                default:
                    if (filter.defaultValue) {
                        content.push(<div key={idx}>
                            <span className={style.bold}>{filter.label}: </span>
                            <span>{filter.defaultValue}</span>
                        </div>);
                    }
                    break;
            }
        });

        return content;
    }

    getInputsCount() {
        const { filterElements } = this.props;

        const count = filterElements.reduce((previousValue, currentValue) => {
            switch (currentValue.type) {
                case filterElementTypes.datePickerBetween:
                case filterElementTypes.dateTimePickerBetween:
                    return previousValue + 2;
                case filterElementTypes.searchBtn:
                    return previousValue;
                default:
                    return previousValue + 1;
            }
        }, 0);

        return count;
    }

    renderAdvancedButton() {
        const tooltipContent = this.getTooltip();
        const el = <div key='toggleAdv' className={classnames(style.toolbarElement, style.tableCell, style.advancedSearchIconWrapper)}>
            <AdvancedSearchButton onClick={this.toggleAdvancedSearch} />
            {tooltipContent.length ? <div className={style.advancedSearchPopOver}>
                {tooltipContent}
            </div> : null}
        </div>;

        return el;
    }

    renderAdvancedSearchDialog() {
        if (!this.state.showFiltersPopup) {
            return;
        }

        const apply = () => {
            this.applyFilters();
            this.toggleAdvancedSearch();
        };

        const actionButtons = [
            {label: 'Apply Search', onClick: apply, styleType: 'primaryDialog'},
            {label: 'Cancel', onClick: this.toggleAdvancedSearch, styleType: 'secondaryDialog'}
        ];

        return <StandardDialog
            closePopup={this.toggleAdvancedSearch}
            header={{text: 'Advanced Search'}}
            isOpen={this.state.showFiltersPopup}
            footer={{actionButtons}}
        >
            {this.props.filterElements.map((el, i) => {
                const filter = this.renderFilter(el, true);
                return filter && (
                    <div key={i} className={classnames(style.advancedSearchInputWrapper, this.props.stylesPopup)}>
                        {filter}
                    </div>
                );
            })}
        </StandardDialog>;
    }

    renderAdvanced() {
        const { maxVisibleInputs, showAdvanced } = this.props;
        const count = this.getInputsCount();
        if (count > maxVisibleInputs || showAdvanced) {
            const advancedSearchBtn = this.renderAdvancedButton();
            const advancedDialog = this.renderAdvancedSearchDialog();

            return (
                <div className={classnames(style.toolbarElement, style.tableCell)}>
                    {advancedSearchBtn}
                    {advancedDialog}
                </div>
            );
        }
    }

    renderFilters() {
        const { filterElements, filterActionElements } = this.props;

        const hasSelectedOrChecked = this.hasSelectedOrChecked();

        const labelClass = hasSelectedOrChecked ? style.link : '';
        const toggle = () => hasSelectedOrChecked && this.setState({showFilters: false});
        let filtersNumber = 0;
        let leftSide;
        if (filterElements.length === 1 && filterElements[0].type === filterElementTypes.searchBox) {
            leftSide = hasSelectedOrChecked ? <span className={style.link}><Text>Show buttons</Text></span> : <Text>Filter by:</Text>;
        } else {
            leftSide = hasSelectedOrChecked ? <span className={style.link}><Text>Show buttons</Text></span> : <Text>Filter by:</Text>;
        }

        const showSearchBtn = (this.props.filterElements.find(f => {
            return f.type === filterElementTypes.searchBtn;
        }) !== undefined) || (!this.state.showFiltersPopup && !this.props.filterAutoFetch && Object.keys(this.state.filters).length > 0);

        return (
            <div className={classnames(style.toolbarWrap, style.table, style.fixedHeight)}>
                <div className={classnames(style.toolbarElement, style.label, labelClass, style.tableCell)} onClick={toggle}>
                    {leftSide}
                </div>
                <div className={classnames(style.pullRight, style.tableCell)}>
                    <div className={classnames(style.toolbarElementsContainer, style.fixedHeight)}>
                        {filterElements.map((el, i) => {
                            const incrementNum = (el.type === filterElementTypes.datePickerBetween || el.type === filterElementTypes.dateTimePickerBetween) ? 2 : 1; // datePicker has two input fields
                            filtersNumber += incrementNum;
                            if (filtersNumber <= this.props.maxVisibleInputs) {
                                const filter = this.renderFilter(el);
                                return filter && (
                                    <div key={i} className={classnames(style.toolbarElement, style.tableCell)} style={el.styles}>
                                        <div className={style.minWidthed}>
                                            {filter}
                                        </div>
                                    </div>
                                );
                            }
                        })}
                        {this.renderAdvanced()}
                        {showSearchBtn &&
                            <div key='searchBtn' className={classnames(style.toolbarElement, style.tableCell)}>
                                <div onClick={this.applyFilters} className={style.searchIcon} />
                            </div>}
                        {this.state.hasActiveFilters &&
                            <div className={classnames(style.toolbarElement, style.tableCell)}>
                                <div title='Clear Filters' key='clearFilters' onClick={() => { this.setState({filters: {}}); this.props.clearFilters(); }} className={style.closeArrow} />
                            </div>}
                    </div>
                </div>
                {filterActionElements && <div className={style.filterActionWrap}> {filterActionElements} </div>}
            </div>
        );
    }

    applyFilters() {
        let filtersOverride;
        if (this.props.filtersOverride) {
            filtersOverride = this.props.filtersOverride(this.state.filters);
        }
        const result = {};
        Object.entries(this.state.filters).forEach(([key, value]) => {
            if (value === dropDrownAllOptionKey || value === dropDrownPlaceholderOptionKey) {
                result[key] = '';
            } else {
                const override = filtersOverride?.[key]?.[value];
                switch (typeof override) {
                    case 'undefined':
                        if (typeof value === 'object' && filtersOverride && filtersOverride[key]) {
                            filtersOverride[key].forEach(el => {
                                result[el.key] = el.value;
                            });
                        } else {
                            result[key] = value;
                        }
                        break;
                    case 'object':
                        result[override.key || key] = (override.value !== null && override.value !== undefined) ? override.value : override;
                        break;
                    default:
                        result[key] = override;
                }
            }
        });

        this.props.batchChange(result);
        this.setState({filters: {}});
    }

    renderActionButton(actionButtonElement, index) {
        // Check if button can be clicked when multimple items are checked
        const isSingleSelected = actionButtonElement.clickFunctionality === actionButtonClickFunctionality.singleSelect;
        let isDisabled = actionButtonElement.isDisabled; // false
        if (!isDisabled && isSingleSelected && this.props.checked.size >= 2) {
            isDisabled = true;
        }

        switch (actionButtonElement.type) {
            case actionButtonElementTypes.link:
                if (isDisabled) {
                    return <Button disabled styleType='primaryLight' label={actionButtonElement.label} />;
                } else {
                    return (
                        <Link to={actionButtonElement.path}><Button styleType='primaryLight' label={actionButtonElement.label} /></Link>
                    );
                }
            case actionButtonElementTypes.button:
                return (
                    <Button disabled={isDisabled} onClick={actionButtonElement.onClick} styleType='primaryLight' label={actionButtonElement.label} />
                );
            case actionButtonElementTypes.buttonWithConfirmPopUp: {
                const handleButtonClick = () => this['confirmDialog-' + index].open();
                return (
                    <div>
                        <ConfirmDialog
                            ref={(c) => { this[`confirmDialog-${index}`] = c; }}
                            cancelLabel={actionButtonElement.confirmDialog.cancelLabel}
                            submitLabel={actionButtonElement.confirmDialog.submitLabel}
                            title={actionButtonElement.confirmDialog.title}
                            message={actionButtonElement.confirmDialog.message}
                            onSubmit={actionButtonElement.onClick}
                            cannotSubmit={actionButtonElement.confirmDialog.cannotSubmit}
                        />
                        <Button disabled={isDisabled} onClick={handleButtonClick} styleType='primaryLight' label={actionButtonElement.label} />
                    </div>
                );
            }
            case actionButtonElementTypes.buttonWithPopUpsDependingOnProperty: {
                const propStatus = this.propStatus(actionButtonElement.property, actionButtonElement.selectProperty);
                const buttonLabel = propStatus.status ? actionButtonElement.oppositeLabel : actionButtonElement.label;
                const handleAction = () => {
                    if (propStatus.canDoAction) {
                        this['confirmDialog-' + index].open();
                    } else {
                        this['errorDialog-' + index].open();
                    }
                };

                return (
                    <div>
                        <ConfirmDialog
                            ref={(c) => { this[`confirmDialog-${index}`] = c; }}
                            cancelLabel={actionButtonElement.confirmDialog.cancelLabel}
                            submitLabel={actionButtonElement.confirmDialog.submitLabel}
                            title={actionButtonElement.confirmDialog.title}
                            message={actionButtonElement.confirmDialog.message}
                            onSubmit={actionButtonElement.onClick}
                            cannotSubmit={actionButtonElement.confirmDialog.cannotSubmit}
                        />
                        <ConfirmDialog
                            ref={(c) => { this[`errorDialog-${index}`] = c; }}
                            cancelLabel={actionButtonElement.errorDialog.cancelLabel}
                            submitLabel=''
                            title={actionButtonElement.errorDialog.title}
                            message={actionButtonElement.errorDialog.message}
                            cannotSubmit={actionButtonElement.errorDialog.cannotSubmit}
                        />
                        <Button disabled={isDisabled} onClick={handleAction} styleType='primaryLight' label={buttonLabel} />
                    </div>
                );
            }
            case actionButtonElementTypes.buttonWithPopUpsDependingOnPropertyValue: {
                let canDoAction = true;

                if (this.props.checked.size > 0) {
                    for (const checkedItem of this.props.checked) {
                        if (!checkedItem.get(actionButtonElement.property)) {
                            canDoAction = false;
                            break;
                        }
                    }
                } else {
                    const selected = this.props.selected;
                    canDoAction = selected.getIn(actionButtonElement.property) || selected.get(actionButtonElement.selectProperty);
                }

                const handleActionDependingOnPropertyValue = () => {
                    if (canDoAction) {
                        this['confirmDialog-' + index].open();
                    } else {
                        this['errorDialog-' + index].open();
                    }
                };

                return (
                    <div>
                        <ConfirmDialog
                            ref={(c) => { this[`confirmDialog-${index}`] = c; }}
                            cancelLabel={actionButtonElement.confirmDialog.cancelLabel}
                            submitLabel={actionButtonElement.confirmDialog.submitLabel}
                            title={actionButtonElement.confirmDialog.title}
                            message={actionButtonElement.confirmDialog.message}
                            onSubmit={actionButtonElement.onClick}
                            cannotSubmit={actionButtonElement.confirmDialog.cannotSubmit}
                        />
                        <ConfirmDialog
                            ref={(c) => { this[`errorDialog-${index}`] = c; }}
                            cancelLabel={actionButtonElement.errorDialog.cancelLabel}
                            submitLabel=''
                            title={actionButtonElement.errorDialog.title}
                            message={actionButtonElement.errorDialog.message}
                            cannotSubmit={actionButtonElement.errorDialog.cannotSubmit}
                        />
                        <Button disabled={isDisabled} onClick={handleActionDependingOnPropertyValue} styleType='primaryLight' label={actionButtonElement.label} />
                    </div>
                );
            }
            case actionButtonElementTypes.buttonWithMultipleDialogs: {
                const dialogs = actionButtonElement.dialogs.map((dialog, i) => {
                    return (
                        <ConfirmDialog
                            key={i}
                            ref={(c) => { this[`dialog-${dialog.identifier}`] = c; }}
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
                        <Button disabled={isDisabled} onClick={actionButtonElement.onClick} styleType='primaryLight' label={actionButtonElement.label} />
                    </div>
                );
            }
        }
    }

    openRefDialogWithMessage({ identifier, message }) { // this function is called from outside using refs
        this['dialog-' + identifier].open(message);
    }

    propStatus(property, selectProperty) {
        const { selected, checked } = this.props;

        let canDoAction = true;
        let status = null;

        if (checked.size > 0) {
            for (const checkedItem of checked) {
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
        const { showActionButtonsOnSelect } = this.props;
        const toggle = () => this.setState({showFilters: true});

        return (
            <div className={classnames(style.toolbarWrap, style.table, style.fixedHeight, style.tableButtonsShowed)}>
                {!showActionButtonsOnSelect ? <div className={classnames(style.toolbarElement, style.label, style.link, style.tableCell)} onClick={toggle}>
                    <Text>Show filters</Text>
                </div> : null}
                <div className={classnames(style.pullRight, style.tableCell)}>
                    <div className={classnames(style.table, style.fixedHeight)}>
                        {this.props.actionButtonElements.map((el, i) => {
                            return (
                                <div key={i} className={classnames(style.tableCell, style.spacer)}>
                                    {this.renderActionButton(el, i)}
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        );
    }

    render() {
        const showFilter = this.state.showFilters;
        const { showActionButtonsOnSelect, selected } = this.props;

        if (showActionButtonsOnSelect && selected && selected.size) {
            return (
                <div>
                    {this.renderActionButtons()}
                </div>
            );
        }

        if (!this.props.cssStandard) {
            return (
                <div>
                    {showFilter && this.renderFilters()}
                    {!showFilter && this.renderActionButtons()}
                </div>
            );
        }
        return (
            <div className={classnames(cssStandard.actionBarWrap, this.props.classes.paper)}>
                <div className={cssStandard.gridToolboxWrap}>
                    {showFilter && this.renderFilters()}
                    {!showFilter && this.renderActionButtons()}
                </div>
            </div>
        );
    }
}

GridToolBox.propTypes = {
    classes: PropTypes.object,
    cssStandard: PropTypes.bool,
    filterElements: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.oneOf([
                filterElementTypes.dropDown,
                filterElementTypes.searchBox,
                filterElementTypes.datePicker,
                filterElementTypes.datePickerBetween,
                filterElementTypes.dateTimePickerBetween,
                filterElementTypes.customSearch,
                filterElementTypes.clear,
                filterElementTypes.searchBtn
            ]).isRequired,
            // Common
            placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
            defaultValue: PropTypes.any,
            maxDate: PropTypes.string,
            dateTimeCombined: PropTypes.bool,

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
    filterActionElements: PropTypes.node,
    actionButtonElements: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.oneOf([
                actionButtonElementTypes.link,
                actionButtonElementTypes.button,
                actionButtonElementTypes.buttonWithConfirmPopUp,
                actionButtonElementTypes.buttonWithPopUpsDependingOnProperty,
                actionButtonElementTypes.buttonWithPopUpsDependingOnPropertyValue,
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
    batchChange: PropTypes.func,
    showActionButtonsOnSelect: PropTypes.func,
    filtersOverride: PropTypes.func,
    // Optional
    stylesPopup: PropTypes.object,
    customStyles: PropTypes.object
};

GridToolBox.defaultProps = {
    cssStandard: false,
    maxVisibleInputs: 4,
    showAdvanced: false,
    filterAutoFetch: true,
    clearFilters: () => {},
    batchChange: () => {},
    selected: Immutable.Map({}),
    checked: Immutable.List(),
    showActionButtonsOnSelect: false
};

export default withStyles(({palette}) => ({
    paper: {
        borderBottom: `1px solid ${palette.divider}`,
        background: palette.background.paper
    }
}))(GridToolBox);
