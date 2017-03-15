import React, {PropTypes} from 'react';
import Accordion from 'ut-front-react/components/Accordion';
import CompareGridItem from './CompareGridItem';
import styles from './styles.css';

const CompareGrid = ({isNew, isDeleted, rejectReason, data, staticStrings}) => {
    let renderItems = () => data.map((item, index) => {
        if (item.get('data').size) {
            return <CompareGridItem key={index} data={item} single={!!isNew || !!isDeleted || false} />;
        }
    });
    return (
        <div className={styles.wrapper}>
            {isNew && !isDeleted && <h1 className={styles.newUser}>{staticStrings.headingIsNew}</h1>}
            {isDeleted && <h1 className={styles.rejectTextField}>{staticStrings.headingWillBeDeleted}</h1>}
            {rejectReason &&
                <Accordion
                  title='Changes Rejected'
                  marginBottom={false}
                  fullWidth
                  externalBodyClasses={styles.accordionBody}
                  externalTitleClasses={styles.accordionTitle}
                  className={styles.accordion}
                  collapsed={false}>
                    <div className={styles.container}>
                        <div className={styles.whole}>
                            <p className={styles.rejectTextField}>{rejectReason}</p>
                        </div>
                    </div>
                </Accordion>}
            {renderItems()}
        </div>
    );
};

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
