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
    regex: ({ input, regex }) => {
        return 'Invalid input';
    },
    numbersOnly: ({ input }) => {
        return 'Field must contains only numbers';
    }
};

export class Validator {
    constructor(config) {
        this.config = config;
        this.errorMapping = Object.assign({}, defaultErrorMessagingMapping, config.errorMessagingMapping);
    }

    validateInput(input, value, inputs) {
        if (this.config[input]) {
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

        return { isValid: true };
    }

    validateAll(inputs) {
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

    validateAllFlat(data) {
        let result = [];

        for (var property in data) {
            if (this.config[property]) {
                let isValid = this.validateInput(property, data[property]);
                if (!isValid.isValid) {
                    result.push({
                        field: property,
                        error: isValid.error
                    });
                }
            }
        }

        return result;
    }
}
