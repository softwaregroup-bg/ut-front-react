import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './verticalStyles.css';
import { getMarginBox } from '../../utils/dom';

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
        const height = getMarginBox(this.refs.fixedComponent).height;
        if (height !== this.state.fixedComponent) {
            this.setState({
                fixedComponent: height
            });
        }
    }

    render() {
        const height = this.state.fixedComponent + 'px';
        return (
            <div className={style.verticalWrapper}>
                <div ref='fixedComponent'>{this.props.fixedComponent}</div>
                <div style={{height: 'calc(100% - ' + height + ')'}} className={style.vertical}>
                    <div className={style.innerContent}>{this.props.children}</div>
                </div>
            </div>
        );
    }
};

Vertical.propTypes = {
    children: PropTypes.any,
    fixedComponent: PropTypes.any.isRequired
};

export default Vertical;
