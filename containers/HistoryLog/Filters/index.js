import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {ClearFilter} from 'ut-front-react/components/ClearFilter';
import Between from './Between';
import {clearFilters} from '../actions';
import {isFilterApplied} from '../../../helpers';
import style from '../style.css';
const actualFilters = ['fromDate', 'toDate'];
class Filters extends Component {
    render() {
        var isShowClear = isFilterApplied(this.props.filters, actualFilters);
        return (
        <div className={style.filterWrap}>
            <div> <Between requireFetch withVerticalClass={false} /> </div>
            {isShowClear && <div className={style.clearFilterWrap}><ClearFilter show={isShowClear} onClick={this.props.clearFilters} /></div>}
        </div>);
    }
}

Filters.propTypes = {
    clearFilters: PropTypes.func,
    filters: PropTypes.object // immutable object
};

function mapStateToProps(state) {
    let { objectId, objectName } = state.historyContainer.get('config').toJS();
    return {
        filters: state.historyContainer.getIn([objectName, objectId, 'filters'])
    };
}

export default connect(
    mapStateToProps, {
        clearFilters
    })(Filters);
