import PropTypes from 'prop-types';
import React, { Component } from 'react';
export default class InlineEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editing: false,
            text: this.props.text
        };
    }

    inPlaceEdit() {
        this.setState({
            editing: true
        });
    }

    keyPressed(e) {
        if (e.keyCode === 13) {
            this.props.onFinish(this.props.item, this.props.text, this.inPlace.value);
            this.setState({
                editing: false
            });
        } else if (e.keyCode === 27) {
            this.setState({
                editing: false,
                text: this.props.text
            });
        } else {
            this.setState({
                text: e.target.value
            });
        }
    }

    render() {
        if (this.state.editing) {
            const onChange = (e) => { this.keyPressed(e); };
            return <input type='text' ref={(c) => { this.inPlace = c; }} defaultValue={this.state.text} onKeyDown={onChange} />;
        } else {
            const onClick = () => { this.inPlaceEdit(); };
            const text = this.state.text || ' ';
            return (
                <div onClick={onClick}>&nbsp;
                    {text}
                </div>
            );
        }
    }
}

InlineEditor.propTypes = {
    text: PropTypes.string,
    item: PropTypes.any,
    onFinish: PropTypes.func
};
