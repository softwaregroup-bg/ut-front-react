export const objectHasProps = (object) => {
    for (var prop in object) {
        if (object.hasOwnProperty(prop)) {
            return true;
        }
    }

    return false;
};

/**
 * @param {arr1} [] First array to compare
 * @param {arr2} [] Second array to compare
 * @param {props} [] String - object props
 * Uses a propMapper which holds for each prop number.
 * First, iterates over the first array and increments the number for each prop.
 * Then it iterates over the second array and decrements the number.
 * In the end checks if propMapper has only 0 for each prop.
 *
 * Return if two arrays of object have the SAME LENGTH and each object in them have equal value for props
 */
export function compareArrayOfObject(arr1, arr2, props) {
    if (!Array.isArray(props) && typeof props === 'string') {
        props = [props];
    } else {
        return false;
    }

    let result = true;

    if (arr1.length !== arr2.length) {
        return false;
    }

    let propMapper = {};
    props.forEach((prop) => {
        propMapper[prop] = {};
    });

    for (let i = 0; i < arr1.length; i += 1) {
        let arr1Object = arr1[i];

        props.forEach((prop) => {
            let arr1ObjectValue = arr1Object[prop];
            if (!propMapper[prop][arr1ObjectValue]) {
                propMapper[prop][arr1ObjectValue] = 0;
            }
            propMapper[prop][arr1ObjectValue] += 1;
        });
    }

    for (let i = 0; i < arr2.length; i += 1) {
        let arr2Object = arr2[i];

        props.forEach((prop) => {
            let arr2ObjectValue = arr2Object[prop];
            if (propMapper[prop][arr2ObjectValue]) {
                propMapper[prop][arr2ObjectValue] -= 1;
            }
        });
    }

    for (var prop in propMapper) {
        let currentProp = propMapper[prop];
        for (var number in currentProp) {
            if (currentProp[number] !== 0) {
                return false;
            }
        }
    }

    return result;
}
