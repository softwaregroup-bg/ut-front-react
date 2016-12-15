import React, { Component, PropTypes } from 'react';
import Link from './Link';
import Menu from './../MenuNew';

export default class MultiTab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            menuToggled: false
        };

        this.onTouchTap = this.onTouchTap.bind(this);
    }

    toggleMenu() {
        this.setState({
            menuToggled: !this.state.menuToggled
        });
    }

    onTouchTap(e) {
        e.preventDefault();
        this.toggleMenu();
    }

    render() {
        const { tab } = this.props;
        return (
            <Link
              widematch
              onClick={(e) => { e.preventDefault(); }}
              to={tab.routeName}
              params={tab.routeParams}
              onTouchTap={this.onTouchTap} >
                {tab.title}
                {this.state.menuToggled ? <Menu fields={['1', '2', '3']} /> : false}
            </Link>
        );
    }
}

MultiTab.propTypes = {
    tab: PropTypes.object
};
