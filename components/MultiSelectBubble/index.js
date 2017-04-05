import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';
import Select from 'react-select';
import style from './style.css';
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
    this.props.onChange(val);
  }

  render() {
    let {name, value, options, onChange, label} = this.props;
    return (
      <div className={style.outerWrap}>
        <div className={style.labelWrap}>
            {label}
        </div>
        <div className={style.inputWrap}>
           <Select
              name={name}
              value={value}
              options={options}
              onChange={this.handleChange}
              multi
            />
        </div>
      </div>
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
  onChange: PropTypes.func,
  label: PropTypes.string,
}

MultiSelectBubble.defaultProps = {
    name: 'react-select-dropdown',
    errorMessage: '',
    isEdited: false
};

export default MultiSelectBubble;
