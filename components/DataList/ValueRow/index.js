import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import Icon from '../../Icon';
import Text from '../../Text';
import style from './style.css';

const ValueRow = ({children = '', hoverValue, showAlert = false, onClick, readOnly, ...props}) => {
    let hValueText = hoverValue;
    if (!hValueText) {
        hValueText = children;
    }
    let alertNode = showAlert ? <Icon icon='status' className={classnames('pull-xs-right', style.alertNode)} /> : '';
    let classes = classnames('f14', style.valueRowValue, {'pointer': !readOnly});
    return (
        <div {...props}>
            <div className={classes} onClick={onClick}>
                {!readOnly && <div className={classnames('f-pink', style.valueRowValue, style.valueRowHover)}>{hValueText}</div>}
                <Text>{children}</Text>
                {alertNode}
            </div>
        </div>
    );
};

ValueRow.propTypes = {
    showAlert: PropTypes.bool,
    onClick: PropTypes.func,
    children: PropTypes.node,
    hoverValue: PropTypes.node,
    isHovered: PropTypes.bool,
    readOnly: PropTypes.bool
};

export default ValueRow;
