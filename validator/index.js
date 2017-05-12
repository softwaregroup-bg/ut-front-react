// Each function names corresponds to each validation rule type (constants.types)

import { defaultErrorMessage } from './constants';
import immutable from 'immutable';

const numbersOnlyRegex = /^[0-9]+$/;

/* Text Validation */
export const isRequiredRule = (prop, rule, result) => {
    checkPasedResultObject(result);

    let trimmed = prop ? (prop.trim ? prop.trim() : prop) : '';
    if (!prop || trimmed.length === 0) {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};

export const lengthRule = (val, minVal, maxVal, rule, result) => {
    checkPasedResultObject(result);

    let trimmedValue = val ? (val.trim ? val.trim() : val) : '';
    if (trimmedValue && (trimmedValue.length < minVal || trimmedValue.length > maxVal)) {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};

export const regexRule = (val, regex, rule, result) => {
    if (!val) {
        return true;
    }
    checkPasedResultObject(result);

    var regexPattern = new RegExp(regex);
    var regexResult = regexPattern.test(val);
    if (!regexResult) {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};

export const isUniqueValueRule = (val, values, rule, result) => {
    checkPasedResultObject(result);

    if (values.indexOf(val) > -1) {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};

export const isRequiredOnConditionRule = (prop, shouldValidateProp, rule, result, condition) => {
    if (typeof condition === 'boolean') {
        shouldValidateProp = !!shouldValidateProp;
    }
    if (!shouldValidateProp || shouldValidateProp !== condition) {
        return;
    }

    checkPasedResultObject(result);

    let trimmed = prop ? (prop.trim ? prop.trim() : prop) : '';
    if (!prop || trimmed.length === 0 || prop === '__placeholder__') {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};
/* End text validation */

/* Array Validation */

export const lengthRuleArray = (values, minVal, maxVal, rule, result) => {
    checkPasedResultObject(result);
    values.forEach(val => {
        let value = val.get('value') || val.get('phoneNumber');
        if (value && (value.length < minVal || value.length > maxVal)) {
            result.isValid = false;
            result.errors.push(getErrorObject(rule));
        }
    });
};

export const isRequiredArrayRule = (props, rule, result) => {
    checkPasedResultObject(result);

    if (!props || (props && props.size <= 0)) {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};
/* End array validation */

/* Array with Text Validation */
export const arrayWithTextLengthRule = (array, textProp, minVal, maxVal, rule, result) => {
    checkPasedResultObject(result);

    array.forEach((item, index) => {
        let currentValue = item.getIn(textProp);
        if (currentValue && (currentValue.length < minVal || currentValue.length > maxVal)) {
            result.isValid = false;
            rule.index = index;
            result.errors.push(getErrorObject(rule));
        }
    });
};

export const arrayWithTextisRequiredRule = (array, textProp, rule, result) => {
    checkPasedResultObject(result);

    array.forEach((item, index) => {
        let currentValue = item.getIn(textProp);
        let trimmed = currentValue ? (currentValue.trim ? currentValue.trim() : currentValue) : '';
        if (!currentValue || trimmed.length === 0) {
            result.isValid = false;
            rule.index = index;
            result.errors.push(getErrorObject(rule));
        }
    });
};

export const arrayWithTextisRequiredRuleOptional = (array, textProp, shouldValidateProp, rule, result) => {
    checkPasedResultObject(result);

    array.forEach((item, index) => {
        let shouldValidate = item.getIn(shouldValidateProp);
        if (!shouldValidate) {
            return;
        }
        let currentValue = item.getIn(textProp);
        let trimmed;
        if (isNaN(currentValue)) {
            trimmed = currentValue ? currentValue.trim() : '';
        } else {
            trimmed = currentValue;
        }
        if (!currentValue || trimmed.length === 0) {
            result.isValid = false;
            rule.index = index;
            result.errors.push(getErrorObject(rule));
        }
    });
};

export const arrayWithTextisNumberOnlyRuleOptional = (array, textProp, shouldValidateProp, rule, result) => {
    checkPasedResultObject(result);

    array.forEach((item, index) => {
        let shouldValidate = item.getIn(shouldValidateProp);
        if (!shouldValidate) {
            return;
        }
        let currentValue = item.getIn(textProp);
        if (currentValue !== '' && !(numbersOnlyRegex.test(currentValue))) {
            result.isValid = false;
            rule.index = index;
            result.errors.push(getErrorObject(rule));
        }
    });
};

export const arrayWithTextisNumberOnlyRule = (array, textProp, rule, result) => {
    checkPasedResultObject(result);

    array.forEach((item, index) => {
        let currentValue = item.getIn(textProp);
        if (currentValue !== '' && !(numbersOnlyRegex.test(currentValue))) {
            result.isValid = false;
            rule.index = index;
            result.errors.push(getErrorObject(rule));
        }
    });
};

export const arrayWithArrayIsRequiredRule = (array, textProp, rule, result) => {
    checkPasedResultObject(result);

    array.forEach((item, index) => {
        let currentValue = item.getIn(textProp);
        if (currentValue && (currentValue.size === 0 || currentValue.length === 0)) {
            result.isValid = false;
            rule.index = index;
            result.errors.push(getErrorObject(rule));
        }
    });
};

export const arrayWithDropdownIsRequiredRule = (array, textProp, rule, result) => {
    checkPasedResultObject(result);

    array.forEach((item, index) => {
        let currentValue = item.getIn(textProp);
        if (!currentValue) {
            result.isValid = false;
            rule.index = index;
            result.errors.push(getErrorObject(rule));
        }
    });
};

/* End array with text validation */

/* Dropdown Validation */
export const isRequiredDropdownRule = (props, rule, result) => {
    checkPasedResultObject(result);

    if (!props) {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};
/* End Dropdown validation */

/* Default role validation */

export const defaultRoleRule = (props, roles, rule, result) => {
    checkPasedResultObject(result);

    let assignedRoles = roles.filter(role => (role.get('isAssigned')));
    if (!props && assignedRoles.size > 0) {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};

/* End Default role validation */

/* isNumber validation */

export const isNumberOnlyRule = (props, rule, result) => {
    checkPasedResultObject(result);

    if (props !== '' && !(numbersOnlyRegex.test(props))) {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};

/* End isNumber validation */

export const isIntegerOnlyRule = (props, rule, result) => {
    checkPasedResultObject(result);

    let regex = /^-?\d+$/;
    if (props && !(regex.test(props))) {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};

export const isIntegerRangeRule = (props, rule, result) => {
    checkPasedResultObject(result);
    isIntegerOnlyRule(props, rule, result);
    if (result.isValid) {
        let value = parseInt(props);
        if (rule.minVal === null || rule.minVal === void 0) {
            rule.minVal = null;
        }
        if (rule.maxVal === null || rule.maxVal === void 0) {
            rule.maxValue = null;
        }
        if (rule.minVal !== null && value < rule.minVal) {
            result.isValid = false;
            result.errors.push(getErrorObject(rule));
        }
        if (result.isValid && rule.maxVal !== null && value > rule.maxVal) {
            result.isValid = false;
            result.errors.push(getErrorObject(rule));
        }
    }
};

/**
 * isDecimal validation
 *
 * Validates that the field is numeric, or numeric with decimal point.
 * Scale and precision must be specified.
 * @param {String} value - the value to validate
 * @param {Number} precision - total count of number characters
 * @param {Number} scale - number of characters after the decimal point.
 */
export const isDecimalOnlyRule = (value, precision, scale, rule, result) => {
    checkPasedResultObject(result);
    if (!value) {
        return true;
    }
    let digitsLeftOfDecimalPoint = precision - scale;
    let regex = new RegExp('^(\\d{0,' + digitsLeftOfDecimalPoint + '}\\.?\\d{0,' + scale + '}|\\.\\d{1,' + scale + '})$');

    if (value !== '' && !(regex.test(value))) {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};

/* End isDecimal validation */

/* Is valid email validation */

export const isValidEmailRule = (props, rule, result) => {
    checkPasedResultObject(result);

    let regex = /^[-a-z0-9~!$%^&*_=+}{'?]+(\.[-a-z0-9~!$%^&*_=+}{'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    if (props !== '' && !(regex.test(props))) {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};

/* End is valid email validation */
/* isNumber array validation */

export const isNumberOnlyRuleArray = (props, rule, result) => {
    checkPasedResultObject(result);
    let propsMutable = immutable.Iterable.isIterable(props) ? props.toJS() : props;
    propsMutable.forEach(prop => {
        let value = prop.value || prop.phoneNumber;
        if (value !== '' && !numbersOnlyRegex.test(value)) {
            result.isValid = false;
            result.errors.push(getErrorObject(rule));
        }
    });
};

/* End isNumber array validation */

/* Is valid email array validation */

export const isValidEmailRuleArray = (props, rule, result) => {
    let regex = /^[-a-z0-9~!$%^&*_=+}{'?]+(\.[-a-z0-9~!$%^&*_=+}{'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    checkPasedResultObject(result);

    props.forEach(prop => {
        if (prop.get('value') !== '' && !(regex.test(prop.get('value')))) {
            result.isValid = false;
            result.errors.push(getErrorObject(rule));
        }
    });
};

/* End is valid email array validation */

/* Object validation */

export const hasKeysRule = (props, rule, result) => {
    checkPasedResultObject(result);
    if (props.keySeq().size <= 0) {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};

/* End Object validation */

function checkPasedResultObject(result) {
    result = result || {};
    result.errors = result.errors || [];
}

function getErrorObject(rule) {
    return {
        ...rule,
        errorMessage: getErrorMessage(rule.errorMessage)
    };
}

function getErrorMessage(message) {
    return message || defaultErrorMessage;
}
