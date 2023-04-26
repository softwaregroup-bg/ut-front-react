import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import classnames from 'classnames';
import Text from '../../Text';
import style from './style.css';

const KeyValueRow = ({ wrapperClass, keyClass, valueClass, keyNode, orientation = 'horizontal', bordered = false, children }) => {
    const {WrapperComponentName, CellComponentName} = getComponentsName(orientation);
    const wrapperClasses = classnames({
        borderedHorizontalOrientation: bordered && orientation === 'horizontal',
        borderedVerticalOrientation: bordered && orientation === 'vertical'
    });
    const valueClasses = isHorizontal(orientation) ? style.valueCell : null;
    return (
        <WrapperComponentName xs='6' className={`${wrapperClass} ${wrapperClasses}`}>
            <CellComponentName xs='6' className={`${keyClass} ${style.keyCell}`} ><Text>{keyNode}</Text></CellComponentName>
            <CellComponentName xs='6' className={`${valueClass} ${valueClasses}`} >{children}</CellComponentName>
        </WrapperComponentName>
    );
};

function isHorizontal(orientation) {
    return orientation === 'horizontal';
}

function getComponentsName(orientation) {
    const cases = {
        horizontal: {
            WrapperComponentName: Row,
            CellComponentName: Col
        },
        vertical: {
            WrapperComponentName: Col,
            CellComponentName: Row
        }
    };

    return cases[orientation];
}

KeyValueRow.propTypes = {
    // wrapper: PropTypes.object,
    keyNode: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]).isRequired,
    wrapperClass: PropTypes.string,
    keyClass: PropTypes.string,
    valueClass: PropTypes.string,
    // valueNode: PropTypes.object,
    children: PropTypes.node,
    orientation: PropTypes.oneOf(['horizontal', 'vertical']),
    bordered: PropTypes.bool
};

export default KeyValueRow;
