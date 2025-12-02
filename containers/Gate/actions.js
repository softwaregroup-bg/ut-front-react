export const CORE_ITEM_TRANSLATION_FETCH = Symbol('CORE_ITEM_TRANSLATION_FETCH');
export const UPDATE_USER_LANGUAGE = Symbol('UPDATE_USER_LANGUAGE');
export const FETCH_LANGUAGES = Symbol('FETCH_LANGUAGES');

export const fetchTranslations = (params) => ({
    type: CORE_ITEM_TRANSLATION_FETCH,
    method: 'core.translation.fetch',
    params: {
        ...params
    }
});

export const updateUserLanguage = (params) => ({
    type: UPDATE_USER_LANGUAGE,
    method: 'user.user.languageChange',
    params: {
        ...params
    }
});

export const fetchLanguages = (params) => ({
    type: FETCH_LANGUAGES,
    method: 'core.language.fetch',
    params: {}
});
