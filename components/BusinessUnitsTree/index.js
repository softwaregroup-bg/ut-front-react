import React, { PropTypes } from 'react';
import immutable from 'immutable';
import style from './style.css';
import classnames from 'classnames';

class TreeNavigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Keeping openElements in state instead calling action each time user clicks something. When unmount event called the store is updated.
            openElements: props.openElements,
            active: {id: this.props.active.id, breadcrumbs: this.props.active.breadcrumbs.toJS() || []}
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.reset) {
            this.setState({
                active: {},
                openElements: nextProps.openElements
            });
        }

        if (nextProps.openElements !== this.props.openElements) {
            this.setState({openElements: nextProps.openElements});
        }

        if (nextProps.active !== this.props.active) {
            this.setState({active: nextProps.active});
        }
    }

    handleToggleClick(id) {
        let openElements = this.state.openElements;
        let newOpenElementsState;
        if (openElements.get(id)) {
            newOpenElementsState = openElements.set(id, false);
        } else {
            newOpenElementsState = openElements.set(id, true);
        }
        this.setState({openElements: newOpenElementsState});
    }

    componentWillUnmount() {
        this.props.onUnmount(this.state.openElements);
    }

    renderNodes(nodes, breadcrumbArr = []) {
        let {openElements, active} = this.state;
        return nodes.map((node) => {
            let nodeStyles;
            if (this.props.styles['li']) {
                nodeStyles = this.props.styles['li'].join(' ');
            }
            let arrowClass = '';
            let activeClass = '';

            if (openElements.get(node.id)) {
                nodeStyles = classnames(nodeStyles, style.open);
                arrowClass = classnames(style.arrow, style.arrowOpen);
            } else {
                nodeStyles = classnames(nodeStyles, style.closed);
                arrowClass = style.arrow;
            }

            let breadcrumbString = JSON.stringify(breadcrumbArr);

            if (active.id === node.id) {
                let asd = JSON.stringify(active.breadcrumbs);
                if (asd === breadcrumbString) {
                    activeClass = style.isActive;
                }
            }

            let handleSelect = () => this.setState({active: {id: node.id, breadcrumbs: breadcrumbArr}}) || this.props.onSelect(node, breadcrumbArr);
            if (!node.children) {
                return <div onClick={handleSelect} key={node.id} className={classnames(activeClass, style.rowBox)} data-breadcrumb={breadcrumbString}>{node.title}</div>;
            } else {
                let toggle = () => this.handleToggleClick(node.id);
                let newBreadcrumbArr = breadcrumbArr.slice(0);
                newBreadcrumbArr.push(node.id);
                return (
                    <div key={node.id} className={style.rowBox}>
                        <div className={style.parent}>
                            <div className={classnames(style.arrow, arrowClass)} onClick={toggle} />
                            <div className={activeClass} onClick={handleSelect} data-breadcrumb={breadcrumbString}>{node.title}</div>
                        </div>
                        <div id={'treeNav-' + node.id} className={classnames(nodeStyles, style.childrenWrap)}>
                            {this.renderNodes(node.children, newBreadcrumbArr)}
                        </div>
                    </div>
                );
            }
        });
    }

    calculateOpenChildrenNumber(children) {
        let opened = this.state.openElements;
        return children.length + children.reduce((result, child) => {
            if (opened.get(child.id)) {
                result += this.calculateOpenChildrenNumber(child.children);
            }
            return result;
        }, 0);
    }

    render() {
        return (
            <div className={style.scrollableTreeWrap}>
                <div className={style.innerTrWrap}>
                    {this.renderNodes(this.props.data)}
                </div>
            </div>
        );
    }
}

TreeNavigation.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.any.isRequired,
        title: PropTypes.string.isRequired,
        children: PropTypes.array
    })),
    openElements: PropTypes.object, // immutable object
    active: PropTypes.shape({
        id: PropTypes.string,
        breadcrumbs: PropTypes.any // immutable list
    }),
    styles: PropTypes.object,
    reset: PropTypes.bool,
    onSelect: PropTypes.func,
    onUnmount: PropTypes.func
};

TreeNavigation.defaultProps = {
    data: [],
    openElements: immutable.Map({}),
    active: {id: undefined, breadcrumbs: immutable.List([])},
    styles: {
        ul: ['treeNavUl'],
        li: [''],
        main: {}
    },
    onSelect: function() {},
    onUnmount: () => { }
};

export default TreeNavigation;
