import React from 'react';
import PropTypes from 'prop-types';
import Card from 'material-ui/Card/Card';
import CardText from 'material-ui/Card/CardText';

const Username = React.createClass({
    propTypes: {
        onKeyDown: PropTypes.func
    },
    getValues() {
        return this.refs.f.getValue();
    },
    render() {
        return (
            <Card>
                <CardText>
                    Bio Login in progress...
                </CardText>
            </Card>
        );
    }
});

export default Username;
