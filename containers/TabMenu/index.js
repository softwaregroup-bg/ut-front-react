import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Text from '../../components/Text';
import TabMenu from '../../components/TabMenu';
import { removeTab, addTab } from './actions';

class TabMenuWrapper extends Component {
    render() {
        return <TabMenu {...this.props} />;
    }
}

TabMenuWrapper.propTypes = {
    active: PropTypes.object
};

export default connect(
    (state) => ({
        ...state.tabMenu
    }),
    (dispatch, ownProps) => ({
        onTabClose: (tab, next, prev) => {
            dispatch(removeTab(tab.pathname, tab.pagename));
            ownProps.onTabClose && ownProps.onTabClose(tab, next, prev);
        }
    })
)(TabMenuWrapper);

class AddTabWrapper extends Component {
    componentDidMount() {
        this.props.addTab(this.props.pathname, <Text>{this.props.title}</Text>, this.props.pathname === this.context.mainUrl, this.props.pagename, this.props.shouldUpdate);
    }

    componentDidUpdate() {
        this.props.addTab(this.props.pathname, <Text>{this.props.title}</Text>, this.props.pathname === this.context.mainUrl, this.props.pagename, this.props.shouldUpdate, this.props.notAddTab);
    }

    componentWillUnmount() {
        this.props.onUnmount && this.props.onUnmount();
    }

    render() {
        return false;
    }
}

AddTabWrapper.contextTypes = {
    mainUrl: PropTypes.string
};

AddTabWrapper.propTypes = {
    addTab: PropTypes.func,
    onUnmount: PropTypes.func,
    title: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
    pagename: PropTypes.string,
    shouldUpdate: PropTypes.bool,
    notAddTab: PropTypes.bool
};

export const AddTab = connect(
    (state) => {
        return {
            tabs: state.tabMenu.tabs
        };
    },
    (dispatch) => ({
        addTab: (...args) => dispatch(addTab(...args))
    })
)(AddTabWrapper);
