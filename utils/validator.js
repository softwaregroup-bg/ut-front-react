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
    }
};

export class Validator {
    constructor(config) {
        this.config = config;
        this.errorMapping = Object.assign({}, defaultErrorMessagingMapping, config.errorMessagingMapping);
    }

    validateInput(input, value, inputs) {
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
}
