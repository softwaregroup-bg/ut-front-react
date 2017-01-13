import React, {PropTypes} from 'react';
import KeyValueRow from './KeyValueRow';

// DataList component may recieve data property which is array of objects that looks like this:
// [
//   {
//     key: string,
//     value: string or function that returns react element or dom node,
//     orientation: 'horizontal' || 'vertical'
//   }
// ]

// TODO: row will be immutable. Change everything to row.get(wrapperClass);
const DataList = ({data}) => {
    let rows = data.map((row, index) => (
        <KeyValueRow
          wrapperClass={row.wrapperClass}
          keyClass={row.keyClass}
          valueClass={row.valueClass}
          key={index}
          keyNode={row.key}>
            {row.value}
        </KeyValueRow>));
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
