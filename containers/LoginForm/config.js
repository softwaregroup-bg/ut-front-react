export const inputs = {
    'username': {
        name: 'username',
        type: 'text',
        // placeholder: 'Username',
        label: 'username',
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
        // placeholder: 'Password',
        label: 'password',
        value: '',
        error: '',
        validateOrder: ['isRequired', 'minLength', 'maxLength'],
        validations: {
            isRequired: true,
            minLength: 3,
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
