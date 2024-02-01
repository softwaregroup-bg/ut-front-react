import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import style from '../style.css';

class Password extends React.Component {
    static contextTypes = {
        implementationStyle: PropTypes.object
    };

    getStyle(name) {
        return (this.context.implementationStyle && this.context.implementationStyle[name]) || style[name];
    }

    getValue() {
        return this.input.value;
    }

    render() {
        return (
            <div className={classnames('margin-bottom-25', this.getStyle('loginInputContainer'))}>
                <div />
                <input name='password' type='password' placeholder='Password' autoFocus autoComplete='off' ref={(c) => { this.input = c; }} />
            </div>
        );
    }
};

export default Password;
