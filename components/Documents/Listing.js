import React, { Component, PropTypes } from 'react';
import immutable from 'immutable';
import { getListTableColumns, getListTdStyles } from './helpers';
import { Vertical } from '../Layout';
import Grid from '../Grid';
import DateComponent from '../Date';
import Toolbox from './Toolbox';
import { capitalizeFirstLetter } from '../../utils/helpers';
import style from './style.css';

class Documents extends Component {
    constructor(props) {
        super(props);
        this.fetchDocs = this.fetchDocs.bind(this);
        this.fetchArchivedDocs = this.fetchArchivedDocs.bind(this);
        this.mapColumn = this.mapColumn.bind(this);
    }

    componentWillMount() {
        this.fetchDocs(this.props.actorId, this.props.requiresFetch, this.props.isLoading);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.actorId !== nextProps.actorId || nextProps.requiresFetch) {
            this.fetchDocs(nextProps.actorId, nextProps.requiresFetch, nextProps.isLoading);
        }
        if (nextProps.selectedFilter === 'archived' && nextProps.documentArchived.get('requiresFetch')) {
            this.fetchArchivedDocs(nextProps.actorId, nextProps.documentArchived.get('requiresFetch'), nextProps.documentArchived.get('isLoading'));
        }
    }

    fetchDocs(actorId, requiresFetch, isLoading) {
        if (actorId && requiresFetch && !isLoading) {
            this.props.fetchDocuments(actorId, this.props.identifier);
        }
    }

    fetchArchivedDocs(actorId, requiresFetch, isLoading) {
        if (actorId && requiresFetch && !isLoading) {
            this.props.fetchArchivedDocuments(actorId, this.props.identifier);
        }
    }

    get header() {
        return (
            <Toolbox
              selectedAttachment={this.props.selectedAttachment}
              activeAttachments={this.props.activeAttachments}
              documentArchived={this.props.documentArchived}
              selectedFilter={this.props.selectedFilter}
              changeDocumentFilter={this.props.changeDocumentFilter}
              documentTypes={this.props.documentTypes}
              uploadNewDocument={this.props.uploadNewDocument}
              replaceDocument={this.props.replaceDocument}
              deleteDocument={this.props.deleteDocument}
              allowedFileTypes={this.props.allowedFileTypes}
              permissions={this.props.permissions}
            />
        );
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
            default:
                gridData = immutable.List();
        }

        if (gridData && gridData.size > 0) {
            return (
                <div>
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
            <div className={style.documentsWrap}>
                {this.detailsVew}
                <Vertical
                  fixedComponent={this.header}
                  children={this.content}
                />
                {this.renderDocumentUplodDialog}
            </div>
        );
    }
}

Documents.propTypes = {
    /**
     *  identifier convention: module_tab_subtab
     *  e.g. In Customer module, Customers tab with Documents sub tab: customer_customers_documents
     */
    identifier: PropTypes.string.isRequired,
    actorId: PropTypes.number,
    activeAttachments: PropTypes.object, // immutable list
    selectedAttachment: PropTypes.object, // immutable object
    requiresFetch: PropTypes.bool,
    isLoading: PropTypes.bool,
    selectedFilter: PropTypes.string,
    documentArchived: PropTypes.object, // immutable object

    // funcs
    fetchDocuments: PropTypes.func.isRequired,
    fetchArchivedDocuments: PropTypes.func.isRequired,
    onGridSelect: PropTypes.func,
    // onDelete: PropTypes.func,
    changeDocumentFilter: PropTypes.func.isRequired,

    documentTypes: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            name: PropTypes.string
        })
    ),

    uploadNewDocument: PropTypes.func,
    replaceDocument: PropTypes.func,
    deleteDocument: PropTypes.func,
    // archiveDocument: PropTypes.func,
    // updatedAttachments: PropTypes.object, // immutable list
    allowedFileTypes: PropTypes.array,
    // excludeAttachmentIds: PropTypes.array,

    permissions: Toolbox.propTypes.permissions
};

Documents.defaultProps = {
    requiresFetch: false,
    onGridSelect: () => {},
    allowedFileTypes: ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'],
    documentTypes: []
};

export default Documents;
