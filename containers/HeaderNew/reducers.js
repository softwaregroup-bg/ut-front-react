import { List } from 'immutable';
import * as actionTypes from './actionTypes';

const defaultHeaderInfo = new List();

export function headerInfo(state = defaultHeaderInfo, action) {
    switch (action.type) {
        case actionTypes.SET_HEADER_INFO:
            if (Array.isArray(action.headerInfo)) {
                const headerInfo = new List(action.headerInfo);
                return state.mergeDeep(headerInfo);
            }
            break;
        default:
            break;
    }
    return state;
}

export default { headerInfo };
