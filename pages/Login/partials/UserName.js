import React, { PropTypes } from 'react';
import classnames from 'classnames';
import style from '../style.css';

const Username = React.createClass({
    propTypes: {
        value: PropTypes.string
    },
    contextTypes: {
        implementationStyle: PropTypes.object
    },
    getInitialState: function() {
        return {};
    },
    getStyle(name) {
        return (this.context.implementationStyle && this.context.implementationStyle[name]) || style[name];
    },
    handleChange: function(e) {
        this.setState({value: e.target.value});
    },
    getValue() {
        return this.state.value;
    },
    render() {
        let value = this.props.value || '';
        if (this.state.value || this.state.value === '') {
            value = this.state.value;
        }
        return (
            <div className={classnames('margin-bottom-25', this.getStyle('loginInputContainer'))}>
                <input type='text' placeholder='Username' autoFocus ref='input' value={value} onChange={this.handleChange} />
            </div>
        );
    }
});

export default Username;
