import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import preloader from '../../components/Preloader';
import errorWindow from '../../components/ErrorWindow';
import {close} from './actions';
import style from './style.css';

const Preloader = connect(
    (state) => {
        return (state.preloadWindow && state.preloadWindow.toJS()) || {};
    }
)(preloader);

const ErrorWindow = connect(
    (state) => {
        return (state.errorWindow && state.errorWindow.toJS()) || {};
    },
    {close}
)(errorWindow);

const Main = React.createClass({
    propTypes: {
        login: PropTypes.object,
        children: PropTypes.object
    },
    contextTypes: {
        router: PropTypes.object.isRequired
    },
    render() {
        return (
            <div className={style.h100pr}>
                {this.props.children}
                <Preloader />
                <ErrorWindow />
            </div>
        );
    }
});

export default connect(
    (state, ownProps) => ({login: state.login})
)(Main);
