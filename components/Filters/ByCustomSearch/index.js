import React, {Component, PropTypes} from 'react';

import Dropdown from '../../../components/Input/Dropdown';
import SearchBox from '../../../components/SearchBox';
import Text from '../../../components/Text';

import style from './style.css';

export class ByCustomSearch extends Component {
    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    componentWillMount() {
        if (!this.props.field) {
            this.props.setField(this.props.defaultField);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.defaultField !== this.props.defaultField) {
            this.props.setField(nextProps.defaultField);
        }
        if (nextProps.fields !== this.props.fields) {
            this.fields = nextProps.fields;
        }
    }

    handleSelect(record) {
        this.props.setField(record.value);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!nextProps.value || nextProps.field !== this.props.field) {
            return true;
        }
        return false;
    }

    handleSearch(value) {
        this.props.setValue(value);
    }

    render() {
        const { field, fields, value, placeholder, externalStyles } = this.props
        return (
            <div>
                <div className={style.customSearchDropdown}>
                    <Dropdown
                      defaultSelected={field}
                      placeholder={<Text>Search By</Text>}
                      keyProp='name'
                      onSelect={this.handleSelect}
                      data={fields}
                      menuAutoWidth />
                </div>
                <div className={style.customSearchTextField}>
                    <SearchBox
                      placeholder={placeholder}
                      defaultValue={value}
                      onSearch={this.handleSearch}
                      externalStyle={externalStyles.searchBoxStyles}
                    />
                </div>
            </div>
        );
    }
}

// data={this.fields.filter((field) => (this.props.allowedFields.indexOf(field.key) >= 0))}

ByCustomSearch.propTypes = {
    setField: PropTypes.func.isRequired, // action
    setValue: PropTypes.func.isRequired, // action
    field: PropTypes.string,
    value: PropTypes.string,
    allowedFields: PropTypes.object,
    defaultField: PropTypes.string.isRequired,

    fields: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        text: PropTypes.string
    })).isRequired,
    placeholder: PropTypes.string,
    externalStyles: PropTypes.object
};

ByCustomSearch.defaultProps = {
    placeholder: '',
    externalStyles: {}
}

export default ByCustomSearch;
