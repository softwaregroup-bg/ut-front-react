import React, { Component, PropTypes } from 'react';
import immutable from 'immutable';
import { Link } from 'react-router';

import classnames from 'classnames';
import style from './style.css';

class GridRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: props.checked,
            selected: false
        };
        this.disableDeselect = false;
        this.deselect = () => this.disableDeselect || this.setState({selected: false});
        this.toggleSelect = this.toggleSelect.bind(this);
        this.toggleCheck = this.toggleCheck.bind(this);
    }

    componentWillUnmount() {
        this.disableDeselect = true;
    }

    toggleSelect() {
        if (this.props.canSelect === true) {
            let isSelected = !this.state.selected;
            this.setState({selected: isSelected}, () => {
                this.props.onSelect(this.props.data, isSelected);
                isSelected && this.props.subscribeUnselect(this.deselect);
            });
        }
    }

    toggleCheck(e) {
        e.stopPropagation();
        let isChecked = !this.state.checked;
        this.setState(
            {checked: isChecked},
            () => this.props.onCheck(immutable.List([this.props.data]), isChecked)
        );
    }

    clearSelected() {
        this.setState({selected: false});
    }

    clearChecked() {
        this.setState({checked: false});
    }

    componentWillReceiveProps({checked}) {
        if (checked !== this.props.checked) {
            this.setState({checked});
        }
    }

    renderColumns() {
        let {columns, data, canCheck, linkableColumns, tdStyles} = this.props;
        let columnElements = columns.map(({key}, i) => {
            let keyPath = key ? (typeof key === 'string' ? [key] : key) : undefined;
            let transformedData = this.props.mapColumn(columns[i], keyPath ? data.getIn(keyPath) : undefined);
            let isLink = linkableColumns && linkableColumns[i];
            let currenctStyles = tdStyles[i];
            if (!currenctStyles) {
                currenctStyles = {};
            }
            if (!currenctStyles.width) {
                currenctStyles.width = 'auto';
            }

            if (isLink) {
                return (
                    <td key={key || i} style={currenctStyles}>
                        <Link to={data.get('url')} className={style.link}>
                            {transformedData || false}
                        </Link>
                    </td>
                );
            } else {
                return (
                    <td key={key || i} style={currenctStyles}>
                        {transformedData || false}
                    </td>
                );
            }
        });
        if (canCheck) {
            columnElements.unshift(
                <td key='checkbox' className={classnames(style.checkBox, style.tdCheckbox)}>
                    <input type='checkbox' onClick={this.toggleCheck} onChange={function() {}} checked={this.state.checked} />
                </td>
            );
        }
        return columnElements;
    }

    render() {
        let className = '';

        if (this.state.checked) {
            className = style.checked;
        }

        // Selected is with higher priority => selected overrides checked class

        if ((!this.props.fixSelectIssue && this.state.selected) || (this.props.fixSelectIssue && this.props.selected)) {
            className = style.selected;
        }

        let cursorStyle;
        if (this.props.canSelect === false) {
            cursorStyle = style.defaultCursor;
        } else {
            cursorStyle = style.pointerCursor;
        }
        return (
            <tr className={classnames(className, cursorStyle)} onClick={this.toggleSelect} style={this.props.trStyles}>
                {this.renderColumns()}
            </tr>
        );
    }
}

GridRow.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.any,
        value: PropTypes.any
    })).isRequired,
    data: PropTypes.object.isRequired, // immutable
    linkableColumns: PropTypes.array,
    selected: PropTypes.bool,
    fixSelectIssue: PropTypes.bool,
    trStyles: PropTypes.object,
    tdStyles: PropTypes.array,
    mapColumn: PropTypes.func,
    checked: PropTypes.bool,
    canCheck: PropTypes.bool,
    onCheck: PropTypes.func,
    onSelect: PropTypes.func,
    canSelect: PropTypes.bool,
    subscribeUnselect: PropTypes.func
};

GridRow.defaultProps = {
    checked: false,
    canCheck: false,
    selected: false,
    fixSelectIssue: false,
    isLink: [],
    trStyles: {},
    tdStyles: [],
    mapData: (data) => data,
    onSelect: function() {},
    canSelect: true,
    onCheck: function() {},
    subscribeUnselect: function() {},
    mapColumn: (col, value) => value
};

export default GridRow;
