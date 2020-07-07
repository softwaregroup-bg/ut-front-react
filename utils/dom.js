import { capitalizeFirstLetter } from './helpers';
import React from 'react';

const computeStyle = (styleRule, element, { skip } = {}) => {
    const dimensions = ['top', 'right', 'bottom', 'left'];
    return dimensions.reduce((result, currentDimension) => {
        const propertyName = styleRule + capitalizeFirstLetter(currentDimension);
        result[propertyName] = skip ? 0 : parseFloat(element.style[propertyName]) || 0;

        return result;
    }, {});
};

const matchesPolyfill = (element, selector) => {
    const elements = (element.document || element.ownerDocument).querySelectorAll(selector);
    let index = 0;

    while (elements[index] && elements[index] !== element) {
        ++index;
    }

    return Boolean(elements[index]);
};

const closestPolyfill = (element, selector) => {
    while (element && element.nodeType === 1) {
        if (matches(element, selector)) {
            return element;
        }

        element = element.parentNode;
    }

    return null;
};

export const getMarginBox = (element, { skipBorders = false } = {}) => {
    // get width and height of element, including margins and borders

    const rect = element.getBoundingClientRect();
    const margins = computeStyle('margin', element);
    const borders = computeStyle('border', element, { skip: skipBorders });

    return {
        width: rect.width + margins.marginLeft + margins.marginRight + borders.borderLeft + borders.borderRight,
        height: rect.height + margins.marginTop + margins.marginBottom + borders.borderTop + borders.borderBottom
    };
};

export const closest = (element, selector) => {
    // returns the closest ancestor of the element which matches the given selectors
    // if there isn't such an ancestor, it returns null

    const closestNative = typeof element.closest === 'function' && element.closest;
    return closestNative ? element.closest(selector) : closestPolyfill(element, selector);
};

export const matches = (element, selector) => {
    // returns true if the element would be selected by the specified selector string
    // otherwise, returns false

    const matchesNative = typeof element.matches === 'function' &&
          (element.matches || element.msMatchesSelector ||
            element.mozMatchesSelector || element.webkitMatchesSelector);

    return matchesNative ? element.matches(selector) : matchesPolyfill(element, selector);
};

export const joinArrayWithBreakTags = (array) => {
    return array.map((element, index) => {
        return (<span key={index}>{element}<br /></span>);
    });
};
