import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './styles.css';

class VersionNumber extends Component {
    render() {
        const { version } = this.props;

        if (version) {
            return (
                <div className={styles.wrap}>
                    Version: {version}
                </div>
            );
        }
        return <div />;
    }
}

export default connect(
    ({ login }) => {
        return {
            version: login.get('version')
        };
    },
    { }
)(VersionNumber);

VersionNumber.propTypes = {
    version: PropTypes.string
};
