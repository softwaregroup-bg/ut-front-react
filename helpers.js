export const objectHasProps = (object) => {
    for (var prop in object) {
        if (object.hasOwnProperty(prop)) {
            return true;
        }
    }

    return false;
};
