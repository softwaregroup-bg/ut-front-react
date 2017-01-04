import classnames from 'classnames';

export const getClass = (styles, className) => className && classnames(className.split(' ').map(name => styles[name]));

export const breakOnSpaceChars = (str) => str.split('\\n');

export const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);
