export const inputs = {
    'username': {
        name: 'username',
        type: 'text',
        value: '',
        error: '',
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
        validations: {
            isRequired: true,
            minLength: 2,
            maxLength: 30
        }
    }
};

export const getInputs = (inputNames) => {
    return inputNames.map(name => inputs[name]);
}
