const validators = {
    isRequired: (value) => {
        return !!value;
    },
    minLength: (value, minLength) => {
        return value.length >= minLength;
    },
    maxLength: (value, maxLength) => {
        return value.length <= maxLength;
    }
};

const defaultErrorMessagingMapping = {
    isRequired: ({ input }) => {
        return `${input} cannot be empty.`;
    },
    minLength: ({ input, minLength }) => {
        return `${input} must be at least ${minLength} characters.`;
    },
    maxLength: ({ input, maxLength }) => {
        return `${input} must be at most ${maxLength} characters.`;
    }
};

export class Validator {
    constructor(config) {
        this.config = config;
        this.errorMapping = Object.assign({}, defaultErrorMessagingMapping, config.errorMessagingMapping);
    }

    validateInput(input, value) {
        const { validations, validateOrder } = this.config[input];
        let error = '';

        validateOrder.every((validationRule) => {
            let isValid = validators[validationRule](value, validations[validationRule]);
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

        let isValid = inputs.every((input, key) => {
            const value = input.get('value');
            const validationResult = this.validateInput(key, value);
            validationError = validationResult.error;

            return validationResult.isValid;
        }, this);

        return {
            isValid,
            error: validationError
        };
    }
}
