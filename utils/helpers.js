import classnames from 'classnames';

export const getClass = (styles, className) => {
    return className && classnames(className.split(' ').map(name => styles[name]));
};
