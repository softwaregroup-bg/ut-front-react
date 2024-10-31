import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import { connect } from 'react-redux';
import { List } from 'immutable';

const HeaderInfo = props => {
    const { items } = props;

    if (!items.size) {
        return null;
    }

    return (
        <div className={styles.headerInfo}>
            {
                items.map((item, index) => {
                    return (
                        <div key={`headerItem-${index}`} className={styles.headerInfoItem}>
                            <span className={styles.headerInfoLabel}>{item.get('label')}</span>
                            <span className={styles.headerInfoValue}>{item.get('value')}</span>
                        </div>
                    );
                })
            }
        </div>
    );
};

HeaderInfo.propTypes = {
    items: PropTypes.instanceOf(List)
};

HeaderInfo.defaultProps = {
    items: []
};

function mapStateToProps(redux) {
    return {
        items: redux.headerInfo || List()
    };
}

export default connect(mapStateToProps, {})(HeaderInfo);
