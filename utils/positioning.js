const positioning = {
    'top-left': ({ width, height }) => ({ top: 0, left: 0 }),
    'top-right': ({ width, height }) => ({ top: 0, left: `${width}px`}),
    'bottom-left': ({ width, height }) => ({ top: `${height}px`, left: 0 }),
    'bottom-right': ({ width, height }) => ({ top: `${height}px`, left: `${width}px`}),
    'right-top': ({ width, height }) => ({ top: 0, right: 0 }),
    'right-bottom': ({ width, height }) => ({ top: `${height}px`, right: 0 })
};

export const getDimensions = (position, targetDimensions) => {
    return positioning[position](targetDimensions);
}
