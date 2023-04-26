import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import style from './style.css';

export default class Logo extends React.Component {
    getStyle(name) {
        return (this.context.implementationStyle && this.context.implementationStyle[name]) || style[name];
    }

    render() {
        return (
            <div>
                <Link to={this.context.mainUrl} className={this.getStyle('headerCellLogoLink')}>&nbsp;</Link>
                <h2 className={this.getStyle('headerCellLogoH2')}>{this.props.headerCellText}</h2>
                {this.props.version && <span className={this.getStyle('headerCellLogoVersion')}>{this.props.version}</span>}
            </div>
        );
    }
}

Logo.propTypes = {
    headerCellText: PropTypes.object,
    version: PropTypes.string
};

Logo.contextTypes = {
    implementationStyle: PropTypes.object,
    mainUrl: PropTypes.string,
    router: PropTypes.object.isRequired
};
