import React, {Component, PropTypes} from 'react';
import mainStyle from './style.css';
import SvgSearchIcon from 'material-ui/svg-icons/action/search';
import styles from '../StandardButton/styles.css';
import classnames from 'classnames';

export class AdvancedSearchButton extends Component {
    render() {
        return (
            <div>
                <button className={classnames(styles.defaultBtn, mainStyle.defaultButton)} onClick={this.props.onClick}>
                    {<span className={mainStyle.iconWrap}>
                        <SvgSearchIcon color='#808080' style={{display: 'flex', height: '20px'}} />
                    </span>} Advanced Search </button>
            </div>

        );
    }
}

AdvancedSearchButton.propTypes = {onClick: PropTypes.func.isRequired};

AdvancedSearchButton.defaultProps = {
    show: false
};

export default AdvancedSearchButton;
