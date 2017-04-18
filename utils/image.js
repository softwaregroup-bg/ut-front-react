export const resizeImage = (file, scaleDimensions) => {
    const dimensions = getFileDimensions(file);
    const ratio = Math.min(dimensions.width / scaleDimensions.width, dimensions.height / scaleDimensions.height);

    return {
        width: scaleDimensions.width * ratio,
        height: scaleDimensions.height * ratio
    };
};

export const getFileDimensions = (file) => {
    const img = document.createElement('img');
    img.src = file;

    return {
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height
    };
};

export const getViewport = (fileDimensions, scaleDimensions) => {
    const { width, height } = fileDimensions;
    const scaleRatio = scaleDimensions.width / scaleDimensions.height;

    if (scaleDimensions.width === scaleDimensions.height) {
        if (width === height) {
            return {
                width: width / 1.2 >> 0,
                height: height / 1.2 >> 0
            };
        } else {
            const cropSide = Math.min(width, height);

            return {
                width: cropSide,
                height: cropSide
            };
        }
    } else {
        if (width < height) {
            return {
                width,
                height: height / scaleRatio >> 0
            };
        } else if (height < width) {
            return {
                width: width / scaleRatio >> 0,
                height
            };
        } else {
            return {
                width,
                height: height / scaleRatio >> 0
            };
        }
    }
};
