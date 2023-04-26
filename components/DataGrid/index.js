import React from 'react';
import PropTypes from 'prop-types';
import KeyValueRow from './KeyValueRow';
import Text from '../Text';

// DataList component may recieve data property which is array of objects that looks like this:
// [
//   {
//     key: string,
//     value: string or function that returns react element or dom node,
//     orientation: 'horizontal' || 'vertical'
//   }
// ]

const DataList = ({data}) => {
    const rows = data.map((row, index) => (
        <KeyValueRow
            wrapperClass={row.get('wrapperClass')}
            keyClass={row.get('keyClass')}
            valueClass={row.get('valueClass')}
            key={index}
            keyNode={row.get('key')}
        >
            {row.get('value') && (row.get('value') === 'Not set' || ['Block', 'Blocked', 'Lock', 'Locked', 'Unblock', 'Unblocked', 'Unlock', 'Unlocked'].includes(row.get('value'))) ? <Text>{row.get('value')}</Text> : row.get('value')}
        </KeyValueRow>));
    return (
        <div>
            {rows}
        </div>
    );
};

DataList.propTypes = {
    data: PropTypes.object // Immutable list
};

export default DataList;
