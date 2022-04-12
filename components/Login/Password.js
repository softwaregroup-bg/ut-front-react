import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField/TextField';
import Card from '@material-ui/core/Card/Card';
import CardText from '@material-ui/core/Card/CardText';
import style from './style.css';
import {textFieldStyle, textFieldInputStyle} from './style.js';

class Password extends React.Component {
    static propTypes = {
        submit: PropTypes.func
    };

    getValue = () => {
        return this.f.getValue();
    };

    componentDidMount() {
        this.f.input.focus();
    }

    render() {
        return (
            <Card>
                <CardText>
                    <h3 className={style.heading}>PASSWORD</h3>
                    <TextField
                        type='password'
                        name='password'
                        onKeyDown={this.props.submit}
                        ref={(c) => { this.f = c; }}
                        style={textFieldStyle}
                        inputStyle={textFieldInputStyle}
                        underlineShow={false}
                    />
                    <button className={style.nextButton} onClick={this.props.submit}>Next</button>
                </CardText>
            </Card>
        );
    }
}

export default Password;
