import React, { PropTypes } from 'react';
import CollapsableContent from '../../components/CollapsableContent';

import classnames from 'classnames';
import style from './style.css';

const Aside = ({children, right, showCollapsibleButton, visibleStyleWidth, heading, styles}) => {
    let className = classnames('tableCell', 'vaTop', 'h100pr', 'wAuto', 'maxWidth2cols');

    if (right) {
        className = classnames(style.profileInfoWrap, className);
    } else {
        className = classnames(style.treeStructureWrap, className);
    }

    return (
        <div className={className}>
            <CollapsableContent
                heading={heading}
                orientation={right ? 'right' : 'left'}
                collapsedStyles={{width: '40px', height: '100%'}}
                visibleStyles={{height: '100%', ...styles}}
                showCollapsibleButton={showCollapsibleButton}
            >
                {children}
            </CollapsableContent>
        </div>
    );
};

Aside.propTypes = {
    children: PropTypes.any,
    right: PropTypes.bool,
    heading: PropTypes.string,
    styles: PropTypes.object,
    visibleStyleWidth: PropTypes.number,
    showCollapsibleButton: PropTypes.bool
};

Aside.defaultProps = {
    right: false,
    visibleStyleWidth: 220,
    styles: {}
};

export default Aside;
