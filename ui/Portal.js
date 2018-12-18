import React from 'react';
import Layout from '../pages/Layout';

export default class Portal extends React.Component {
    render() {
        return (
            <Layout {...this.props} headerText={`${this.context.portalName}\nPortal`} />
        );
    }
};

Portal.contextTypes = {
    portalName: React.PropTypes.string
};
