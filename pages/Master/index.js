import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import ErrorWindow from '../../components/ErrorWindow';
import Loader from '../../components/Loader';
import { close } from './actions';
import { clearLoginState } from '../../containers/LoginForm/actions';
import style from './style.css';

const ErrorWindowContainer = connect(
    (state) => {
        return (state.errorWindow && state.errorWindow.toJS()) || {};
    },
    {close, clearLoginState}
)(ErrorWindow);

class Main extends React.Component {
    static propTypes = {
        loadInfo: PropTypes.object,
        children: PropTypes.object
    }

    render() {
        return (
            <div className={style.h100pr}>
                {this.props.children}
                {this.props.loadInfo && !!this.props.loadInfo.open && <Loader loadInfo={this.props.loadInfo} />}
                <ErrorWindowContainer />
            </div>
        );
    }
}

export default connect(({ preloadWindow }) => {
    return {
        loadInfo: preloadWindow && preloadWindow.toJS()
    };
})(Main);
