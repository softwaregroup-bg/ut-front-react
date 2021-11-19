import { textValidations } from '../../../validator/constants';
import { isRequiredRule, lengthRule, regexRule, isNumberOnlyRule, isValidUniformCivilNumberRule, isIntegerOnlyRule, isIntegerRangeRule, isDecimalOnlyRule, isValidEmailRule, isUniqueValueRule, isValidIBANRule } from '../../../validator';

export default (valueToValidate, validators) => {
    const result = { isValid: true, errors: [] };

    validators.forEach((validator) => {
        if (validator.type === textValidations.isRequired) isRequiredRule(valueToValidate, validator, result);
        if (validator.type === textValidations.length) lengthRule(valueToValidate, validator.minVal, validator.maxVal, validator, result);
        if (validator.type === textValidations.regex) regexRule(valueToValidate, validator.value, validator, result);
        if (validator.type === textValidations.numberOnly) isNumberOnlyRule(valueToValidate, validator, result);
        if (validator.type === textValidations.uniformCivilNumber) isValidUniformCivilNumberRule(valueToValidate, validator, result);
        if (validator.type === textValidations.integerOnly) isIntegerOnlyRule(valueToValidate, validator, result);
        if (validator.type === textValidations.integerRange) isIntegerRangeRule(valueToValidate, validator, result);
        if (validator.type === textValidations.decimalOnly) isDecimalOnlyRule(valueToValidate, validator.precision, validator.scale, validator, result, validator.allowNegative);
        if (validator.type === textValidations.email) isValidEmailRule(valueToValidate, validator, result);
        if (validator.type === textValidations.uniqueValue) isUniqueValueRule(valueToValidate, validator.values, validator, result);
        if (validator.type === textValidations.uniqueValueCaseInsensitive) isUniqueValueRule(valueToValidate.toLowerCase(), validator.values, validator, result);
        if (validator.type === textValidations.iban) isValidIBANRule(valueToValidate, validator, result);
    });
    return result;
};
