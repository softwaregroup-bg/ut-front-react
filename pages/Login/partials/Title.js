import PropTypes from 'prop-types';
import React from 'react';
import Text from '../../../components/Text';
import classnames from 'classnames';
import style from '../style.css';

class Title extends React.Component {
    static propTypes = {
        title: PropTypes.string
    }

    static contextTypes = {
        implementationStyle: PropTypes.object
    }

    getStyle(name) {
        return (this.context.implementationStyle && this.context.implementationStyle[name]) || style[name];
    }

    render() {
        return (
            <div className={classnames('f15 f-semibold f-gray-dark f-upper margin-top-15', this.getStyle('loginTitleContainer'))}>
                <Text>{this.props.title}</Text>
            </div>
        );
    }
};

export default Title;
