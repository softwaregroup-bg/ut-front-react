import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';
import Select from 'react-select';

// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select/dist/react-select.css';


/**
 * This is a wrapper of the react-select component
 * of JedWatson
 */
class MultiSelectBubble extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(val) {
    return this.props.onChange(val);
  }

  render() {
    let {name, value, options, onChange} = this.props;
    return (
      <Select
        name={name}
        value={value}
        options={options}
        onChange={this.handleChange}
      />
    )
  }
}

MultiSelectBubble.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string 
  })).isRequired,
  onChange: PropTypes.func
}

MultiSelectBubble.defaultProps = {
    name: 'react-select-dropdown',
    errorMessage: '',
    isEdited: false
};

export default MultiSelectBubble;
