
export function prepareErrors(errors, currentErrors) {
    const result = currentErrors || {};
    errors.forEach((error) => {
        // Exculude array with text case (user should handle updating error redux state)
        if (error.key) {
            const errorKey = error.key[error.key.length - 1]; // only last key it should be array
            // If there's an error for this field already, we don't overwrite it
            if (!result[errorKey]) {
                result[errorKey] = error.errorMessage;
            }
        } else if (error.keyArray && error.keyText) {
            const errorKey = error.keyArray[error.keyArray.length - 1] + '-' + error.keyText[error.keyText.length - 1] + '-' + error.index;
            if (!result[errorKey]) {
                result[errorKey] = error.errorMessage;
            }
        }
    });

    return result;
}

// export function getAssignedRoles(rolesPossibleToAssign, assignedRoles) {
//     let roles = rolesPossibleToAssign.toJS();
//     let assigned = assignedRoles.toJS();
//     let currentRoles = roles.reduce((acc, role) => {
//         if (assigned.hasOwnProperty(role.actorId) && assigned[role.actorId]) {
//             role.isAssigned = 1;
//             acc.push(role);
//         }
//         return acc;
//     }, []);
//     return immutable.fromJS(currentRoles);
// };
