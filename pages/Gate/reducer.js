import {actionList} from './actions';
import Immutable from 'immutable';
const defaultState = Immutable.Map({resultId: 0});

export default (state = defaultState, action) => {
    if (action.error && action.error.type === 'identity.systemError') {
        return state.set('forceLogOut', true);
    } else if (action.type === actionList.CORE_ITEM_TRANSLATION_FETCH) {
        state = state.set('reqState', action.methodRequestState);
        if (action.methodRequestState === 'finished') {
            let texts = [];
            let pagination = {};
            if (action.result && action.result.itemTranslationFetch) {
                texts = action.result.itemTranslationFetch;
                pagination = action.result.pagination[0];
            }
            if (action.params.keyValue && texts.length) {
                const newText = {};
                texts.map((text) => {
                    newText[text.itemName] = text.itemNameTranslation;
                });
                texts = newText;
            }
            return state
                .set('resultId', (v) => (v + 1))
                .set('texts', Immutable.fromJS(texts))
                .set('pagination', Immutable.fromJS(pagination))
                .set('activeFilters', Immutable.fromJS(action.params))
                .set('loaded', true)
                .set('forceLogOut', false);
        }
        return state;
    } else if (state.forceLogOut) {
        return state.set('forceLogOut', false);
    }
    return state;
};
