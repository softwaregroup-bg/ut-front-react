import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import preloader from '../../components/Preloader';
import errorWindow from '../../components/ErrorWindow';
import Loader from '../../components/Loader';
import {close} from './actions';

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
        const { loadInfo } = this.props;

        return (
            <div className='wrapper'>
                {this.props.children}
                { loadInfo && !!loadInfo.open && <Loader loadInfo={loadInfo} />}
                <ErrorWindow />
            </div>
        );
    }
});


export default connect(({ preloadWindow }) => {
    return {
        loadInfo: preloadWindow && preloadWindow.toJS()
    };
})(Main);


Main.defaultProps = {
    loading: false
};
