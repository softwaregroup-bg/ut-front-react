import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import style from '../style.css';

class Username extends React.Component {
    static propTypes = {
        value: PropTypes.string
    }

    static contextTypes = {
        implementationStyle: PropTypes.object
    }

    getInitialState() {
        return {};
    }

    getStyle(name) {
        return (this.context.implementationStyle && this.context.implementationStyle[name]) || style[name];
    }

    handleChange(e) {
        this.setState({value: e.target.value});
    }

    getValue() {
        return this.state.value;
    }

    render() {
        let value = this.props.value || '';
        if (this.state.value || this.state.value === '') {
            value = this.state.value;
        }
        return (
            <div className={classnames('margin-bottom-25', this.getStyle('loginInputContainer'))}>
                <input type='text' placeholder='Username' autoFocus autoComplete='off' ref={(c) => { this.input = c; }} value={value} onChange={this.handleChange} />
            </div>
        );
    }
};

export default Username;
