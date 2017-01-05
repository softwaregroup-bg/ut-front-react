const positioning = {
    'top-left': ({ width, height }, { top, right, bottom, left }) => {
        return {
            top: `${0 + top - bottom}px`,
            left: `${0 + left - right}px`
        };
    },
    'top-right': ({ width, height }, { top, right, bottom, left }) => {
        return {
            top: `${0 + top - bottom}px`,
            left: `${width + left - right}px`
        };
    },
    'bottom-left': ({ width, height }, { top, right, bottom, left }) => {
        return {
            top: `${height + top - bottom}px`,
            left: `${0 + left - right}px`
        };
    },
    'bottom-right': ({ width, height }, { top, right, bottom, left }) => {
        return {
            top: `${height + top - bottom}px`,
            left: `${width + left - right}px`
        };
    },
    'right-top': ({ width, height }, { top, right, bottom, left }) => {
        return {
            top: `${0 + top - bottom}px`,
            right: `${0 + right - left}px`
        };
    },
    'right-bottom': ({ width, height }, { top, right, bottom, left }) => {
        return {
            top: `${height + top - bottom}px`,
            right: `${0 + right - left}px`
        };
    }
};

const getOffsets = (targetDimensions, additionalOffsets = {}) => {
    let directions = ['top', 'right', 'bottom', 'left'];
    return directions.reduce((offsets, currentDirection) => {
        offsets[currentDirection] = additionalOffsets[currentDirection] || 0;

        return offsets;
    }, {});
};

export const getDimensions = (position, targetDimensions, additionalOffsets) => {
    let offsets = getOffsets(position, additionalOffsets);
    if (!positioning[position]) {
        console.error("ERROR: Invalid position direction passed for Menu: ", position);
        return {top: 0, right: 0};
    }
    return positioning[position](targetDimensions, offsets);
};
