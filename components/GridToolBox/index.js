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
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
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
    }

    componentWillMount() {
        this.checkActiveFilters(this.props.filterElements);
    }

    componentWillReceiveProps({ selected, checked, filterElements }) {
        if (selected.size === 0 && checked.size === 0) {
            this.setState({ showFilters: true });
        } else {
            this.setState({ showFilters: false });
        }
        this.checkActiveFilters(filterElements);
    }

    checkActiveFilters(filterElements = []) {
        let foundActiveFilter = false;
        for (var i = 0; i < filterElements.length && !foundActiveFilter; i += 1) {
            let currenctFilterElement = filterElements[i];
            if (currenctFilterElement.type === filterElementTypes.datePickerBetween || currenctFilterElement.type === filterElementTypes.dateTimePickerBetween) {
                if (currenctFilterElement.defaultValue.from || currenctFilterElement.defaultValue.to) {
                    foundActiveFilter = true;
                }
            } else if (currenctFilterElement.type === filterElementTypes.dropDown) {
                if (currenctFilterElement.defaultValue && currenctFilterElement.defaultValue !== dropDrownAllOptionKey && currenctFilterElement.defaultValue !== dropDrownPlaceholderOptionKey) {
                    foundActiveFilter = true;
                }
            } else if (currenctFilterElement.defaultValue) {
                foundActiveFilter = true;
            }
        }

        if (foundActiveFilter) {
            this.setState({hasActiveFilters: true});
        } else {
            this.setState({hasActiveFilters: false});
        }
    }

    haveSelectedOrChecked() {
        return this.props.selected.size > 0 || this.props.checked.size > 0;
    }

    renderFilter(filterElement) {
        switch (filterElement.type) {
            case filterElementTypes.dropDown:
                return (
                    <Dropdown
                      data={filterElement.data}
                      customTheme
                      placeholder={filterElement.placeholder}
                      defaultSelected={filterElement.defaultValue}
                      onSelect={filterElement.onSelect}
                      canSelectPlaceholder={filterElement.canSelectPlaceholder} />
                );
            case filterElementTypes.searchBox:
                return (
                    <div>
                        <SearchBox
                          defaultValue={filterElement.defaultValue}
                          placeholder={filterElement.placeholder}
                          onSearch={filterElement.onSearch} />
                    </div>
                );
            case filterElementTypes.datePickerBetween:
                return (
                    <div>
                        <DatePickerBetween
                          onChange={filterElement.onChange}
                          defaultValue={filterElement.defaultValue}
                          masterLabel={filterElement.masterLabel}
                          labelFrom={filterElement.labelFrom}
                          labelTo={filterElement.labelTo} />
                    </div>
                );
            case filterElementTypes.dateTimePickerBetween:
                let timeFormat = filterElement.timeFormat || defaultTimeFormat;
                let dateFormat = filterElement.dateFormat || defaultDateFormat;

                return (
                    <div>
                        <DateTimePickerBetween
                          onChange={filterElement.onChange}
                          defaultValue={filterElement.defaultValue}
                          timeFormat={timeFormat}
                          dateFormat={dateFormat}
                          locale={filterElement.locale}
                          labelFrom={filterElement.labelFrom}
                          labelTo={filterElement.labelTo} />
                    </div>
                );
            default:
                return <div />;
        }
    }
    getDefaultValuesFromProps() {
        let defaultValues = {};
        for (let filter of this.props.filterElements) {
            if (typeof filter.name === typeof {}) {
                Object.keys(filter.name).forEach(key => {
                    defaultValues[filter.name[key]] = filter.defaultValue[key];
                });
            } else {
                defaultValues[filter.name] = filter.defaultValue;
            }
        }
        return defaultValues;
    }
    toggleAdvancedSearch() {
        let defaultValues = this.getDefaultValuesFromProps();
        let showFiltersPopup = !this.state.showFiltersPopup;
        this.setState({showFiltersPopup, filters: defaultValues});
    }
    getTooltip() {
        let content = [];
        this.props.filterElements.forEach((filter) => {
            if (filter.type === filterElementTypes.datePickerBetween || filter.type === filterElementTypes.dateTimePickerBetween) {
                let timeFormat = filter.timeFormat || defaultTimeFormat;
                let dateFormat = filter.dateFormat || defaultDateFormat;

                if (filter.defaultValue.from) {
                    let date = new Date(filter.defaultValue.from);

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
                    content.push(<div key={generateUniqueId()}>
                        <span><span className={style.bold}>{filter.labelFrom}: </span> {value}</span>
                    </div>);
                }
                if (filter.defaultValue.to) {
                    let date = new Date(filter.defaultValue.to);

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
                    content.push(<div key={generateUniqueId()}>
                        <span><span className={style.bold}>{filter.labelTo}: </span> {value}</span>
                    </div>);
                }
            } else if (filter.type === filterElementTypes.dropDown) {
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
            } else if (filter.defaultValue) {
                content.push(<div key={generateUniqueId()}>
                    <span><span className={style.bold}>{filter.label}: </span> {filter.defaultValue}</span>
                </div>);
            }
        });
        return content;
    }
    renderFilterInPopup(filterElement) {
        let { filters } = this.state;

        let onChange = (key, value) => {
            filters[key] = value;
            this.setState({filters});
        };
        let value;
        switch (filterElement.type) {
            case filterElementTypes.dropDown:
                value = filters[filterElement.name];
                return (
                    <Dropdown
                      {...filterElement}
                      data={filterElement.data}
                    //   style={{color: '#0074ba'}}
                      customTheme
                      placeholder={filterElement.placeholder}
                      defaultSelected={value}
                      onSelect={function(obj) {
                          onChange(filterElement.name, obj.value);
                      }}
                      canSelectPlaceholder={filterElement.canSelectPlaceholder}
                      boldLabel
                    />
                );
            case filterElementTypes.searchBox:
                value = filters[filterElement.name];

                return (
                    <div>
                        <Input
                          label={filterElement.label}
                          defaultValue={value}
                          placeholder={filterElement.placeholder}
                          onChange={function(e) {
                              onChange(filterElement.name, e.target.value);
                          }} />
                    </div>
                );
            case filterElementTypes.datePickerBetween:
                value = {
                    from: filters[filterElement.name.from],
                    to: filters[filterElement.name.to]
                };
                return (
                    <div>
                        <DatePickerBetween
                          onChange={function(obj) {
                              onChange(filterElement.name[obj.key], obj.value);
                          }}
                          withVerticalClass
                          defaultValue={value}
                          masterLabel={filterElement.masterLabel}
                          labelFrom={filterElement.labelFrom}
                          labelTo={filterElement.labelTo} />
                    </div>
                );
            case filterElementTypes.dateTimePickerBetween:
                value = {
                    from: filters[filterElement.name.from],
                    to: filters[filterElement.name.to]
                };

                let timeFormat = filterElement.timeFormat || defaultTimeFormat;
                let dateFormat = filterElement.dateFormat || defaultDateFormat;

                return (
                    <div>
                        <DateTimePickerBetween
                          onChange={function(obj) {
                              onChange(filterElement.name[obj.key], obj.value);
                          }}
                          withVerticalClass
                          defaultValue={value}
                          timeFormat={timeFormat}
                          dateFormat={dateFormat}
                          locale={filterElement.locale}
                          labelFrom={filterElement.labelFrom}
                          labelTo={filterElement.labelTo}
                          boldLabel />
                    </div>
                );
            default:
                return <div />;
        }
    }
    getInputsCount() {
        let count = this.props.filterElements.reduce((previousValue, currentValue) => {
            if (currentValue.type === filterElementTypes.datePickerBetween || currentValue.type === filterElementTypes.dateTimePickerBetween) {
                return previousValue + 2;
            } else {
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
            this.toggleAdvancedSearch();
        };
        let actionButtons = [
            <FlatButton
              label='Apply Search'
              primary
              onTouchTap={apply}
          />,
            <FlatButton
              label='Cancel'
              onTouchTap={this.toggleAdvancedSearch}
        />
        ];
        return <Dialog
          key={2}
          title={'Advanced Search'}
          open={this.state.showFiltersPopup}
          actions={actionButtons}
            >
                {this.props.filterElements.map((el, i) => {
                    return (
                        <div key={i} className={style.advancedSearchInputWrapper}>
                            {this.renderFilterInPopup(el)}
                        </div>
                    );
                })}
        </Dialog>;
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
        let labelClass = this.haveSelectedOrChecked() ? style.link : '';
        let toggle = () => this.haveSelectedOrChecked() && this.setState({showFilters: false});
        let filtersNumber = 0;
        let leftSide;
        if (this.props.filterElements.length === 1 && this.props.filterElements[0]['type'] === filterElementTypes.searchBox) {
            leftSide = this.haveSelectedOrChecked() ? <span className={style.link}>Show buttons</span> : '';
        } else {
            leftSide = this.haveSelectedOrChecked() ? <span className={style.link}>Show buttons</span> : 'Filter by';
        }
        return (
            <div className={style.toolbarWrap}>
                <div className={classnames(style.toolbarElement, style.label, labelClass)} onClick={toggle}>
                    {leftSide}
                </div>

                <div className={style.pullRight}>
                    {this.props.filterElements.map((el, i) => {
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
                    {this.state.hasActiveFilters && <div onClick={this.props.clearFilters} className={classnames(style.toolbarElement, style.noRightMargin, style.closeArrow)} />}
                    {this.renderAdvanced()}
                </div>

            </div>
        );
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
        let canDoAction = true;
        let status = null;

        if (this.props.checked.size > 0) {
            for (let checkedItem of this.props.checked) {
                if (status !== null && status !== checkedItem.get(property)) {
                    canDoAction = false;
                    break;
                }
                status = checkedItem.get(property);
            }
        } else {
            let selected = this.props.selected;
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
    clearFilters: PropTypes.func,
    selected: PropTypes.object.isRequired, // immutable
    checked: PropTypes.object.isRequired, // immutable list
    batchChange: PropTypes.func
};

GridToolBox.defaultProps = {
    maxVisibleInputs: 4,
    showAdvanced: false,
    clearFilters: () => {},
    batchChange: () => {},
    selected: Immutable.Map({}),
    checked: Immutable.List()
};

export default GridToolBox;
