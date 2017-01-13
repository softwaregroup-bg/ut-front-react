import React, { PropTypes } from 'react';
import style from './style.css';
import classnames from 'classnames';

const Col = (props) => {
    let getColumnSizeClass = (isXs, colWidth, colSize) => {
        let size = colSize;
        if (isXs === true && !colSize) {
            size = 12;
        }
        return formatClass(colWidth, size);
    };
    let formatClass = (colWidth, size, type) => {
        let pullOrPush = type ? `-${type}` : '';
        return `col-${colWidth}${pullOrPush}-${size}`;
    };

    let colClasses = [];
    const colWidths = ['xs', 'sm', 'md', 'lg', 'xl'];
    colWidths.forEach(colWidth => {
        const columnProp = props[colWidth];
        const isXs = colWidth === 'xs';
        if (!columnProp && !isXs) {
            return;
        }
        let colClass;
        if (columnProp != null && typeof columnProp === 'object') {
            colClasses.push(formatClass(colWidth, columnProp.size));
            if (columnProp.pull) {
                colClasses.push(formatClass(colWidth, columnProp.size, 'pull'));
            }
            if (columnProp.push) {
                colClasses.push(formatClass(colWidth, columnProp.size, 'push'));
            }
            if (columnProp.offset) {
                colClasses.push(formatClass(colWidth, columnProp.size, 'offset'));
            }
        } else {
            colClass = getColumnSizeClass(isXs, colWidth, columnProp);
            colClasses.push(colClass);
        }
    });
    // gutter
    if (props.gutter) {
        if (props.gutter === true) {
            colClasses.push('col-gutter');
        } else if (props.gutter != null && typeof props.gutter === 'object') {
            if (props.gutter.left) {
                colClasses.push('col-gutter-left');
            }
            if (props.gutter.right) {
                colClasses.push('col-gutter-right');
            }
        }
    }
    let classes = () => {
        let combinedClasses = '';
        colClasses.forEach((clss) => {
            combinedClasses = classnames(combinedClasses, style[clss]);
        });
        return combinedClasses;
    };
    return (
        <div className={classes()}>{props.children}</div>
    );
};

const columnsNumbers = PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
const columnsStrings = PropTypes.oneOf(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
const stringOrNumberProp = PropTypes.oneOfType([columnsNumbers, columnsStrings]);
const columnProps = PropTypes.oneOfType([
    stringOrNumberProp,
    PropTypes.shape({
        size: stringOrNumberProp.isRequired,
        push: stringOrNumberProp,
        pull: stringOrNumberProp,
        offset: stringOrNumberProp
    })
]);

Col.propTypes = {
    children: PropTypes.any,
    gutter: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.shape({
            left: PropTypes.bool,
            right: PropTypes.bool
        })
    ]),
    xs: columnProps,
    sm: columnProps,
    md: columnProps,
    lg: columnProps,
    xl: columnProps
};
export default Col;
