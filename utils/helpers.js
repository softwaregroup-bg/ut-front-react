import classnames from 'classnames';

export const getClass = (styles, className) => {
    return classnames(className.split(' ').map(name => styles[name]));
};
