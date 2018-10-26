import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField/TextField';
import Card from 'material-ui/Card/Card';
import CardText from 'material-ui/Card/CardText';
import style from './style.css';
import {textFieldStyle, textFieldInputStyle} from './style.js';

const Password = React.createClass({
    propTypes: {
        submit: PropTypes.func
    },
    getValue() {
        return this.refs.f.getValue();
    },
    componentDidMount() {
        this.refs.f.input.focus();
    },
    render() {
        return (
            <Card>
                <CardText>
                    <h3 className={style.heading}>PASSWORD</h3>
                    <TextField
                        type='password'
                        name='password'
                        onKeyDown={this.props.submit}
                        ref='f'
                        style={textFieldStyle}
                        inputStyle={textFieldInputStyle}
                        underlineShow={false}
                    />
                    <button className={style.nextButton} onClick={this.props.submit}>Next</button>
                </CardText>
            </Card>
        );
    }
});

export default Password;
