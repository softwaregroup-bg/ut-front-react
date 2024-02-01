import * as actionTypes from './actionTypes';
/**
 * @typedef {Object} Item
 * @property {string} label - The label of the item. also its unique key
 * @property {string} value - The value of the item.
 */

/**
 * @function setHeaderInfo
 * @param {Item[]} headerInfo - An array of items.
 */
export function setHeaderInfo(headerInfo = []) {
    return {
        type: actionTypes.SET_HEADER_INFO,
        headerInfo
    };
}

/**
 * @function removeHeaderItem
 * @param {string} label - An item's label.
 */
export function removeHeaderItem(label) {
    return {
        type: actionTypes.REMOVE_HEADER_ITEM,
        label
    };
}
