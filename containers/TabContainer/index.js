import React, { Component, PropTypes } from 'react';
import immutable from 'immutable';
import Tabs from '../../components/Tabs';
import StatusDialog from '../../components/StatusDialog';
import Header from '../../components/PageLayout/Header';

import { validationTypes, textValidations, dropdownValidations, objectValidations, customValidations } from '../../validator/constants';
import { validateTab, validateAll } from './validator';
import { prepareErrors } from './helper';
import {validationTypes as customValidationTypes} from './constants';
import { Vertical } from '../../components/Layout';

import style from './style.css';

class TabContainer extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            active: props.active || 0,
            statusObj: immutable.Map({})
        };
        this.handleActionButtonClick = this.handleActionButtonClick.bind(this);
        this.mapErrorsToTabs = this.mapErrorsToTabs.bind(this);
        this.checkIfSwithToNextTabIsAble = this.checkIfSwithToNextTabIsAble.bind(this);
        this.renderStatusDialog = this.renderStatusDialog.bind(this);
    }

    componentWillMount() {
        // Clearing errors
        this.props.onErrors({});
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.active !== this.props.active) {
            this.setState({
                active: nextProps.active
            });
        }
    }

    hasPrev() {
        return this.state.active > 0;
    }

    hasNext() {
        return this.state.active < this.props.tabs.length - 1;
    }

    handleActionButtonClick(index) {
        const { tabs, errors } = this.props;
        const button = this.props.actionButtons[index];

        if (button && button.onNext) {
            if (button.performTabValidation) {
                const tab = this.props.tabs[this.state.active];
                const valid = validateTab(this.props.sourceMap, tab.validations, this.state.active, undefined, errors);
                if (valid.isValid) {
                    this.props.onErrors({});
                    button.onNext();
                } else {
                    this.props.onErrors(prepareErrors(valid.errors));
                }
            } else if (button.performFullValidation) {
                const valid = validateAll(this.props.sourceMap, this.props.tabs, errors);
                if (valid.isValid) {
                    this.props.onErrors({});
                    button.onNext();
                } else {
                    const tabErrorsCount = {};
                    const sameErrorKey = [];
                    valid.errors.forEach((err) => {
                        if (err.key) {
                            if (sameErrorKey.indexOf(err.key.toString()) > -1) {
                                return;
                            }
                            sameErrorKey.push(err.key.toString());
                        }
                        if (tabErrorsCount[tabs[err.tabIndex].title]) {
                            tabErrorsCount[tabs[err.tabIndex].title] += 1;
                        } else {
                            tabErrorsCount[tabs[err.tabIndex].title] = 1;
                        }
                    });

                    const errorString = valid.errors.length > 1 ? 'errors' : 'error';
                    const tabString = Object.keys(tabErrorsCount).length > 1 ? 'tabs' : 'tab';

                    let statusErrorMessage = `Your request can not be saved because you have ${errorString} in the following ${tabString}:<ul>`;
                    for (const key in tabErrorsCount) {
                        if (Object.prototype.hasOwnProperty.call(tabErrorsCount, key)) {
                            const currentErrorString = tabErrorsCount[key] > 1 ? 'errors' : 'error';
                            statusErrorMessage += `<li>${key}: ${tabErrorsCount[key]} ${currentErrorString}</li>`;
                        }
                    }
                    statusErrorMessage += '</ul>';

                    this.setState(
                        { statusObj: immutable.fromJS({status: 'failed', message: statusErrorMessage}) },
                        () => {
                            this.props.onErrors(prepareErrors(valid.errors, errors.toJS()));
                        }
                    );
                }
            } else {
                button.onNext();
            }
        }
    }

    checkIfSwithToNextTabIsAble(index) {
        const { errors } = this.props;

        let ableToGoToNextTab = true;
        // this.props.onErrors({});

        if (!this.props.allowTabSwithIfNotValid) {
            const tab = this.props.tabs[this.state.active];
            const currentTabIsValid = validateTab(this.props.sourceMap, tab.validations, index - 1, undefined, errors);
            if (tab.customValidation) {
                const customError = tab.customValidationFunction(this.props.sourceMap);
                if (customError) {
                    currentTabIsValid.isValid = false;
                    currentTabIsValid.errors.push(customError);
                }
            }
            if (!currentTabIsValid.isValid) {
                ableToGoToNextTab = false;
                this.props.onErrors(prepareErrors(currentTabIsValid.errors, errors.toJS()));
            }
        }

        return ableToGoToNextTab;
    }

    mapErrorsToTabs() {
        const { tabs, errors } = this.props;
        const tabErrors = Array.apply(null, Array(tabs.length)).map(Number.prototype.valueOf, 0);

        errors.forEach((errValue, errKey) => {
            tabs.forEach((tab, tabIndex) => {
                if (tab.validations) {
                    const validation = tab.validations.find((validation) => {
                        if (validation.key) {
                            return validation.key[validation.key.length - 1] === errKey;
                        } else if (validation.keyText && validation.keyArray) { // Array with text case
                            const concatedErrorKey = validation.keyArray[validation.keyArray.length - 1] + '-' + validation.keyText[validation.keyText.length - 1] + '-';
                            return errKey.indexOf(concatedErrorKey) >= 0;
                        } else if (validation.keyArray) {
                            return validation.keyArray.join(',') === errKey;
                        } else {
                            return null;
                        }
                    });

                    if (validation) {
                        tabErrors[tabIndex] += 1;
                    }
                }
                if (tab.customValidation && tab.customValidationKeys.indexOf(errKey) > -1) {
                    tabErrors[tabIndex] += 1;
                }
            });
        });

        return tabErrors;
    }

    renderStatusDialog() {
        const handleDialogClose = () => {
            this.setState({statusObj: immutable.Map({})});
        };

        return (
            <StatusDialog status={this.state.statusObj} onClose={handleDialogClose} />
        );
    }

    render() {
        let { tabs, headerTitle, headerBreadcrumbsRemoveSlashes, actionButtons, location, allowSave, onTabClick } = this.props;

        const activeTab = tabs[this.state.active];
        const handleTabClick = (tab) => {
            let ableToGoToNextTab = true;
            if (tab.id > this.state.active) {
                ableToGoToNextTab = this.checkIfSwithToNextTabIsAble(this.state.active + 1);
            }
            if (ableToGoToNextTab) this.setState({active: tab.id});
            onTabClick && onTabClick({...tab, ableToGoToNextTab});
        };

        if (actionButtons.length && !allowSave) {
            actionButtons = [actionButtons[actionButtons.length - 1]];
        }
        actionButtons.length && this.props.actionButtons.forEach((button, index) => {
            if (typeof button.onNext === 'undefined') {
                button.onNext = button.onClick;
                button.onClick = () => {
                    this.handleActionButtonClick(index);
                };
            }
        });
        const tabErrrors = this.mapErrorsToTabs();

        const allowedTabs = tabs
            .filter(({title, permission}) => {
                let hasPermission = true;
                permission && permission.forEach(p => {
                    hasPermission = hasPermission && this.context.checkPermission(p);
                });

                return hasPermission;
            }).map((tab, id) => ({
                title: tab.title, id, errorsCount: tab.errorsCount || tabErrrors[id]
            }));

        return (
            <div className={style.tabContainerWrap}>
                <Vertical fixedComponent={
                    <Header
                        text={headerTitle}
                        location={location}
                        breadcrumbsRemoveSlashes={headerBreadcrumbsRemoveSlashes}
                        buttons={actionButtons}
                    />}
                >
                    {this.renderStatusDialog()}
                    <Vertical fixedComponent={
                        <div className={style.bottomBorderderWrap}>
                            <Tabs
                                tabs={allowedTabs}
                                activeTab={this.state.active}
                                onClick={handleTabClick}
                            />
                        </div>}
                    >
                        <div className={style.contentComponentWrapper} style={activeTab.styleContentWrapper}>
                            {activeTab.component}
                        </div>
                    </Vertical>
                </Vertical>
            </div>
        );
    }
}

TabContainer.propTypes = {
    location: PropTypes.object,
    headerTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    headerBreadcrumbsRemoveSlashes: PropTypes.number,
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            permission: PropTypes.array,
            component: PropTypes.element.isRequired,
            validations: PropTypes.arrayOf(
                PropTypes.shape({
                    key: PropTypes.oneOfType([
                        PropTypes.string,
                        PropTypes.arrayOf(PropTypes.string)]),
                    type: PropTypes.oneOf([
                        validationTypes.text,
                        validationTypes.array,
                        validationTypes.arrayWithTextElements,
                        validationTypes.dropdown,
                        validationTypes.defaultRole,
                        validationTypes.arrayWithArrayElements,
                        validationTypes.radio,
                        customValidationTypes.hasRaisedError,
                        customValidations.function,
                        validationTypes.object]),
                    rules: PropTypes.arrayOf(
                        PropTypes.shape({
                            type: PropTypes.oneOf([
                                textValidations.isRequired,
                                textValidations.length,
                                textValidations.numberOnly,
                                textValidations.decimalOnly,
                                textValidations.email,
                                textValidations.uniqueValue,
                                textValidations.integerOnly,
                                textValidations.integerRange,
                                textValidations.regex,
                                dropdownValidations.isRequiredOnCondition,
                                objectValidations.hasKeys,
                                customValidations.function]),
                            errorMessage: PropTypes.string
                        })
                    )
                })
            ),
            styleContentWrapper: PropTypes.object,
            errorsCount: PropTypes.number // expose tab property
        })
    ).isRequired,
    active: PropTypes.number,
    actionButtons: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            text: PropTypes.string,
            isDisabled: PropTypes.bool,
            onClick: PropTypes.func,
            onNext: PropTypes.func,
            performTabValidation: PropTypes.bool,
            performFullValidation: PropTypes.bool
        })
    ),
    sourceMap: PropTypes.object,
    errors: PropTypes.object,
    allowTabSwithIfNotValid: PropTypes.bool,
    allowSave: PropTypes.bool,
    onErrors: PropTypes.func,
    onTabClick: PropTypes.func
};

TabContainer.defaultProps = {
    headerTitle: '',
    actionButtons: [],
    allowSave: true,
    errors: immutable.Map({}),
    allowTabSwithIfNotValid: false,
    onErrors: () => {}
};

TabContainer.contextTypes = {
    checkPermission: PropTypes.func.isRequired
};

export default TabContainer;
