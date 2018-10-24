import React, { PropTypes } from 'react';
import { moneyInputOptions } from '../../constants';
import Input from './index';

export default function MoneyInput(props) {
    // The options prop will tell Input to use a Cleave.js input instead of <input> tag
    return <Input options={props.options || moneyInputOptions} {...props} />;
};
