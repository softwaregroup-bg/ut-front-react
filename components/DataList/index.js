import React from 'react';
import PropTypes from 'prop-types';
import KeyValueRow from './KeyValueRow';

// DataList component may recieve data property which is array of objects that looks like this:
// [
//   {
//     key: string,
//     value: string or function that returns react element or dom node,
//     orientation: 'horizontal' || 'vertical'
//   }
// ]
const DataList = ({data}) => {
    const rows = data.map((row, index) => (<KeyValueRow wrapperClass={row.wrapperClass} keyClass={row.keyClass} valueClass={row.valueClass} key={index} keyNode={row.key} orientation={row.orientation ? row.orientation : 'horizontal'}>{row.value}</KeyValueRow>));
    return (
        <div>
            {rows}
        </div>
    );
};

DataList.propTypes = {
    data: PropTypes.array
};

export default DataList;
