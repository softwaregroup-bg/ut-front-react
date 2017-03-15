import React, {PropTypes} from 'react';

import TitledContentBox from '../TitledContentBox';
import DataGrid from '../DataGrid';
import Accordion from '../Accordion';

import styles from './styles.css';

const CompareGrid = ({data, single}) => {
    let columnStyle = single ? styles.whole : styles.half;
    return (
        <div>
            <Accordion
              title={data.get('title')}
              marginBottom={false}
              externalBodyClasses={styles.accordionBody}
              externalTitleClasses={styles.accordionTitle}
              className={styles.accordion}
              collapsed={!data.get('isOpen')}>
                <div className={styles.container}>
                    <div className={columnStyle}>
                        {data.get('data').map((values, index) => {
                            return <TitledContentBox
                              key={index}
                              externalContentClasses={styles.titledBoxBody}
                              externalHeaderClasses={styles.titleBoxTitle}
                              title={`information ${values.get('boxTitle') || ''}`}>
                                <DataGrid data={values.get('current')} />
                            </TitledContentBox>;
                        })}
                    </div>
                    {!single &&
                    <div className={columnStyle}>
                        {data.get('data').map((values, index) => {
                            return <TitledContentBox
                              key={index}
                              externalContentClasses={styles.titledBoxBody}
                              externalHeaderClasses={styles.titleBoxTitle}
                              title={`updated information ${values.get('boxTitle') || ''}`}>
                                <DataGrid data={values.get('unapproved')} />
                            </TitledContentBox>;
                        })}
                    </div>}
                </div>
            </Accordion>
        </div>
    );
};

CompareGrid.propTypes = {
    data: PropTypes.object.isRequired,
    single: PropTypes.bool
};

export default CompareGrid;
