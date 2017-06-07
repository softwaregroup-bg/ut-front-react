/*
    Every validation has errorMessage prop

    Example usage
    validation: [
        {
            key: 'organization.organizationName',
            type: validationTypes.text,
            validations: [
                {type: textValidations.isRequired, errorMessage: 'Organization name is required'},
                {type: textValidations.length, minVal: 3, maxVal: 5, errorMessage: 'Name should be between 3 and 5 symbols long'}
            ]
        }
    ]
*/

import { validationTypes, textValidations, arrayValidations, dropdownValidations, defaultRoleValidations, objectValidations } from '../../validator/constants';
import { validationTypes as validationTypesTabContainer } from './constants';
import { isRequiredRule, lengthRule, isRequiredArrayRule, isRequiredDropdownRule, defaultRoleRule, isValidEmailRuleArray, isNumberOnlyRuleArray, isDecimalOnlyRule, lengthRuleArray, arrayWithTextLengthRule, regexRule, isUniqueValueRule, arrayWithArrayIsRequiredRule, isRequiredOnConditionRule, hasKeysRule } from '../../validator';
import { getAssignedRoles } from './helper';

export const validateTab = (sourceMap, validations, customValidationObj, tabIndex, result, errors) => {
    result = result || { isValid: true, errors: [] };
    if (validations) {
        validations.forEach((validation) => {
            let startErrorsLength = result.errors.length;

            if (validation.type === validationTypesTabContainer.hasRaisedError) {
                let hasRaisedError = errors.getIn(validation.key);
                if (hasRaisedError) {
                    result.isValid = false;
                    let errorObj = {
                        type: validationTypesTabContainer.hasRaisedError,
                        errorMessage: hasRaisedError
                    };
                    result.errors.push(errorObj);
                }
            } else {
                let currentValue;
                if (validation.key) {
                    currentValue = sourceMap.getIn(validation.key);
                }
                validation.rules.forEach((rule) => {
                    rule.key = validation.key;
                    if (validation.type === validationTypes.text && rule.type === textValidations.isRequired) {
                        isRequiredRule(currentValue, rule, result);
                    }
                    if (validation.type === validationTypes.dropdown && rule.type === dropdownValidations.isRequiredOnCondition) {
                        isRequiredOnConditionRule(currentValue, sourceMap.getIn(validation.shouldValidateProp), rule, result, validation.condition);
                    }
                    if (validation.type === validationTypes.radio && rule.type === textValidations.isRequiredOnCondition) {
                        isRequiredOnConditionRule(currentValue, sourceMap.getIn(validation.shouldValidateProp), rule, result, validation.condition);
                    }
                    if (validation.type === validationTypes.text && rule.type === textValidations.length) {
                        lengthRule(currentValue, rule.minVal, rule.maxVal, rule, result);
                    }
                    if (validation.type === validationTypes.text && rule.type === textValidations.decimalOnly) {
                        isDecimalOnlyRule(currentValue, rule.precision, rule.scale, rule, result);
                    }
                    if (validation.type === validationTypes.text && rule.type === textValidations.regex) {
                        regexRule(currentValue, rule.value, rule, result);
                    }
                    if (validation.type === validationTypes.text && rule.type === textValidations.uniqueValue) {
                        isUniqueValueRule(currentValue, rule.values, rule, result);
                    }
                    if (validation.type === validationTypes.array && rule.type === arrayValidations.isRequired) {
                        isRequiredArrayRule(currentValue, rule, result);
                    }
                    if (validation.type === validationTypes.array && rule.type === arrayValidations.numberOnly) {
                        isNumberOnlyRuleArray(currentValue, rule, result);
                    }
                    if (validation.type === validationTypes.array && rule.type === arrayValidations.email) {
                        isValidEmailRuleArray(currentValue, rule, result);
                    }
                    if (validation.type === validationTypes.array && rule.type === textValidations.length) {
                        lengthRuleArray(currentValue, rule.minVal, rule.maxVal, rule, result);
                    }
                    if (validation.type === validationTypes.arrayWithTextElements && rule.type === textValidations.length) {
                        rule.keyArray = validation.keyArray;
                        rule.keyText = validation.keyText;
                        arrayWithTextLengthRule(sourceMap.getIn(validation.keyArray), validation.keyText, rule.minVal, rule.maxVal, rule, result);
                    }
                    if (validation.type === validationTypes.arrayWithArrayElements && rule.type === arrayValidations.isRequired) {
                        rule.keyArray = validation.keyArray;
                        rule.keyText = validation.keyText;
                        arrayWithArrayIsRequiredRule(sourceMap.getIn(validation.keyArray), validation.keyText, rule, result);
                    }
                    if (validation.type === validationTypes.dropdown && rule.type === dropdownValidations.isRequired) {
                        isRequiredDropdownRule(currentValue, rule, result);
                    }
                    if (validation.type === validationTypes.defaultRole && rule.type === defaultRoleValidations.isRequired) {
                        defaultRoleRule(currentValue, getAssignedRoles(sourceMap.get('roles'), sourceMap.getIn(['localData', 'assignedRoles'])), rule, result);
                    }
                    if (validation.type === validationTypes.object && rule.type === objectValidations.hasKeys) {
                        hasKeysRule(currentValue, rule, result);
                    }

                    // custom for password hash in user -> credentials tab. TODO: Validator should NOT KNOW about user specific details!
                    if (validation.type === validationTypes.custom + 'passwordHash') {
                        let hashes = sourceMap.getIn(validation.sourceMapKey);
                        let passwordHash = hashes.find((hash) => hash.get('type') === 'password');
                        if (passwordHash) {
                            let passwordValue = passwordHash.get('newValue');
                            if (rule.type === textValidations.isRequired) {
                                isRequiredRule(passwordValue, rule, result);
                            }
                            if (rule.type === textValidations.length) {
                                lengthRule(passwordValue, rule.minVal, rule.maxVal, rule, result);
                            }
                            if (rule.type === textValidations.regex) {
                                regexRule(passwordValue, rule.value, rule, result);
                            }
                        }
                    }
                });
            }

            let lengthDiff = result.errors.length - startErrorsLength;
            if (lengthDiff > 0) {
                for (let i = result.errors.length - (lengthDiff); i <= result.errors.length - 1; i += 1) {
                    result.errors[i].tabIndex = tabIndex;
                }
            }
        });
    }

    if (customValidationObj && customValidationObj.validate) {
        var customValidationResult = customValidationObj.function(sourceMap);
        if (customValidationResult) {
            result.isValid = false;
            result.errors.push({
                tabIndex: tabIndex,
                errorMessage: customValidationResult.errorMessage,
                key: customValidationResult.key
            });
        }
    }
    return result;
};

export const validateAll = (sourceMap, tabs, errors) => {
    let result = { isValid: true, errors: [] };

    tabs.forEach((tab, index) => {
        validateTab(sourceMap, tab.validations, tab.customValidation, index, result, errors);
    });

    return result;
};
