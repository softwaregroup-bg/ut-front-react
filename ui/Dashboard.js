import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { getLink } from '../routerHelper';
import {Dashboard} from '../containers/Dashboard';

export default class NamedDashboard extends React.Component {
    constructor() {
        super();
        this.myRef = React.createRef();
    }

    componentDidMount() {
        if (this.context.portalName === 'AgencyBanking') {
            this.myRef?.current?.click?.();
        }
    }

    render() {
        return (
            <div>
                <div style={{display: 'none'}}>
                    <Link ref={this.myRef} to={getLink('ut-agent:dashboard')}>{null}</Link>
                </div>
                {this.context.portalName !== 'AgencyBanking' && <Dashboard {...this.props} tabName='Dashboard' pageText={`${this.context.portalName} Dashboard`} />}
            </div>
        );
    }
}

NamedDashboard.contextTypes = {
    portalName: PropTypes.string
};
