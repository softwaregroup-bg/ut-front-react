import PropTypes from 'prop-types';
import { Component, Children } from 'react';

export default function wrapper({menus = []}) {
    const tabset = menus.reduce((all, items) => all.concat(items), []);
    const setMenuItemProps = (item, props) => {
        item.props = {...props, ...item.props};
        if (Array.isArray(item.multi)) {
            item.multi.forEach(subItem => setMenuItemProps(subItem, props));
        }
        return item;
    };
    class Wrapper extends Component {
        getChildContext() {
            const {
                mainTabset = [],
                implementationStyle: {
                    active = 'active'
                } = {}
            } = this.context;
            return {
                mainTabset: mainTabset
                    .concat(tabset)
                    .map(item => setMenuItemProps(item, {activeClassName: active}))
            };
        }

        render() {
            return Children.only(this.props.children);
        }
    }

    Wrapper.contextTypes = {
        implementationStyle: PropTypes.object,
        mainTabset: PropTypes.array
    };

    Wrapper.childContextTypes = {
        mainTabset: PropTypes.array
    };

    Wrapper.propTypes = {
        children: PropTypes.node
    };

    return Wrapper;
}
