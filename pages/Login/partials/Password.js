import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import style from '../style.css';

const Password = React.createClass({
    propTypes: {},
    contextTypes: {
        implementationStyle: PropTypes.object
    },
    getStyle(name) {
        return (this.context.implementationStyle && this.context.implementationStyle[name]) || style[name];
    },
    getValue() {
        return this.refs.input.value;
    },
    render() {
        return (
            <div className={classnames('margin-bottom-25', this.getStyle('loginInputContainer'))}>
                <div />
                <input name='password' type='password' placeholder='Password' autoFocus ref='input' />
            </div>
        );
    }
});

export default Password;
