import PropTypes from 'prop-types';
import React from 'react';
import Layout from '../pages/Layout';

export default class Portal extends React.Component {
    render() {
        return (
            <Layout {...this.props} headerText={`Agency Banking`} />
        );
    }
}

Portal.contextTypes = {
    portalName: PropTypes.string,
    location: PropTypes.object
};
