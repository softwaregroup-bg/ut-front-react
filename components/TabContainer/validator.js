import {
    validationTypes,
    textValidations,
    arrayValidations,
    dropdownValidations,
    defaultRoleValidations
} from 'ut-front-react/validator/constants';
import {
    isRequiredRule,
    lengthRule,
    regexRule,
    isNumberOnlyRule,
    isValidEmailRule,
    isUniqueValueRule,
    isRequiredArrayRule,
    isValidEmailRuleArray,
    isNumberOnlyRuleArray,
    lengthRuleArray,
    arrayWithTextLengthRule,
    arrayWithArrayIsRequiredRule,
    isRequiredDropdownRule,
    isRequiredOnConditionRule,
    defaultRoleRule
} from 'ut-front-react/validator';
import { getAssignedRoles } from './helpers';

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

function isValidEmailRuleWrapper(props, rule, result) {
    // Because I can't edit the real function in ut-front-react..
    if (!props) {
        return true;
    }
    isValidEmailRule(props, rule, result);
}

export const validateValue = (currentValue, validation, sourceMap = new Map(), tabIndex, result) => {
    result = result || { isValid: true, errors: [] };

    validation.rules.forEach((rule) => {
        rule.key = validation.key;
        let startErrorsLength = result.errors.length;
        if (validation.type === validationTypes.text && rule.type === textValidations.isRequired) {
            isRequiredRule(currentValue, rule, result);
        }
        if (validation.type === validationTypes.text && rule.type === textValidations.length) {
            lengthRule(currentValue, rule.minVal, rule.maxVal, rule, result);
        }
        if (validation.type === validationTypes.text && rule.type === textValidations.regex) {
            regexRule(currentValue, rule.value, rule, result);
        }
        if (validation.type === validationTypes.text && rule.type === textValidations.email) {
            isValidEmailRuleWrapper(currentValue, rule, result);
        }
        if (validation.type === validationTypes.text && rule.type === textValidations.uniqueValue) {
            isUniqueValueRule(currentValue, rule.values, rule, result);
        }
        if (validation.type === validationTypes.text && rule.type === textValidations.numberOnly) {
            isNumberOnlyRule(currentValue, rule, result);
        }

        if (validation.type === validationTypes.dropdown && rule.type === dropdownValidations.isRequired) {
            isRequiredDropdownRule(currentValue, rule, result);
        }
        if (validation.type === validationTypes.dropdown && rule.type === dropdownValidations.isRequiredOnCondition) {
            isRequiredOnConditionRule(currentValue, sourceMap.getIn(validation.shouldValidateProp), rule, result);
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
        if (validation.type === validationTypes.defaultRole && rule.type === defaultRoleValidations.isRequired) {
            defaultRoleRule(currentValue, getAssignedRoles(sourceMap.get('roles'), sourceMap.getIn(['localData', 'assignedRoles'])), rule, result);
        }

        const lengthDiff = result.errors.length - startErrorsLength;
        if (lengthDiff > 0) {
            for (let i = result.errors.length - (lengthDiff); i <= result.errors.length - 1; i += 1) {
                result.errors[i].tabIndex = tabIndex;
            }
        }
    });

    return result;
};

export const validateTab = (sourceMap, validations, tabIndex, result) => {
    result = result || { isValid: true, errors: [] };
    if (validations) {
        validations.forEach((validation) => {
            let currentValue;
            if (validation.key) {
                currentValue = sourceMap.getIn(validation.key);
            }
            result = validateValue(currentValue, validation, sourceMap, tabIndex, result);
        });
    }
    return result;
};

export const validateAll = (sourceMap, tabs) => {
    const result = { isValid: true, errors: [] };

    tabs.forEach((tab, index) => {
        validateTab(sourceMap, tab.validations, index, result);
    });

    return result;
};
