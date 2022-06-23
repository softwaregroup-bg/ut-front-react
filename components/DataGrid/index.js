import PropTypes from 'prop-types';
import React from 'react';
import KeyValueRow from '../DataList/KeyValueRow';
import classnames from 'classnames/bind';

import styles from './styles.css';
const cx = classnames.bind(styles);
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
            wrapperClass={cx(row.get('wrapperClass'))}
            keyClass={cx(row.get('keyClass'))}
            valueClass={cx(row.get('valueClass'))}
            key={index}
            keyNode={row.get('key')}
        >
            {row.getIn(['value', 'filename']) ? <a href={`${window.location.origin}/file-upload/${row.getIn(['value', 'filename'])}`} target='_blank'>Open File</a> : row.get('value')}
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
