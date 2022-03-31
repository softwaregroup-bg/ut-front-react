import PropTypes from 'prop-types';
import React, { Component } from 'react';
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
        if (!obj) {
            return capitalizeFirstLetter(content);
        }
        switch (configObj.name) {
            case 'documentType':
                if (obj.documentTypeName) {
                    return capitalizeFirstLetter(obj.documentTypeName);
                };
                break;
            case 'documentDescription':
                if (obj.description) {
                    return obj.description;
                } else {
                    return <span className={style.fileDetailsNoText}><Text>(no description)</Text></span>;
                }
            case 'extension':
                return obj.attachments && obj.attachments[0] ? obj.attachments[0].extension : '';
            case 'createdDate':
                return <DateComponent>{ obj.createdDate }</DateComponent>;
            case 'issueDate':
                return <DateComponent>{ obj.issueDate }</DateComponent>;
            case 'expirationDate':
                return <DateComponent>{obj.expirationDate }</DateComponent>;
            case 'statusId': {
                let label = obj.statusId;
                if (obj.statusId === 'approved') {
                    label = 'active';
                }
                return capitalizeFirstLetter(label);
            }
        }
        return capitalizeFirstLetter(content);
    }

    get content() {
        const { identifier, documents, onGridSelect, selectedFilter, documentArchived, selected } = this.props;
        const handleSelectItem = (selectedItem) => {
            const isSelected = selected ? selected.getIn(['attachments', 0, 'filename']) === selectedItem.attachments[0].filename : false;
            onGridSelect(immutable.fromJS(selectedItem), !isSelected, identifier);
        };
        let gridData = [];
        switch (selectedFilter) {
            case 'all':
                gridData = documents;
                break;
            case 'archived':
                gridData = documentArchived.get('data').toJS();
                break;
        }
        if (gridData.length > 0) {
            const selectedItem = selected ? [selected] : [];
            return (
                <div>
                    <SimpleGrid
                        multiSelect={false}
                        globalMenu={false}
                        emptyRowsMsg={<Text>No results</Text>}
                        fields={getListTableColumns()}
                        data={gridData}
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
    onGridSelect: () => {},
    selectedFilter: 'all'
};

DocumentsGrid.propTypes = {
    identifier: PropTypes.string,
    documents: PropTypes.array,
    selectedFilter: PropTypes.string,
    documentArchived: PropTypes.object, // immutable object
    selected: PropTypes.object, // immutable object

    // funcs
    onGridSelect: PropTypes.func
};

export default DocumentsGrid;
