export const inputs = {
    'username': {
        name: 'username',
        type: 'text',
        value: '',
        error: '',
        validateOrder: ['isRequired', 'minLength', 'maxLength'],
        validations: {
            isRequired: true,
            minLength: 2,
            maxLength: 30
        }
    },
    'password': {
        name: 'password',
        type: 'password',
        value: '',
        error: '',
        validateOrder: ['isRequired', 'minLength', 'maxLength'],
        validations: {
            isRequired: true,
            minLength: 2,
            maxLength: 30
        }
    }
};

export const getInputs = (inputNames) => {
    return inputNames.reduce((memo, current) => {
        memo[current] = inputs[current];
        return memo;
    }, {});
};
