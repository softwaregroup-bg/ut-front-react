import immutable from 'immutable';

/**
 * @param arr1 - immutable List with current values: [{key: string, value: string}...]
 * @param arr2 - immutable List with new values: [{key: string, value: string}...]
 * @param next - callback function (optional)
 * @return immutable map: {isOpen: bool, current: [{}...], unapproved: [{}...]}
 */
export function compareValuesWithDifferentLength(arr1, arr2, next) {
    // helper functions
    let checkIfExist = (arr, el) => arr.find((e) => e.get('key') === el.get('key'));
    let isBold = (el) => el.get('value') === 'Primary' ? 'bold' : '';
    let getIndex = (arr, el) => arr.findIndex((e) => e.get('key') === el.get('key') && e.get('value') === el.get('value'));
    let compare = (arr, el, index) => {
        let sameKey = el.get('key') === arr.getIn([index, 'key']);
        let sameValue = el.get('value') === arr.getIn([index, 'value']);
        return sameKey && sameValue;
    };
    let applyClass = (el, className) => {
        let bold = isBold(el);
        return el
                .set('keyClass', className)
                .set('valueClass', className + bold)
                .set('wrapperClass', className);
    };
    let boxData = {};
    let result = {
        // this is used to indicate if the accordion should be open or not
        isOpen: false,
        data: []
    };
    // current values
    boxData.current = arr1.map((el) => {
        // if the value passed is primary it should be bold
        let bold = isBold(el);

        // check if current value exist in the array of new values
        if (checkIfExist(arr2, el)) {
            // if it exist find its index in the array with the new values
            let index = getIndex(arr2, el);

            // if the same keys and values are not changed this means that there is no change on the current value
            if (compare(arr2, el, index)) {
                el = el.set('valueClass', bold);
                return el;
            } else {
                // if there is change this means that accordion should be open
                if (!result.isOpen) {
                    result.isOpen = true;
                }
                // and the proper css classes should be applied
                return applyClass(el, 'changedCurrentValue');
            }
        } else {
            if (!result.isOpen) {
                result.isOpen = true;
            }
            // if current value is not present in new values that means it is deleted and proper css classes should be applied
            return applyClass(el, 'changedCurrentValue');
        }
    });
    // similar logic is used for new values too
    boxData.unapproved = arr2.map((el) => {
        let bold = isBold(el);
        if (checkIfExist(arr1, el)) {
            let index = getIndex(arr1, el);
            if (compare(arr1, el, index)) {
                el.valueClass = bold;
                return el;
            } else {
                if (!result.isOpen) {
                    result.isOpen = true;
                }
                return applyClass(el, 'changedNewValue');
            }
        } else {
            if (!result.isOpen) {
                result.isOpen = true;
            }
            return applyClass(el, 'changedNewValue');
        }
    });
    if (boxData.current.size || boxData.unapproved.size) {
        result.data.push(boxData);
    }

    if (typeof next === 'function') {
        return next(immutable.fromJS(result));
    }

    return immutable.fromJS(result);
}

export const shouldBeOpen = (options) => (compared) => {
    if (options.isNew || options.isDeleted) {
        return compared.set('isOpen', true);
    } else {
        return compared;
    }
};

export const compare = (title) => (currentValues, newValues, options) => compareValuesWithDifferentLength(
    currentValues,
    newValues,
    shouldBeOpen(options)
).set('title', title);