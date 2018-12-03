import React, { Component, PropTypes } from 'react';
import { Map, fromJS } from 'immutable';
import Tabs from 'ut-front-react/components/Tabs';
import ActionBar from './ActionBar';
import StatusDialog from 'ut-front-react/components/StatusDialog';

import { validationTypes, textValidations, dropdownValidations } from 'ut-front-react/validator/constants';
import { validateTab, validateAll } from './validator';
import { prepareErrors } from './helpers';

import classnames from 'classnames';
import style from './style.css';
import mainStyle from 'ut-front-react/assets/index.css';

class TabContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: 0,
            statusObj: new Map()
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

    hasPrev() {
        return this.state.active > 0;
    }

    hasNext() {
        return this.state.active < this.props.tabs.length - 1;
    }

    handleActionButtonClick(index) {
        const { tabs, errors } = this.props;
        const button = this.props.actionButtons[index];

        if (button && button.onClick) {
            if (button.performTabValidation) {
                const tab = this.props.tabs[this.state.active];
                const valid = validateTab(this.props.sourceMap, tab.validations);

                if (valid.isValid) {
                    this.props.onErrors({});
                    button.onClick();
                } else {
                    this.props.onErrors(prepareErrors(valid.errors));
                }
            } else if (button.performFullValidation) {
                const valid = validateAll(this.props.sourceMap, this.props.tabs);

                if (valid.isValid) {
                    this.props.onErrors({});
                    button.onClick();
                } else {
                    const tabErrorsCount = {};
                    valid.errors.forEach((err) => {
                        if (tabErrorsCount[tabs[err.tabIndex].title]) {
                            tabErrorsCount[tabs[err.tabIndex].title] += 1;
                        } else {
                            tabErrorsCount[tabs[err.tabIndex].title] = 1;
                        }
                    });

                    const errorString = valid.errors.length > 1 ? 'errors' : 'error';
                    const tabString = Object.keys(tabErrorsCount).length > 1 ? 'tabs' : 'tab ';

                    let statusErrorMessage = `Your request can not be saved because you have ${errorString} in the following ${tabString}:<ul>`;
                    for (const key in tabErrorsCount) {
                        if (tabErrorsCount.hasOwnProperty(key)) {
                            const currentErrorString = tabErrorsCount[key] > 1 ? 'errors' : 'error';
                            statusErrorMessage += `<li>${key}: ${tabErrorsCount[key]} ${currentErrorString}</li>`;
                        }
                    }
                    statusErrorMessage += '</ul>';

                    this.setState(
                        { statusObj: fromJS({status: 'failed', message: statusErrorMessage}) },
                        () => {
                            this.props.onErrors(prepareErrors(valid.errors, errors.toJS()));
                        }
                    );
                }
            } else {
                button.onClick();
            }
        }
    }

    checkIfSwithToNextTabIsAble(index) {
        const { errors } = this.props;

        let ableToGoToNextTab = true;
        // this.props.onErrors({});

        if (!this.props.allowTabSwithIfNotValid) {
            const tab = this.props.tabs[this.state.active];
            const currentTabIsValid = validateTab(this.props.sourceMap, tab.validations);

            if (!currentTabIsValid.isValid) {
                ableToGoToNextTab = false;
                this.props.onErrors(prepareErrors(currentTabIsValid.errors, errors.toJS()));
            } else {
                this.props.onErrors({});
            }
        }

        return ableToGoToNextTab;
    }

    mapErrorsToTabs() {
        const { tabs, errors } = this.props;
        const tabErrors = new Array(tabs.length).fill(0);

        errors.forEach((errValue, errKey) => {
            tabs.forEach((tab, tabIndex) => {
                if (tab.validations) {
                    const validation = tab.validations.find((validation) => {
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
            });
        });

        return tabErrors;
    }

    renderStatusDialog() {
        const handleDialogClose = () => {
            this.setState({statusObj: new Map()});
        };

        return (
            <StatusDialog status={this.state.statusObj} onClose={handleDialogClose} />
        );
    }

    render() {
        const { tabs } = this.props;
        const activeTab = tabs[this.state.active];
        const handleTabClick = ({id}) => {
            let ableToGoToNextTab = true;
            if (id > this.state.active) {
                ableToGoToNextTab = this.checkIfSwithToNextTabIsAble(this.state.active + 1);
            }
            if (ableToGoToNextTab) this.setState({active: id});
        };

        // Action bar
        const prev = () => this.hasPrev() && this.setState({active: --this.state.active});
        const next = () => {
            const ableToGoToNextTab = this.checkIfSwithToNextTabIsAble(this.state.active + 1);
            if (ableToGoToNextTab) this.hasNext() && this.setState({active: ++this.state.active});
        };

        const tabErrrors = this.mapErrorsToTabs();

        return (
            <div className={style.tabContainerWrap}>
                {this.renderStatusDialog()}
                <div className={classnames(style.bottomBorderderWrap, style.tabMenuWrap)}>
                    <Tabs
                      tabs={tabs.map(({title}, id) => ({title, id, errorsCount: tabErrrors[id]}))}
                      activeTab={this.state.active}
                      onClick={handleTabClick}
                    />
                </div>

                {!this.props.skipActionBar && <div className={classnames(style.bottomBorderderWrap, mainStyle.actionBarWrap)}>
                    <ActionBar
                      buttons={this.props.actionButtons}
                      disablePrevBtn={this.hasPrev()}
                      disableNextBtn={this.hasNext()}
                      onPrev={prev}
                      onNext={next}
                      handleActionButtonClick={this.handleActionButtonClick}
                    />
                </div>}

                <div className={style.contentComponentWrapper}>
                    {activeTab.component}
                </div>
            </div>
        );
    }
}

TabContainer.propTypes = {
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            component: PropTypes.element.isRequired,
            validations: PropTypes.arrayOf(
                PropTypes.shape({
                    key: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
                    type: PropTypes.oneOf([validationTypes.text, validationTypes.array, validationTypes.arrayWithTextElements, validationTypes.dropdown, validationTypes.defaultRole, validationTypes.arrayWithArrayElements]),
                    rules: PropTypes.arrayOf(
                         PropTypes.shape({
                             type: PropTypes.oneOf([textValidations.isRequired, textValidations.length, textValidations.numberOnly, textValidations.email, textValidations.uniqueValue, dropdownValidations.isRequiredOnCondition]),
                             errorMessage: PropTypes.string
                         })
                    )
                })
            )
        })
    ).isRequired,
    actionButtons: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            isDisabled: PropTypes.bool,
            onClick: PropTypes.func,
            performTabValidation: PropTypes.bool,
            performFullValidation: PropTypes.bool
        })
    ),
    sourceMap: PropTypes.object,
    errors: PropTypes.object,
    allowTabSwithIfNotValid: PropTypes.bool,
    onErrors: PropTypes.func,
    skipActionBar: PropTypes.bool
};

TabContainer.defaultProps = {
    actionButtons: [],
    errors: new Map(),
    allowTabSwithIfNotValid: false,
    onErrors: () => {},
    skipActionBar: false
};

export default TabContainer;
