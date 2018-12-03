import React, {Component, PropTypes} from 'react';

import TitledContentBox from '../../../components/TitledContentBox';
import DataGrid from '../../../components/DataGrid';
import Accordion from '../../../components/Accordion';
import { titleTypes, titleMapper } from '../CompareGrid';

import styles from './styles.css';

class CompareGrid extends Component {
    renderDataGrid(data, type) {
        return data.get('data').map((values, index) => {
            let title = titleMapper[type](values.get('boxTitle'));
            return <TitledContentBox
              key={index}
              externalContentClasses={styles.titledBoxBody}
              externalHeaderClasses={styles.titleBoxTitle}
              title={title}>
              <DataGrid data={values.get(type)} />
            </TitledContentBox>;
        });
    }

    render() {
        let { data, single } = this.props;
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
                            {this.renderDataGrid(data, titleTypes.current)}
                        </div>
                        {!single &&
                        <div className={columnStyle}>
                            {this.renderDataGrid(data, titleTypes.unapproved)}
                        </div>}
                    </div>
              </Accordion>
            </div>
        );
    }
}

CompareGrid.propTypes = {
    data: PropTypes.object.isRequired,
    single: PropTypes.bool
};

export default CompareGrid;
