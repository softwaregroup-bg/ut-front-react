import React, { Component, PropTypes } from 'react';
import style from './verticalStyles.css';

class Vertical extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fixedComponent: 0
        };
        this.updateHeight = this.updateHeight.bind(this);
    }

    componentDidMount() {
        this.updateHeight();
    }

    componentDidUpdate() {
        this.updateHeight();
    }

    updateHeight() {
        let { clientHeight } = this.refs.fixedComponent;
        if (clientHeight !== this.state.fixedComponent) {
            this.setState({
                fixedComponent: clientHeight
            });
        }
    }

    render() {
        let height = this.state.fixedComponent + 'px';
        return (
            <div className={style.verticalWrapper}>
                <div ref='fixedComponent'>{this.props.fixedComponent}</div>
                <div style={{height: 'calc(100% - ' + height + ')'}} className={style.vertical}>{this.props.children}</div>
            </div>
        );
    }
};

Vertical.propTypes = {
    children: PropTypes.any,
    fixedComponent: PropTypes.any.isRequired
};

export default Vertical;
