import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import Text from '../../../components/Text';
import style from '../style.css';
import Icon from '../../../components/Icon';

class ErrorSection extends React.Component {
    static propTypes = {
        text: PropTypes.string
    };

    static contextTypes = {
        implementationStyle: PropTypes.object
    };

    getStyle(name) {
        return (this.context.implementationStyle && this.context.implementationStyle[name]) || style[name];
    }

    render() {
        return (
            <div>
                <div className='margin-top-40 margin-bottom-25'>
                    <Icon icon='error' />
                </div>
                <div className={classnames('f28 f-red', this.getStyle('loginErrorContainerTextContainer'))}>
                    <Text>{this.props.text}</Text>
                </div>
            </div>
        );
    }
};

export default ErrorSection;
