import React, { PropTypes } from 'react';
import Text from '../../../components/Text';
import classnames from 'classnames';
import style from '../style.css';

const Username = React.createClass({
    propTypes: {
        title: PropTypes.string
    },
    contextTypes: {
        implementationStyle: PropTypes.object
    },
    getStyle(name) {
        return (this.context.implementationStyle && this.context.implementationStyle[name]) || style[name];
    },
    render() {
        return (
            <div className={classnames('f15 f-semibold f-gray-dark f-upper margin-top-15', this.getStyle('loginTitleContainer'))}>
                <Text>{this.props.title}</Text>
            </div>
        );
    }
});

export default Username;
