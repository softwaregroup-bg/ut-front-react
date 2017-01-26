import classnames from 'classnames';

export const getClass = (styles, className) => className && classnames(className.split(' ').map(name => styles[name]));

export const breakOnSpaceChars = (str) => str.split('\\n');

export const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export const generateUniqueId = () => `${Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)}_${Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)}`;
