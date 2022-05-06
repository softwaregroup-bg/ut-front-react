import { textValidations } from '../../validator/constants';
import { isRequiredRule, lengthRule } from '../../validator';

export function prepareErrors(errors) {
    const result = {};
    errors.forEach((error) => {
        result[error.key] = error.errorMessage;
    });
    return result;
}

export function getRejectReasonValidationRules() {
    return [
        {key: 'rejectReason', type: textValidations.isRequired, errorMessage: 'Reason for rejection is required.'},
        {key: 'rejectReason', type: textValidations.length, minVal: 3, maxVal: 900, errorMessage: 'The reason should be between 3 and 900 symbols long.'}
    ];
}

export function rejectReasonValidator(source, validations, result) {
    result = result || { isValid: true, errors: [] };
    if (validations) {
        validations.forEach((validation) => {
            if (validation.type === textValidations.isRequired) {
                isRequiredRule(source, validation, result);
            }
            if (validation.type === textValidations.length) {
                lengthRule(source, validation.minVal, validation.maxVal, validation, result);
            }
        });
    }
    return result;
}
