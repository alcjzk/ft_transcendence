import Session from './Session.js';

const DEFAULT_LANGUAGE = 'en';

export const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
};

export const setPage = page => {
    document.body.replaceChildren(page);
};

export const isDigitString = value => {
    if (typeof value !== 'string')
        return false;
    return /^\d+$/g.test(value);
};

export const localize = (translations) => {
    if (translations.hasOwnProperty(Session.language))
        return translations[Session.language];
    else if (!translations.hasOwnProperty(DEFAULT_LANGUAGE))
        console.error(`Invalid translations: ${translations}`);
    else
        this.print(translations[DEFAULT_LANGUAGE]);
};


