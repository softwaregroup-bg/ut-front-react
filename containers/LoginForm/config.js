export const inputs = {
    username: {
        name: 'username',
        type: 'text',
        label: 'Username',
        value: '',
        error: '',
        validateOrder: ['isRequired', 'minLength', 'maxLength'],
        validations: {
            isRequired: true,
            minLength: 2,
            maxLength: 100
        }
    },
    password: {
        name: 'password',
        type: 'password',
        label: 'Password',
        value: '',
        error: '',
        validateOrder: ['isRequired'],
        validations: {
            isRequired: true
        }
    },
    hiddenPassword: {
        name: 'password',
        type: 'password',
        label: 'Password',
        value: '',
        error: '',
        validateOrder: [],
        validations: {},
        shouldSubmit: false,
        hidden: true
    },
    newPassword: {
        name: 'newPassword',
        type: 'password',
        label: 'New password',
        value: '',
        error: '',
        validateOrder: ['isRequired'],
        validations: {
            isRequired: true
        }
    },
    confirmPassword: {
        name: 'confirmPassword',
        type: 'password',
        label: 'Confirm password',
        value: '',
        error: '',
        validateOrder: ['isRequired', 'shouldMatchField'],
        validations: {
            isRequired: true,
            shouldMatchField: 'newPassword'
        },
        skipSubmit: true
    },
    otp: {
        name: 'otp',
        type: 'password',
        label: 'Otp code',
        value: '',
        error: '',
        validateOrder: ['isRequired'],
        validations: {
            isRequired: true
        }
    }
};

export const getInputs = (inputNames) => {
    return inputNames.reduce((memo, current) => {
        memo[current] = inputs[current];
        return memo;
    }, {});
};

export const loginSteps = {
    initial: {
        inputs: getInputs(['username']),
        buttonLabel: 'Next',
        title: 'System Login'
    },
    password: {
        inputs: getInputs(['username', 'hiddenPassword', 'password']),
        disabledFields: ['username'],
        buttonLabel: 'Login',
        title: 'Login with password'
    },
    newPassword: {
        inputs: getInputs(['username', 'newPassword', 'confirmPassword']),
        disabledFields: ['username'],
        buttonLabel: 'Change',
        title: 'Password change required'
    },
    otp: {
        inputs: getInputs(['username', 'otp']),
        disabledFields: ['username'],
        buttonLabel: 'Login',
        title: 'Login with OTP'
    },
    checkLdapUser: {
        inputs: getInputs(['username', 'hiddenPassword', 'password']),
        disabledFields: ['username'],
        buttonLabel: 'Login',
        title: 'Login with password'
    }
};
