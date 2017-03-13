const validators = {
    isRequired: (value) => {
        return !!value;
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
        var regexPattern = new RegExp(regex);
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
        return `Field required`;
    },
    minLength: ({ input, minLength }) => {
        return `Field must be at least ${minLength} characters`;
    },
    maxLength: ({ input, maxLength }) => {
        return `Field must be at most ${maxLength} characters`;
    },
    shouldMatchField: ({ input, shouldMatchField }) => {
        return `Passwords do not match`;
    },
    length: ({ input, length }) => {
        return `OTP code must be exactly ${length} characters long`;
    },
    numbersOnly: ({ input }) => {
        return `Please enter only numeric characters.`;
    },
    regex: ({ input }) => {
        return `Invalid field.`;
    }
};

export class Validator {
    constructor(config) {
        this.config = config;
        this.errorMapping = Object.assign({}, defaultErrorMessagingMapping, config.errorMessagingMapping);
    }

    validateInput(input, value, inputs) {
        if (!this.config[input]) {
            // If there is no validation for this input - simulate passing validation
            return {
                isValid: true,
                error: ''
            };
        }
        const { validations, validateOrder } = this.config[input];
        let error = '';

        validateOrder.every((validationRule) => {
            let isValid = validators[validationRule](value, validations[validationRule], inputs);
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
        let computedData = inputs.get('data').merge(inputs.get('edited'));
        let keys = computedData.keySeq().toArray();
        keys.forEach((key) => {
            let validationResult = this.validateInput(key, computedData.get(key));
            if (!validationResult.isValid) {
                errors.push({
                    field: key,
                    error: validationResult.error
                });
            }
        });

        return errors;
    }

    validateAll(inputs) {
        // if input values ARE objects with key value
        let validationError = '';
        let invalidField = '';

        let isValid = inputs.every((input, key) => {
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
