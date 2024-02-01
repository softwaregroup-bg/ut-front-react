import { fromJS } from 'immutable';
import * as actionTypes from './actionTypes';

const defaultHeaderInfo = fromJS([]);

export function headerInfo(state = defaultHeaderInfo, action) {
    switch (action.type) {
        case actionTypes.SET_HEADER_INFO:
            if (Array.isArray(action.headerInfo)) {
                if (!state.size) return fromJS(action.headerInfo);

                const currentItems = state.toJS();
                const newItems = action.headerInfo.map(item => item.label);
                const mergedArray = currentItems.filter(item => !newItems.includes(item.label)).concat(action.headerInfo);
                return fromJS(mergedArray);
            }
            break;
        case actionTypes.REMOVE_HEADER_ITEM:
            if (typeof action.label === 'string') {
                const filteredList = state.filter(item => item.get('label') !== action.label);
                return filteredList;
            }
            break;
        default:
            break;
    }
    return state;
}

export default { headerInfo };