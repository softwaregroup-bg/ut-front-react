import React, {PropTypes} from 'react';
import KeyValueRow from './KeyValueRow';

// DataList component may recieve data property which is array of objects that looks like this:
// [
//   {
//     key: string,
//     value: string or function that returns react element or dom node or an object that has a 'filename' property (eg. 1655987249251_file.png),
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
            keyNode={row.get('key')}>
            {row.getIn(['value', 'filename']) ? <a rel='noreferrer' href={`${window.location.origin}/file-upload/${row.getIn(['value', 'filename'])}`} target='_blank'>Open File</a> : row.get('value')}
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
