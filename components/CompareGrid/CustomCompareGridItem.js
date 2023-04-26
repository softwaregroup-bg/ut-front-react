import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TitledContentBox from '../TitledContentBox';
import Accordion from '../Accordion';
import { titleTypes, titleMapper } from '../CompareGrid';

import styles from './styles.css';

class CustomCompareGridItem extends Component {
    renderCustomComponent(data, type) {
        const title = titleMapper[type]();
        const customComponent = data.get('customComponent');
        return <TitledContentBox
            externalContentClasses={styles.titledBoxBody}
            externalHeaderClasses={styles.titleBoxTitle}
            title={title}
        >
            {customComponent.get(type)}
        </TitledContentBox>;
    };

    render() {
        const { data, single } = this.props;
        const columnStyle = single ? styles.whole : styles.half;
        return (
            <div>
                <Accordion
                    title={data.get('title')}
                    marginBottom
                    externalBodyClasses={styles.accordionBody}
                    externalTitleClasses={styles.accordionTitle}
                    className={styles.accordion}
                    collapsed={!data.get('isOpen')}
                >
                    <div className={styles.container}>
                        <div className={columnStyle}>
                            {this.renderCustomComponent(data, titleTypes.current)}
                        </div>
                        {!single &&
                        <div className={columnStyle}>
                            {this.renderCustomComponent(data, titleTypes.unapproved)}
                        </div>}
                    </div>
                </Accordion>
            </div>
        );
    }
};

CustomCompareGridItem.propTypes = {
    data: PropTypes.object.isRequired,
    single: PropTypes.bool
};

export default CustomCompareGridItem;
