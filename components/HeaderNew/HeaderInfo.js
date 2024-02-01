import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import { connect } from 'react-redux';

const HeaderInfo = props => {
    const { items } = props;

    if (!items.length) {
        return null;
    }

    return (
        <div className={styles.headerInfo}>
            {
                items.map((item, index) => {
                    return (
                        <div key={`headerItem-${index}`} className={styles.headerInfoItem}>
                            <span className={styles.headerInfoLabel}>{item.label}</span>
                            <span className={styles.headerInfoValue}>{item.value}</span>
                        </div>
                    );
                })
            }
        </div>
    );
};

HeaderInfo.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
    }))
};

HeaderInfo.defaultProps = {
    items: []
};

function mapStateToProps(redux, ownProps) {
    return {
        items: redux.HeaderInfo || []
    };
}

export default connect(mapStateToProps, {})(HeaderInfo);
