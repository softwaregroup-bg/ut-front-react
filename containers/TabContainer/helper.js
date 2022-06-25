import immutable from 'immutable';

export function prepareErrors(errors, currentErrors) {
    const result = currentErrors || {};
    errors.forEach((error) => {
        // Exculude array with text case (user should handle updating error redux state)
        if (error.key) {
            const errorKey = error.key[error.key.length - 1]; // only last key it should be array
            result[errorKey] = error.errorMessage;
        } else if (error.keyArray && error.keyText) {
            const errorKey = error.keyArray[error.keyArray.length - 1] + '-' + error.keyText[error.keyText.length - 1] + '-' + error.index;
            result[errorKey] = error.errorMessage;
        } else if (error.keyArray) {
            result[error.keyArray.join(',')] = error.errorMessage; // full key with sep = ',', becuase last key may have chance to duplicate
        }
    });

    return result;
}

export function getAssignedRoles(rolesPossibleToAssign, assignedRoles) {
    const roles = rolesPossibleToAssign.toJS();
    const assigned = assignedRoles.toJS();
    const currentRoles = roles.reduce((acc, role) => {
        if (Object.prototype.hasOwnProperty.call(assigned, role.actorId) && assigned[role.actorId]) {
            role.isAssigned = 1;
            acc.push(role);
        }
        return acc;
    }, []);
    return immutable.fromJS(currentRoles);
};
