import React, { Component, PropTypes } from 'react';

import Tree from '../BusinessUnitsTree';
import StandardButton from '../StandardButton';
import CircularProgress from 'material-ui/CircularProgress';
import { Vertical } from '../Layout';

import style from './styles.css';

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
            reset: false
        };
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

    getStyle(name) {
        return (this.context.implementationStyle && this.context.implementationStyle[name]) || style[name];
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
        let clearButton = <span />;
        if (this.props.clearSelectedBusinessUnit && !this.props.isLoading) {
            const clearSelection = () => {
                this.props.clearSelectedBusinessUnit();
            };
            clearButton = <StandardButton
                onClick={clearSelection}
                disabled={!this.state.selected.id}
                label='Unselect all'
                className={['secondaryButton', this.getStyle('clearButton')]}
                disabledClassName='disabledsecondaryButton'
            />;
        }

        return (
            <div className={style.treeStructureWrap}>
                <div className={style.treeWrap}>
                    <Vertical fixedComponent={clearButton}>
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
                    </Vertical>
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
