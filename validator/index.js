// Each function names corresponds to each validation rule type (constants.types)

import { defaultErrorMessage } from './constants';
import immutable from 'immutable';

/* Text Validation */
export const isRequiredRule = (prop, rule, result) => {
    checkPasedResultObject(result);

    let trimmed = prop ? prop.trim() : '';
    if (!prop || trimmed.length === 0) {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};

export const lengthRule = (val, minVal, maxVal, rule, result) => {
    checkPasedResultObject(result);

    if (val && (val.length < minVal || val.length > maxVal)) {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};

export const regexRule = (val, regex, rule, result) => {
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


export const isRequiredOnConditionRule = (prop, shouldValidateProp, rule, result) => {
    if (!shouldValidateProp) {
        return;
    }
    checkPasedResultObject(result);

    let trimmed = prop ? prop.trim() : '';
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
        let trimmed = currentValue ? currentValue.trim() : '';
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
        let regex = /^[0-9]+$/;
        if (currentValue !== '' && !(regex.test(currentValue))) {
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
        let regex = /^[0-9]+$/;
        if (currentValue !== '' && !(regex.test(currentValue))) {
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
        if (currentValue && currentValue.size === 0 || currentValue.length === 0) {
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

    let regex = /^[0-9]+$/;
    if (props !== '' && !(regex.test(props))) {
        result.isValid = false;
        result.errors.push(getErrorObject(rule));
    }
};

/* End isNumber validation */

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
    let regex = /^[0-9]+$/;
    checkPasedResultObject(result);
    let propsMutable = immutable.Iterable.isIterable(props) ? props.toJS() : props;
    propsMutable.forEach(prop => {
        let value = prop.value || prop.phoneNumber;
        if (value !== '' && !regex.test(value)) {
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
