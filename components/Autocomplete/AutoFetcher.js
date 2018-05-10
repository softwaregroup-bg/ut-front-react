import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import AutoComplete from 'material-ui/AutoComplete';
import style from './style.css';
import debounce from 'debounce';

const type = Symbol('type');

class AutoFetcher extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: props.searchText,
            dataSource: []
        };

        this.debouncedOnChange = debounce(searchText => {
            this.props.fetchData(
                this.props.method,
                {
                    ...this.props.mapRequest({
                        searchText,
                        pageNumber: 1,
                        pageSize: this.props.maxSearchResults || 5
                    })
                }
            )
            .then(res => {
                if (res.result) {
                    const data = this.props.mapResponse(res.result);
                    this.setState({dataSource: data});
                    this.props.onDataFetched(data);
                }

                this.props.onChange(searchText);
            });
        }, 500);

        this.onChange = this.onChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.searchText !== nextProps.searchText && nextProps.searchText != null) {
            this.setState({ searchText: nextProps.searchText });
        }
    }

    onChange(searchText) {
        this.setState({ searchText });
        this.debouncedOnChange(searchText);
    }

    render() {
        const dpStyles = {
            border: '1px solid #D6D6D6',
            width: '100%',
            height: '30px'
        };

        return (
            <div className={classnames(style.autoComplete)} style={this.props.wrapperStyles}>
                <AutoComplete
                  className={style.autoCompletePopup}
                  dataSource={this.props.dataSource || this.state.dataSource}
                  dataSourceConfig={this.props.dataSourceConfig}
                  filter={AutoComplete.caseInsensitiveFilter}
                  openOnFocus={this.props.openOnFocus !== false}
                  ref={this.props.refval}
                  maxSearchResults={this.props.maxSearchResults || 5}
                  animated={false}
                  style={dpStyles}
                  fullWidth={this.props.fullWidth !== false}
                  onUpdateInput={this.onChange}
                  onNewRequest={this.props.onSelect}
                  searchText={this.state.searchText}
                />
            </div>
        );
    }
}

AutoFetcher.defaultProps = {
    mapRequest: request => request,
    mapResponse: response => response,
    onDataFetched: () => {},
    onChange: () => {}
};

AutoFetcher.propTypes = {
    method: PropTypes.string,
    mapRequest: PropTypes.func,
    mapResponse: PropTypes.func,
    onDataFetched: PropTypes.func,
    refval: PropTypes.func,
    dataSource: PropTypes.array.isRequired,
    maxSearchResults: PropTypes.number,
    wrapperStyles: PropTypes.object,
    fullWidth: PropTypes.bool,
    onChange: PropTypes.func,
    openOnFocus: PropTypes.bool,
    dataSourceConfig: PropTypes.object,
    onSelect: PropTypes.func,
    searchText: PropTypes.string,
    fetchData: PropTypes.func
};

const fetchData = (method, params) => ({
    type,
    method,
    params,
    suppressPreloadWindow: true,
    suppressErrorWindow: true
});

export default connect(() => ({}), { fetchData })(AutoFetcher);
