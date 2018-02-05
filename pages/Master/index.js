import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ErrorWindow from '../../components/ErrorWindow';
import Loader from '../../components/Loader';
import { close } from './actions';
import style from './style.css';

const ErrorWindowContainer = connect(
    (state) => {
        return (state.errorWindow && state.errorWindow.toJS()) || {};
    },
    {close}
)(ErrorWindow);

const Main = ({
    loadInfo,
    children
}) => {
    return (
        <div className={style.h100pr}>
            { children }
            { loadInfo && !!loadInfo.open && <Loader loadInfo={loadInfo} />}
            <ErrorWindowContainer />
        </div>
    );
};

export default connect(({ preloadWindow }) => {
    return {
        loadInfo: preloadWindow && preloadWindow.toJS()
    };
})(Main);

Main.propTypes = {
    loadInfo: PropTypes.object,
    children: PropTypes.object
};

Main.contextTypes = {
    router: PropTypes.object.isRequired
};
