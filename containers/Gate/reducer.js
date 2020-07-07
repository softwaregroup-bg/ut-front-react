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

            if (action.result && action.result.translations) {
                texts = action.result.translations;
            }
            if (texts.length) {
                const textsMapping = {};

                texts.map((text) => {
                    textsMapping[text.dictionaryKey] = text.translatedValue;
                });

                texts = textsMapping;
            }
            return state
                .set('texts', Immutable.fromJS(texts))
                .set('activeFilters', Immutable.fromJS(action.params))
                .set('loaded', true)
                .set('forceLogOut', false);
        }
        return state;
    }
    return state;
};
