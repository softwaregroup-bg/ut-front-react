export const inputs = {
    username: {
        name: 'username',
        type: 'text',
        label: 'Username / Nombre de usuario',
        value: '',
        error: '',
        validateOrder: ['isRequired', 'minLength', 'maxLength'],
        validations: {
            isRequired: true,
            minLength: 2,
            maxLength: 200
        }
    },
    password: {
        name: 'password',
        type: 'password',
        label: 'Password / Contraseña',
        value: '',
        error: '',
        validateOrder: ['isRequired', 'minLength', 'maxLength'],
        validations: {
            isRequired: true,
            minLength: 3,
            maxLength: 200
        }
    },
    hiddenPassword: {
        name: 'password',
        type: 'password',
        label: 'Password / Contraseña',
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
        label: 'New password / Nueva contraseña',
        value: '',
        error: '',
        validateOrder: ['isRequired', 'minLength', 'maxLength', 'shouldMatchField'],
        validations: {
            isRequired: true,
            minLength: 2,
            maxLength: 200,
            shouldMatchField: 'confirmPassword'
        }
    },
    confirmPassword: {
        name: 'confirmPassword',
        type: 'password',
        label: 'Confirm password / Confirmar Contraseña',
        value: '',
        error: '',
        validateOrder: ['isRequired', 'minLength', 'maxLength', 'shouldMatchField'],
        validations: {
            isRequired: true,
            minLength: 2,
            maxLength: 200,
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
        validateOrder: ['isRequired', 'length'],
        validations: {
            isRequired: true,
            length: 4
        }
    },
    email: {
        name: 'email',
        type: 'email',
        label: 'Email / Email',
        value: '',
        error: '',
        validateOrder: ['isRequired'],
        validations: {
            isRequired: true
        }
    },
    confirmEmail: {
        name: 'confirmEmail',
        type: 'email',
        label: 'Confirm Email / Confirmar Email',
        value: '',
        error: '',
        validateOrder: ['isRequired', 'shouldMatchField'],
        validations: {
            isRequired: true,
            shouldMatchField: 'email'
        }
        // skipSubmit: true
    },
    captcha: {
        name: 'captcha',
        type: 'text',
        label: 'Captcha',
        value: '',
        error: 'Validate captcha',
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
        inputs: getInputs(['captcha', 'username']),
        disabledFields: [],
        buttonLabel: 'Next / Próximo',
        title: 'System Login / Inicio de sesión del sistema'
    },
    password: {
        inputs: getInputs(['captcha', 'username', 'hiddenPassword', 'password']),
        disabledFields: ['captcha', 'username'],
        buttonLabel: 'Login / Acceso',
        title: 'Login with password / Iniciar sesión con contraseña'
    },
    newPassword: {
        inputs: getInputs(['captcha', 'username', 'hiddenPassword', 'password', 'newPassword', 'confirmPassword']),
        disabledFields: ['captcha', 'username', 'hiddenPassword', 'password'],
        buttonLabel: 'Change / Cambio',
        title: 'Password change required / Se requiere cambio de contraseña'
    },
    resetPassword: {
        inputs: getInputs(['captcha', 'username', 'email', 'confirmEmail']),
        buttonLabel: 'Change / Cambio',
        disabledFields: ['captcha', 'username'],
        title: 'Reset Password / Restablecer la contraseña'
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

export const ERROR_CAPTCHA = 'Validate Captcha / Valida Captcha';
