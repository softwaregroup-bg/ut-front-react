import classnames from 'classnames';

export const getClass = (styles, className) => {
    return className && classnames(className.split(' ').map(name => styles[name]));
};

export const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);
