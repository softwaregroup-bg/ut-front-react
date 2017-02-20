import React, { Component, PropTypes } from 'react';

import Tree from '../BusinessUnitsTree';
import StandardButton from '../StandardButton';
import CircularProgress from 'material-ui/CircularProgress';

import style from './styles.css';

const innerWrapTopMargin = 35;

class BusinessUnits extends Component {
    constructor(props, context) {
        super(props, context);
        this.unselectedValue = {
            key: 'null',
            inner: undefined,
            name: 'Select'
        };
        this.state = {
            selected: props.active,
            filter: this.unselectedValue,
            reset: false,
            treeStructureInnerWrapHeight: '400px',
            treeStructureInnerWrapTopMargin: innerWrapTopMargin + 'px',
            treeStructureInnerWrapHeightWasCalculater: false
        };

        this.handleResize = this.handleResize.bind(this);
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.state.reset) {
            this.setState({reset: false});
        }
    }

    componentWillReceiveProps({active}) {
        if (active !== this.props.active) {
            this.setState({selected: active});
        }
    }

    componentDidMount() {
        this.handleResizeForceUpdate = true;
        window.addEventListener('resize', this.handleResize);
    }

    componentDidUpdate() {
        this.handleResize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    getStyle(name) {
        return (this.context.implementationStyle && this.context.implementationStyle[name]) || style[name];
    }

    handleResize() {
        let outerWrapHeight = this.refs.outerWrap.clientHeight;
        let topMargin = innerWrapTopMargin; // 31 is the top margin
        let innerWrapHeight = outerWrapHeight - topMargin;

        if (this.handleResizeForceUpdate || !this.state.treeStructureInnerWrapHeightWasCalculater) {
            this.handleResizeForceUpdate = false;
            this.setState({
                treeStructureInnerWrapHeight: innerWrapHeight + 'px',
                treeStructureInnerWrapTopMargin: topMargin + 'px',
                treeStructureInnerWrapHeightWasCalculater: true
            });
        }
    }

    getBusinessUnits() {
        // Inner key indicates that we have selecte value by the dropdown
        if (this.state.filter.inner) {
            return [this.state.filter.inner];
        } else {
            return this.props.unitsTree;
        }
    }

    render() {
        let clearButton;
        if (this.props.clearSelectedBusinessUnit && !this.props.isLoading) {
            let clearSelection = () => {
                // this.setState({
                //     filter: {
                //         key: 'null',
                //         inner: undefined,
                //         name: 'Select'
                //     },
                //     selected: undefined,
                //     reset: true
                // });
                this.props.clearSelectedBusinessUnit();
            };
            clearButton = <StandardButton
              onClick={clearSelection}
              disabled={!this.state.selected.id}
              label='Unselect all'
              className={['secondaryButton', this.getStyle('clearButton')]}
              disabledClassName='disabledsecondaryButton' />;
        }

        return (
            <div className={style.treeStructureWrap} ref='outerWrap'>
                <div className={style.treeWrap}
                  style={{height: this.state.treeStructureInnerWrapHeight, marginTop: this.state.treeStructureInnerWrapTopMargin}}
                >

                    {clearButton}

                    {this.props.isLoading && <CircularProgress style={{display: 'block', margin: '40px auto 0px auto'}} size={45} />}
                    {!this.props.isLoading && <Tree
                      onSelect={this.props.selectBusinessUnit}
                      data={this.getBusinessUnits()}
                      active={this.state.selected}
                      openElements={this.props.openElements}
                      onUnmount={this.props.onUnmount}
                      reset={this.state.reset}
                      styles={this.props.styles}
                    />}

                </div>
            </div>
        );
    }
}

BusinessUnits.propTypes = {
    // NOTICE: Wrap this component in a relative div

    // Data from state
    unitsTree: Tree.propTypes.data,
    isLoading: PropTypes.bool,

    // Data from passed (own) props
    active: Tree.propTypes.active,
    openElements: Tree.propTypes.openElements,
    styles: PropTypes.object,
    outerWrapHeight: PropTypes.number,

    // Functions
    selectBusinessUnit: PropTypes.func,
    onUnmount: PropTypes.func,
    clearSelectedBusinessUnit: PropTypes.func
};

BusinessUnits.defaultProps = {
    styles: {
        main: {}
    }
};

BusinessUnits.contextTypes = {
    implementationStyle: PropTypes.object
};

export default BusinessUnits;
