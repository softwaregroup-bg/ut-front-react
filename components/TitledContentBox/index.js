import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import style from './style.css';

class TitledContentBox extends Component {
    render() {
        const {externalContentClasses, externalHeaderClasses} = this.props;
        return (
            <div className={style.titledContentWrap}>

                <div className={classnames(style.headerWrap, externalHeaderClasses)}>
                    <div className={this.props.centered ? style.titleCentered : style.title}>
                        {this.props.title}
                    </div>
                    <div className={style.rightWrap}>
                        {this.props.headRightWrap}
                    </div>
                </div>

                <div className={classnames(style.contentWrap, externalContentClasses)}>
                    {this.props.children}
                </div>

            </div>
        );
    }
}

TitledContentBox.propTypes = {
    centered: PropTypes.bool,
    title: PropTypes.any.isRequired,
    children: PropTypes.any,
    headRightWrap: PropTypes.any,
    externalContentClasses: PropTypes.string,
    externalHeaderClasses: PropTypes.string
};

export default TitledContentBox;
