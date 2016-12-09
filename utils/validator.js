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
        return `Field ${input} is required.`;
    },
    minLength: ({ input, minLength }) => {
        return `Min length for ${input} is ${minLength}`;
    },
    maxLength: ({ input, maxLength }) => {
        return `Max length for ${input} is ${maxLength}`;
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
