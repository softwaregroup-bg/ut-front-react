import React, { PropTypes } from 'react';
import { Link } from 'react-router';
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
    implementationStyle: PropTypes.object,
    router: PropTypes.object.isRequired
};
