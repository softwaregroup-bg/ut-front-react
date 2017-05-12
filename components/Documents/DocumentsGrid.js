import React, { Component, PropTypes } from 'react';
import immutable from 'immutable';
import { getListTableColumns } from './helpers';
import DateComponent from '../Date';
import { SimpleGrid } from '../SimpleGrid';
import Text from '../Text';
import { capitalizeFirstLetter } from '../../utils/helpers';
import style from './style.css';

class DocumentsGrid extends Component {
    constructor(props) {
        super(props);
        this.mapColumn = this.mapColumn.bind(this);
    }

    mapColumn(content, configObj, obj) {
        switch (configObj.name) {
            case 'documentType':
                return capitalizeFirstLetter(content);
            case 'documentDescription':
                if (content) {
                    return content;
                } else {
                    return <span className={style.fileDetailsNoText}><Text>(no description)</Text></span>;
                }
            case 'extension':
                return content;
            case 'createdDate':
                return <DateComponent>{content}</DateComponent>;
            case 'statusId':
                let label = content;
                if (content === 'approved') {
                    label = 'active';
                }
                return capitalizeFirstLetter(label);
        }
        return content;
    }

    get content() {
        let { identifier, activeAttachments, onGridSelect, selectedFilter, documentArchived, selected } = this.props;
        let handleSelectItem = (selectedItem) => {
            let isSelected = selected ? selected.get('filename') === selectedItem.filename : false;
            onGridSelect(immutable.fromJS(selectedItem), !isSelected, identifier);
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
            let selectedItem = selected ? [selected] : [];
            return (
                <div>
                    <SimpleGrid
                      multiSelect={false}
                      globalMenu={false}
                      emptyRowsMsg={<Text>No results</Text>}
                      fields={getListTableColumns()}
                      data={gridData.toJS()}
                      transformCellValue={this.mapColumn}
                      handleRowClick={handleSelectItem}
                      rowsChecked={selectedItem}
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
    selected: PropTypes.object, // immutable object

    // funcs
    onGridSelect: PropTypes.func
};

export default DocumentsGrid;
