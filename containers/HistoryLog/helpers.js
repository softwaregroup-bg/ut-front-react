import immutable from 'immutable';

export function isFilterApplied(filters, actualFilters) {
    for (var i = 0; i < actualFilters.length; i++) {
        if (filters.get(actualFilters[i]) && filters.get(actualFilters[i]).toString().length > 0) {
            return true;
        }
    }
    return false;
}
/**
 * @param {immutable.List} left
 * @param {immutable.List} right
 * @return {immutable}
 */
export function intersectChecked(left, right) {
    let result = [];
    let visited = {};

    let leftCount = left.size;
    while (--leftCount >= 0) {
        let current = left.get(leftCount);
        visited[current.get('actorId')] = true;
        result.push(current);
    }

    let rightCount = right.size;
    while (--rightCount >= 0) {
        let current = right.get(rightCount);
        !visited[current.get('actorId')] && result.push(current);
    }

    return immutable.fromJS(result);
}

/**
 * @param {immutable.List} left
 * @param {immutable.List} right
 * @return {immutable}
 */
export function removeChecked(left, right) {
    let removed = {};
    let rightCount = right.size;
    while (--rightCount >= 0) {
        let current = right.get(rightCount);
        removed[current.get('actorId')] = true;
    }

    return immutable.fromJS(left.filter(function(record) {
        return !removed[record.get('actorId')];
    }));
}

export function dateValidations(params) {
    var fromDate = params.fromDate ? typeof params.fromDate === 'object' ? params.fromDate.toJSON() : params.fromDate : '';
    var toDate = params.toDate ? typeof params.toDate === 'object' ? params.toDate.toJSON() : params.toDate : '';
    if (fromDate > new Date().toJSON()) {
        return ({key: 'error', value: `From date should always less than today's date`});
    } else if (!!toDate && !!fromDate && fromDate > toDate) {
        return ({key: 'error', value: 'From date should always less than To date'});
    } else {
        return params;
    }
}
