import React, { Component, PropTypes } from 'react';
import immutable from 'immutable';
import Tabs from '../../components/Tabs';
import StatusDialog from '../../components/StatusDialog';
import Header from '../../components/PageLayout/Header';

import { validationTypes, textValidations, dropdownValidations, objectValidations } from '../../validator/constants';
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
        let { tabs, errors } = this.props;
        let button = this.props.actionButtons[index];

        if (button && button.onNext) {
            if (button.performTabValidation) {
                let tab = this.props.tabs[this.state.active];
                let valid = validateTab(this.props.sourceMap, tab.validations, this.state.active, undefined, errors);
                if (valid.isValid) {
                    this.props.onErrors({});
                    button.onNext();
                } else {
                    this.props.onErrors(prepareErrors(valid.errors));
                }
            } else if (button.performFullValidation) {
                let valid = validateAll(this.props.sourceMap, this.props.tabs, errors);
                if (valid.isValid) {
                    this.props.onErrors({});
                    button.onNext();
                } else {
                    let tabErrorsCount = {};
                    valid.errors.forEach((err) => {
                        if (tabErrorsCount[tabs[err.tabIndex].title]) {
                            tabErrorsCount[tabs[err.tabIndex].title] += 1;
                        } else {
                            tabErrorsCount[tabs[err.tabIndex].title] = 1;
                        }
                    });

                    let errorString = valid.errors.length > 1 ? 'errors' : 'error';
                    let tabString = Object.keys(tabErrorsCount).length > 1 ? 'tabs' : 'tab';

                    let statusErrorMessage = `Your request can not be saved because you have ${errorString} in the following ${tabString}:<ul>`;
                    for (var key in tabErrorsCount) {
                        if (tabErrorsCount.hasOwnProperty(key)) {
                            let currentErrorString = tabErrorsCount[key] > 1 ? 'errors' : 'error';
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
        let { errors } = this.props;

        let ableToGoToNextTab = true;
        // this.props.onErrors({});

        if (!this.props.allowTabSwithIfNotValid) {
            let tab = this.props.tabs[this.state.active];
            let currentTabIsValid = validateTab(this.props.sourceMap, tab.validations, index - 1, undefined, errors);
            if (tab.customValidation) {
                let customError = tab.customValidationFunction(this.props.sourceMap);
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
        let { tabs, errors } = this.props;
        let tabErrors = Array.apply(null, Array(tabs.length)).map(Number.prototype.valueOf, 0);

        errors.forEach((errValue, errKey) => {
            tabs.forEach((tab, tabIndex) => {
                if (tab.validations) {
                    let validation = tab.validations.find((validation) => {
                        if (validation.key) {
                            return validation.key[validation.key.length - 1] === errKey;
                        } else if (validation.keyText && validation.keyArray) { // Array with text case
                            let concatedErrorKey = validation.keyArray[validation.keyArray.length - 1] + '-' + validation.keyText[validation.keyText.length - 1] + '-';
                            return errKey.indexOf(concatedErrorKey) >= 0;
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
        let handleDialogClose = () => {
            this.setState({statusObj: immutable.Map({})});
        };

        return (
            <StatusDialog status={this.state.statusObj} onClose={handleDialogClose} />
        );
    }

    render() {
        let { tabs, headerTitle, headerBreadcrumbsRemoveSlashes, actionButtons, location } = this.props;

        let activeTab = tabs[this.state.active];
        let handleTabClick = ({id}) => {
            let ableToGoToNextTab = true;
            if (id > this.state.active) {
                ableToGoToNextTab = this.checkIfSwithToNextTabIsAble(this.state.active + 1);
            }
            if (ableToGoToNextTab) this.setState({active: id});
        };

        actionButtons.length && this.props.actionButtons.forEach((button, index) => {
            if (typeof button.onNext === 'undefined') {
                button.onNext = button.onClick;
                button.onClick = () => {
                    this.handleActionButtonClick(index);
                };
            }
        });
        let tabErrrors = this.mapErrorsToTabs();

        let allowedTabs = tabs
            .filter(({title, permission}) => {
                let hasPermission = true;
                permission && permission.forEach(p => {
                    hasPermission = hasPermission && this.context.checkPermission(p);
                });

                return hasPermission;
            }).map(({title}, id) => ({
                title, id, errorsCount: tabErrrors[id]
            }));

        return (
            <div className={style.tabContainerWrap}>
                <Vertical fixedComponent={
                    <Header
                      text={headerTitle}
                      location={location}
                      breadcrumbsRemoveSlashes={headerBreadcrumbsRemoveSlashes}
                      buttons={actionButtons} />}
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
    headerTitle: PropTypes.string,
    headerBreadcrumbsRemoveSlashes: PropTypes.number,
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            permission: PropTypes.array,
            component: PropTypes.element.isRequired,
            validations: PropTypes.arrayOf(
                PropTypes.shape({
                    key: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
                    type: PropTypes.oneOf([validationTypes.text, validationTypes.array, validationTypes.arrayWithTextElements, validationTypes.dropdown, validationTypes.defaultRole, validationTypes.arrayWithArrayElements, validationTypes.radio, customValidationTypes.hasRaisedError, validationTypes.object]),
                    rules: PropTypes.arrayOf(
                         PropTypes.shape({
                             type: PropTypes.oneOf([textValidations.isRequired, textValidations.length, textValidations.numberOnly, textValidations.decimalOnly, textValidations.email, textValidations.uniqueValue, textValidations.regex, dropdownValidations.isRequiredOnCondition, objectValidations.hasKeys]),
                             errorMessage: PropTypes.string
                         })
                    )
                })
            ),
            styleContentWrapper: PropTypes.object
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
    onErrors: PropTypes.func
};

TabContainer.defaultProps = {
    headerTitle: '',
    actionButtons: [],
    errors: immutable.Map({}),
    allowTabSwithIfNotValid: false,
    onErrors: () => {}
};

TabContainer.contextTypes = {
    checkPermission: PropTypes.func.isRequired
};

export default TabContainer;
