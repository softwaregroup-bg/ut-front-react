import { CORE_ITEM_TRANSLATION_FETCH } from './actions';
import Immutable from 'immutable';

const defaultState = Immutable.Map({});

// TODO: check translations
export default (state = defaultState, action) => {
    if (action.error && action.error.type === 'identity.systemError') {
        return state.set('forceLogOut', true);
    } else if (action.type === CORE_ITEM_TRANSLATION_FETCH) {
        if (action.methodRequestState === 'finished') {
            let texts = [];
            let pagination = {};

            if (action.result && action.result.itemTranslationFetch) {
                texts = action.result.itemTranslationFetch;
                pagination = action.result.pagination[0];
            }
            if (action.params.keyValue && texts.length) {
                let newText = {};

                texts.map((text) => {
                    newText[text.itemName] = text.itemNameTranslation;
                });
                texts = newText;
            }
            return state
                .set('texts', Immutable.fromJS(texts))
                .set('pagination', Immutable.fromJS(pagination))
                .set('activeFilters', Immutable.fromJS(action.params))
                .set('loaded', true)
                .set('forceLogOut', false);
        }
        return state;
    }
    return state;
};
