import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import classnames from 'classnames';
import Text from '../../Text';
import style from './style.css';

const KeyValueRow = ({ wrapperClass, keyClass, valueClass, keyNode, orientation = 'horizontal', bordered = false, children }) => {
    const wrapperClasses = classnames({
        borderedHorizontalOrientation: bordered && orientation === 'horizontal',
        borderedVerticalOrientation: bordered && orientation === 'vertical'
    });
    const valueClasses = isHorizontal(orientation) ? style.valueCell : null;
    return (
        <Grid container className={`${wrapperClass} ${wrapperClasses}`}>
            <Grid item xs={6} className={`${keyClass} ${style.keyCell}`} style={{padding: 4}}><Text>{keyNode}</Text></Grid>
            <Grid item xs={6} className={`${valueClass} ${valueClasses}`} style={{padding: 4}}>{children}</Grid>
        </Grid>
    );
};

function isHorizontal(orientation) {
    return orientation === 'horizontal';
}

KeyValueRow.propTypes = {
    wrapper: PropTypes.object,
    keyNode: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]).isRequired,
    wrapperClass: PropTypes.string,
    keyClass: PropTypes.string,
    valueClass: PropTypes.string,
    valueNode: PropTypes.object,
    children: PropTypes.node,
    orientation: PropTypes.oneOf(['horizontal', 'vertical']),
    bordered: PropTypes.bool
};

export default KeyValueRow;
