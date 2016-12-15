import { capitalizeFirstLetter } from './helpers';

const computeStyle = (styleRule, element, { skip }={}) => {
    let dimensions = ['top', 'right', 'bottom', 'left'];
    return dimensions.reduce((result, currentDimension) => {
        let propertyName = styleRule + capitalizeFirstLetter(currentDimension);
        result[propertyName] = skip ? 0 : parseFloat(element.style[propertyName]) || 0;

        return result;
    }, {});
}

export const getMarginBox = (element, { skipBorders = false } = {}) => {
    let rect = element.getBoundingClientRect();
    let margins = computeStyle('margin', element);
    let borders = computeStyle('border', element, { skip: skipBorders });

    return {
        width: rect.width + margins.marginLeft + margins.marginRight + borders.borderLeft + borders.borderRight,
        height: rect.height + margins.marginTop + margins.marginBottom + borders.borderTop + borders.borderBottom
    };
};
