import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TitledContentBox from '../TitledContentBox';
import DataGrid from '../DataGrid';
import Accordion from '../Accordion';
import { titleTypes, titleMapper } from '../CompareGrid';

import styles from './styles.css';

class CompareGrid extends Component {
    renderDataGrid(data, type) {
        return data.get('data').map((values, index) => {
            const title = titleMapper[type](values.get('boxTitle'));
            return <TitledContentBox
                key={index}
                externalContentClasses={styles.titledBoxBody}
                externalHeaderClasses={styles.titleBoxTitle}
                title={title}
            >
                <DataGrid data={values.get(type)} />
            </TitledContentBox>;
        });
    }

    render() {
        const { data, single } = this.props;
        const columnStyle = single ? styles.whole : styles.half;
        return (
            <div>
                <Accordion
                    title={data.get('title')}
                    marginBottom={false}
                    externalBodyClasses={styles.accordionBody}
                    externalTitleClasses={styles.accordionTitle}
                    className={styles.accordion}
                    collapsed={!data.get('isOpen')}
                >
                    <div className={styles.container}>
                        <div className={columnStyle}>
                            {this.renderDataGrid(data, single ? titleTypes.unapproved : titleTypes.current)}
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
