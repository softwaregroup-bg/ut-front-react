import { PropTypes } from 'react';

export const propTypeField = PropTypes.shape({
    name: PropTypes.any.isRequired,
    title: PropTypes.any,
    dataReMap: PropTypes.object,
    style: PropTypes.object,
    className: PropTypes.string
});

export const propTypeFields = PropTypes.arrayOf(propTypeField).isRequired;

export const propTypeData = PropTypes.array.isRequired;
