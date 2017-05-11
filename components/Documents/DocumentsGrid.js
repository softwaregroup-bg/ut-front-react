import React, { Component, PropTypes } from 'react';
import immutable from 'immutable';
import { getListTableColumns, getListTdStyles } from './helpers';
import DateComponent from '../Date';
import Grid from '../Grid';
import { capitalizeFirstLetter } from '../../utils/helpers';
import style from './style.css';

class DocumentsGrid extends Component {
    constructor(props) {
        super(props);
        this.mapColumn = this.mapColumn.bind(this);
    }

    mapColumn(col, colData) {
        if (col.key === 'documentType') {
            return capitalizeFirstLetter(colData);
        }
        if (col.key === 'statusId') {
            let label = colData;
            if (colData === 'approved') {
                label = 'active';
            }
            return capitalizeFirstLetter(label);
        }
        if (col.key === 'documentDescription') {
            return colData || '(no description)';
        }
        if (col.key === 'createdDate') {
            return <DateComponent>{colData}</DateComponent>;
        }
        return colData;
    }

    get content() {
        let { identifier, activeAttachments, onGridSelect, selectedFilter, documentArchived } = this.props;
        let handleSelectItem = (selectedItem, isSelected) => {
            onGridSelect(selectedItem, isSelected, identifier);
        };
        let gridData = immutable.List();
        switch (selectedFilter) {
            case 'all':
                gridData = activeAttachments;
                break;
            case 'archived':
                gridData = documentArchived.get('data');
                break;
        }
        if (gridData && gridData.size > 0) {
            return (
                <div>
                    <Grid
                      columns={getListTableColumns()}
                      rows={gridData}
                      canCheck={false}
                      mapColumn={this.mapColumn}
                      onSelect={handleSelectItem}
                      sortableColumns={[false, false, false, false, false]}
                      tdStyles={getListTdStyles()}
                    />
                </div>
            );
        } else {
            return (
                <div className={style.noUploadedDocumentsWrap}>
                    {/* <Text>No uploaded documents yet</Text>. */}
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                {this.content}
            </div>
        );
    }
}

DocumentsGrid.defaultProps = {
    onGridSelect: () => {}
};

DocumentsGrid.propTypes = {
    // identifier: PropTypes.string.isRequired,
    identifier: PropTypes.string,
    activeAttachments: PropTypes.object, // immutable list
    selectedFilter: PropTypes.string,
    documentArchived: PropTypes.object, // immutable object

    // funcs
    onGridSelect: PropTypes.func
};

export default DocumentsGrid;
