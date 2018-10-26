import React, { PropTypes, Component } from 'react';
import style from './style.css';

class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: window.innerHeight - (59 + 55 + 76)
        };
        this.resize = () => this.setState({
            height: window.innerHeight - (59 + 55 + 76)
        });
    }

    componentDidMount() {
        window.addEventListener('resize', this.resize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

    render() {
        let styles = {
            borderTop: this.props.bordered ? '' : 'none'
        };
        return (
            <div id={style.mainContentWrap} style={styles}>
                <div className='w100pr h100pr'>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

Container.propTypes = {
    children: PropTypes.any,
    bordered: PropTypes.bool
};

Container.defaultProps = {
    bordered: true
};

export default Container;
