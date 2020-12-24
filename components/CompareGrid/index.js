import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Text from '../Text';

import Accordion from '../Accordion';
import CompareGridItem from './CompareGridItem';
import CustomCompareGridItem from './CustomCompareGridItem';

import styles from './styles.css';

export const titleTypes = {
    current: 'current',
    unapproved: 'unapproved'
};

export const titleMapper = {
    current: (boxTitle) => (`information ${boxTitle || ''}`),
    unapproved: (boxTitle) => (`updated information ${boxTitle || ''}`)
};

class CompareGrid extends Component {
    renderItems() {
        const { isNew, isDeleted, data } = this.props;
        return data.map((item, index) => {
            if (item.has('data') && item.get('data').size) {
                return <CompareGridItem key={index} data={item} single={!!isNew || !!isDeleted || false} />;
            }
            if (item.has('customComponent') && item.get('customComponent').size) {
                return <CustomCompareGridItem key={index} data={item} single={!!isNew || !!isDeleted || false} />;
            }
        });
    }

    render() {
        const {isNew, isDeleted, rejectReason, staticStrings} = this.props;
        return (
            <div className={styles.wrapper}>
                {isNew && !isDeleted && <h1 className={styles.newEntity}><Text>{staticStrings.headingIsNew}</Text></h1>}
                {isDeleted && <h1 className={styles.rejectTextField}><Text>{staticStrings.headingWillBeDeleted}</Text></h1>}
                {rejectReason &&
                <Accordion
                    title='Changes Rejected'
                    marginBottom={false}
                    fullWidth
                    externalBodyClasses={styles.accordionBody}
                    externalTitleClasses={styles.accordionTitle}
                    className={styles.accordion}
                    collapsed={false}
                >
                    <div className={styles.container}>
                        <div className={styles.whole}>
                            <p className={styles.rejectTextField}><Text>{rejectReason}</Text></p>
                        </div>
                    </div>
                </Accordion>}
                {this.renderItems()}
            </div>
        );
    }
}

CompareGrid.propTypes = {
    staticStrings: PropTypes.shape({
        headingIsNew: PropTypes.string,
        headingWillBeDeleted: PropTypes.string
    }),
    isNew: PropTypes.bool,
    isDeleted: PropTypes.bool,
    rejectReason: PropTypes.string,
    data: PropTypes.object // immutable List
};

export default CompareGrid;
