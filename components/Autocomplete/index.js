import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import AutoComplete from 'material-ui/AutoComplete';
import style from './style.css';

export default class SimpleAutoComplete extends Component {
    render() {
        let dpStyles = {
            border: '1px solid #D6D6D6',
            width: '100%',
            height: '30px'
        };
        return (
            <div className={classnames(style.autoComplete)} style={this.props.wrapperStyles}>
                <div className={style.autoCompleteIcon} style={this.props.iconStyles} onClick={this.props.handleButtonClick} />
                <AutoComplete
                    className={style.autoCompletePopup}
                    dataSource={this.props.dataSource}
                    dataSourceConfig={this.props.dataSourceConfig}
                    filter={AutoComplete.fuzzyFilter}
                    openOnFocus={this.props.openOnFocus}
                    ref={this.props.refval}
                    maxSearchResults={this.props.maxSearchResults}
                    animated={false}
                    style={dpStyles}
                    fullWidth={!(this.props.fullWidth === false)}
                    onUpdateInput={this.props.onChange}
                    onNewRequest={this.props.onSelect}
                    searchText={this.props.searchText}
                />
            </div>
        );
    }
}

SimpleAutoComplete.defaultProps = {
    filter: AutoComplete.fuzzyFilter,
    maxSearchResults: 10,
    openOnFocus: true
};

SimpleAutoComplete.propTypes = {
    refval: PropTypes.func,
    open: PropTypes.bool,
    dataSource: PropTypes.array.isRequired,
    maxSearchResults: PropTypes.number,
    filter: PropTypes.func.isRequired,
    onClick: PropTypes.func,
    wrapperStyles: PropTypes.object,
    iconStyles: PropTypes.object,
    fullWidth: PropTypes.bool,
    handleButtonClick: PropTypes.func,
    onChange: PropTypes.func,
    openOnFocus: PropTypes.bool,
    dataSourceConfig: PropTypes.object,
    onSelect: PropTypes.func,
    searchText: PropTypes.string
};
