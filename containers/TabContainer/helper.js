import immutable from 'immutable';

export function prepareErrors(errors, currentErrors) {
    let result = currentErrors || {};
    errors.forEach((error) => {
        // Exculude array with text case (user should handle updating error redux state)
        if (error.key) {
            let errorKey = error.key[error.key.length - 1]; // only last key it should be array
            result[errorKey] = error.errorMessage;
        } else if (error.keyArray && error.keyText) {
            let errorKey = error.keyArray[error.keyArray.length - 1] + '-' + error.keyText[error.keyText.length - 1] + '-' + error.index;
            result[errorKey] = error.errorMessage;
        }
    });

    return result;
}

export function getAssignedRoles(rolesPossibleToAssign, assignedRoles) {
    let roles = rolesPossibleToAssign.toJS();
    let assigned = assignedRoles.toJS();
    let currentRoles = roles.reduce((acc, role) => {
        if (assigned.hasOwnProperty(role.actorId) && assigned[role.actorId]) {
            role.isAssigned = 1;
            acc.push(role);
        }
        return acc;
    }, []);
    return immutable.fromJS(currentRoles);
};
