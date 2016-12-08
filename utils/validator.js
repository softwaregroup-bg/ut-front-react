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

export const createValidatorPerForm = (config) => {
    const errorMapping = Object.assign({}, defaultErrorMessagingMapping, config.errorMessagingMapping);

    return (input, value) => {
            const { validations, validateOrder } = config[input];
            let error = '';

            validateOrder.every((validationRule) => {
                let isValid = validators[validationRule](value, validations[validationRule]);
                if (!isValid) {
                    error = errorMapping[validationRule]({...validations, input});
                }

                return isValid;
            });

            return {
                isValid: !error,
                error
            };
      };
};
