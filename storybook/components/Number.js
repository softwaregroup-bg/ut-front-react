import PropTypes from 'prop-types';
import React from 'react';
import { storiesOf } from '@storybook/react';
import Number from '../../components/Number';
import dateFormat from 'date-fns/format';

storiesOf('Number to localize', module)
    .add('Default', () => (
        <Wrap>
            <div>localise number '1000':</div>
            <Number>1000</Number>
        </Wrap>
    ));

class Wrap extends React.Component {
    getChildContext() {
        return {
            money: function(amount, currency, locale) {
                if (!currency) currency = 'EUR';
                if (!locale) locale = 'en-UK';
                return new Intl.NumberFormat(locale, {
                    style: 'currency',
                    currency: currency,
                    minimumFractionDigits: 2
                }).format(amount);
            },
            dateFormat: function(date, format) {
                if (!format) format = 'yyyy-MM-dd';
                return dateFormat(new Date(date), format);
            },
            numberFormat: function(num, format) {
                if (!format) format = '2|.|';
                const parts = format.split('|');
                if (parts.length !== 3) return num;
                num = parseInt(num).toFixed(parseInt(parts[0]));
                if (parts[1]) num = num.toString().replace('.', parts[1]);
                num = num.toString().replace(/\B(?=(\d{3})+\b)/g, parts[2]);
                return num;
            }
        };
    }

    render() {
        return <div>{this.props.children}</div>;
    }
}
Wrap.propTypes = {
    children: PropTypes.any
};
Wrap.childContextTypes = {
    money: PropTypes.func,
    dateFormat: PropTypes.func,
    numberFormat: PropTypes.func
};
