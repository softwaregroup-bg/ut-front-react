import PropTypes from 'prop-types';
import React from 'react';
import Card from '@material-ui/core/Card/Card';
import CardText from '@material-ui/core/Card/CardText';

class Username extends React.Component {
    static propTypes = {
        onKeyDown: PropTypes.func
    };

    getValues = () => {
        return this.f.getValue();
    };

    render() {
        return (
            <Card>
                <CardText>
                    Bio Login in progress...
                </CardText>
            </Card>
        );
    }
}

export default Username;
