import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Text from '../../components/Text';
import TabMenu from '../../components/TabMenu';
import { removeTab, addTab } from './actions';

class TabMenuWrapper extends Component {
    componentWillReceiveProps({active, defaultLocation}) {
        // on tab close
        let prev = this.props.active;
        if (active && prev && active.pathname !== prev.pathname) { // focus previous tab or...
            this.context.router.replace(active.pathname);
        } else if (!active && defaultLocation) { // focus default url if there is not tabs left for focusing!
            this.context.router.replace(defaultLocation);
        }
    }
    render() {
        return <TabMenu {...this.props} />;
    }
}

TabMenuWrapper.propTypes = {
    active: PropTypes.object
};

TabMenuWrapper.contextTypes = {
    router: PropTypes.object.isRequired
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
    }),
    null,
    {pure: false}
)(TabMenuWrapper);

class AddTabWrapper extends Component {
    componentDidMount() {
        this.props.addTab(this.props.pathname, <Text>{this.props.title}</Text>, this.props.pathname === this.context.mainUrl, this.props.pagename);
    }
    componentDidUpdate() {
        this.props.addTab(this.props.pathname, <Text>{this.props.title}</Text>, this.props.pathname === this.context.mainUrl, this.props.pagename);
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
    pagename: PropTypes.string
};

export const AddTab = connect(null,
    (dispatch) => ({
        addTab: (...args) => dispatch(addTab(...args))
    })
)(AddTabWrapper);
