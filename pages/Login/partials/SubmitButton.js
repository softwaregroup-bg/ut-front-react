import PropTypes from 'prop-types';
import React from 'react';
import Button from '../../../components/Button';
import style from '../style.css';

class SubmitButton extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        submit: PropTypes.func
    };

    handleSubmit(e) {
        if (this.props.submit) {
            this.props.submit(e);
        }
    }

    static contextTypes = {
        implementationStyle: PropTypes.object
    };

    getStyle(name) {
        return (this.context.implementationStyle && this.context.implementationStyle[name]) || style[name];
    }

    render() {
        return (
            <div className={this.getStyle('loginSubmitContainer')}>
                <Button type='submit' button='connection' fullWidth onClick={this.handleSubmit}>{this.props.title}</Button>
            </div>
        );
    }
};

export default SubmitButton;
