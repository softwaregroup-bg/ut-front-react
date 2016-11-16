import React, { PropTypes } from 'react';
import Button from '../../../components/Button';
import style from '../style.css';

const SubmitButton = React.createClass({
    propTypes: {
        title: PropTypes.string,
        submit: PropTypes.func
    },
    handleSubmit(e) {
        if (this.props.submit) {
            this.props.submit(e);
        }
    },
    contextTypes: {
        implementationStyle: PropTypes.object
    },
    getStyle(name) {
        return (this.context.implementationStyle && this.context.implementationStyle[name]) || style[name];
    },
    render() {
        return (
            <div className={this.getStyle('loginSubmitContainer')}>
                <Button type='submit' button='connection' fullWidth onTouchTap={this.handleSubmit} >{this.props.title}</Button>
            </div>
        );
    }
});

export default SubmitButton;
