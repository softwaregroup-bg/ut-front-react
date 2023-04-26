import {
    isRequiredRule,
    lengthRule,
    isRequiredArrayRule,
    isNumberOnlyRule,
    isRequiredDropdownRule,
    isValidEmailRuleArray,
    isNumberOnlyRuleArray,
    isValidIBANRule,
    lengthRuleArray,
    arrayWithTextLengthRule,
    regexRule,
    isUniqueValueRule,
    isValidUniformCivilNumberRule,
    arrayWithArrayIsRequiredRule
} from '../validator';
import {
    validationTypes,
    textValidations,
    dropdownValidations,
    arrayValidations
} from '../validator/constants.js';

const validators = {
    isRequired: (value) => {
        return !!value && !!String(value).trim();
    },
    minLength: (value, minLength) => {
        return value.length >= minLength;
    },
    maxLength: (value, maxLength) => {
        return value.length <= maxLength;
    },
    shouldMatchField: (value, shouldMatch, inputs) => {
        if (inputs && inputs.getIn([shouldMatch, 'value']) !== '') {
            return inputs.getIn([shouldMatch, 'value']) === value;
        }

        return true;
    },
    length: (value, length) => {
        return value.length === length;
    },
    regex: (value, regex) => {
        const regexPattern = new RegExp(regex);
        return regexPattern.test(value);
    },
    numbersOnly: (value, shouldBeValidated) => {
        if (shouldBeValidated) {
            return /^\d+$/.test(value);
        }
        return true;
    }
};

const defaultErrorMessagingMapping = {
    isRequired: ({ input }) => {
        return 'Field required';
    },
    minLength: ({ input, minLength }) => {
        return `Field must be at least ${minLength} characters`;
    },
    maxLength: ({ input, maxLength }) => {
        return `Field must be at most ${maxLength} characters`;
    },
    shouldMatchField: ({ input, shouldMatchField }) => {
        return 'Passwords do not match';
    },
    length: ({ input, length }) => {
        return `OTP code must be exactly ${length} characters long`;
    },
    numbersOnly: ({ input }) => {
        return 'Please enter only numeric characters.';
    },
    regex: ({ input }) => {
        return 'Invalid field.';
    }
};

export class Validator {
    constructor(config) {
        this.config = config;
        this.errorMapping = Object.assign({}, defaultErrorMessagingMapping, config.errorMessagingMapping);
    }

    updateConfig(config) {
        this.config = config;
    }

    validateInput(input, value, inputs) {
        if (!this.config[input]) {
            // If there is no validation for this input - simulate passing validation
            return {
                isValid: true,
                error: ''
            };
        }
        const { validations, validateOrder, cascadeParent } = this.config[input];
        let error = '';

        validateOrder.every((validationRule) => {
            let isValid = validators[validationRule](value, validations[validationRule], inputs);

            if (cascadeParent && !inputs.get(cascadeParent)) {
                isValid = true;
            }
            if (!isValid) {
                error = this.errorMapping[validationRule]({...validations, input});
            }

            return isValid;
        });

        return {
            isValid: !error,
            error
        };
    }

    validateAllFlat(inputs) {
        // if input values ARE NOT objects with key value
        // inputs - immutable Map with 'data' and 'edited' key filled flat with the data
        let errors = [];
        const computedData = inputs.get('data').merge(inputs.get('edited'));
        const keys = computedData.keySeq().toArray();
        keys.forEach((key) => {
            const validationResult = this.validateInput(key, computedData.get(key), computedData);
            if (!validationResult.isValid) {
                errors.push({
                    field: key,
                    error: validationResult.error
                });
            }
        });
        // If input has orConditions array of keys -> ['someKey'] this means that is even one of these keys has a set value this error should be ignored
        const errorsToRemove = [];
        errors.forEach((error) => {
            // Get OR conditions for input
            const orConditions = this.config[error.field].orConditions || [];
            orConditions.forEach((condition) => {
                // condition is string with input's key
                // Check if there is an isRequired error for this key
                const hasErrorForCondition = errors.find((err) => err.field === condition && err.error === 'Field required');
                if (!hasErrorForCondition) {
                    // If there is not isRequired error for this key this means that it has value and OR condition is fulfilled and this error should be removed
                    errorsToRemove.push(error.field);
                }
            });
        });
        // Remove all isRequired errors that are fulfilled by OR conditions
        errors = errors.filter((error) => !(errorsToRemove.indexOf(error.field) > -1 && error.error === 'Field required'));

        return errors;
    }

    validateAll(inputs) {
        // if input values ARE objects with key value
        let validationError = '';
        let invalidField = '';

        const isValid = inputs.every((input, key) => {
            const value = input.get('value');
            const validationResult = this.validateInput(key, value, inputs);
            validationError = validationResult.error;
            invalidField = !validationResult.isValid ? input.get('name') : '';

            return validationResult.isValid;
        }, this);

        return {
            isValid,
            invalidField,
            error: validationError
        };
    }
}

/*
 * @SourceMap is (immutable) object with the fields that need to be validated
 * example:
 * sourceMap: { name: 'some name', obj: {prop: ''} valuesInArray: [] }
 * @Validations is an array with objects of the shape:
 * validations: [{
 *      key: ['obj', 'prop'],
 *      type: '<type from the constants>',
 *      rules: [{
 *          key: 'prop',
 *          type: '<type from the constants>',
 *          errorMessage: 'Display this error in the UI',
 *          ...specificRules
 *      }]
 * }]
 * if there are more than one validation rule, the first is with highest priority
 * as a result is an object containing boolean property 'isValid' and an array with error messages
 */
export const validateAll = (sourceMap, validations) => {
    const result = { isValid: true, errors: [] };
    if (validations) {
        validations.forEach((validation) => {
            let currentValue;
            if (validation.key) {
                currentValue = sourceMap.getIn(validation.key);
            }
            validation.rules.forEach((rule) => {
                rule.key = validation.key;
                if (validation.type === validationTypes.text && rule.type === textValidations.isRequired) {
                    isRequiredRule(currentValue, rule, result);
                }
                if (validation.type === validationTypes.text && rule.type === textValidations.numberOnly) {
                    isNumberOnlyRule(currentValue, rule, result);
                }
                if (validation.type === validationTypes.text && rule.type === textValidations.length) {
                    lengthRule(currentValue, rule.minVal, rule.maxVal, rule, result);
                }
                if (validation.type === validationTypes.text && rule.type === textValidations.regex) {
                    regexRule(currentValue, rule.value, rule, result);
                }
                if (validation.type === validationTypes.text && rule.type === textValidations.uniqueValue) {
                    isUniqueValueRule(currentValue, rule.values, rule, result);
                }
                if (validation.type === validationTypes.text && rule.type === textValidations.uniformCivilNumber) {
                    isValidUniformCivilNumberRule(currentValue, rule.values, rule, result);
                }
                if (validation.type === validationTypes.text && rule.type === textValidations.iban) {
                    isValidIBANRule(currentValue, rule, result);
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
            });
        });
    }
    return result;
};
