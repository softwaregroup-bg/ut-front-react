import PropTypes from 'prop-types';
import React from 'react';
import {Dashboard} from '../containers/Dashboard';

export default class NamedDashboard extends React.Component {
    render() {
        return (
            <Dashboard {...this.props} tabName='Dashboard' pageText={`${this.context.portalName} Dashboard`} />
        );
    }
}

NamedDashboard.contextTypes = {
    portalName: PropTypes.string
};
