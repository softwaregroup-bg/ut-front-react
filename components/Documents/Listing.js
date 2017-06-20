import React, { Component, PropTypes } from 'react';
import { Vertical } from '../Layout';
import Toolbox from './Toolbox';
import DocumentsGrid from './DocumentsGrid';
import style from './style.css';

class Documents extends Component {
    constructor(props) {
        super(props);
        this.fetchDocs = this.fetchDocs.bind(this);
        this.fetchArchivedDocs = this.fetchArchivedDocs.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.actorId !== nextProps.actorId || nextProps.requiresFetch) {
            this.fetchDocs(nextProps.actorId, true, nextProps.isLoading, nextProps.identifier);
        }
        if (nextProps.selectedFilter === 'archived' && nextProps.documentArchived.get('requiresFetch')) {
            this.fetchArchivedDocs(nextProps.actorId, nextProps.documentArchived.get('requiresFetch'), nextProps.documentArchived.get('isLoading'), nextProps.identifier);
        }
    }

    fetchDocs(actorId, requiresFetch, isLoading, identifier) {
        if (actorId && requiresFetch && !isLoading) {
            this.props.fetchDocuments(actorId, identifier);
        }
    }

    fetchArchivedDocs(actorId, requiresFetch, isLoading, identifier) {
        if (actorId && requiresFetch && !isLoading) {
            this.props.fetchArchivedDocuments(actorId, identifier);
        }
    }

    get header() {
        return (
            <Toolbox
              selectedAttachment={this.props.selectedAttachment}
              documents={this.props.documents}
              documentArchived={this.props.documentArchived}
              selectedFilter={this.props.selectedFilter}
              changeDocumentFilter={this.props.changeDocumentFilter}
              documentTypes={this.props.documentTypes}
              uploadNewDocument={this.props.uploadNewDocument}
              replaceDocument={this.props.replaceDocument}
              deleteDocument={this.props.deleteDocument}
              archiveDocument={this.props.archiveDocument}
              allowedFileTypes={this.props.allowedFileTypes}
              permissions={this.props.permissions}
            />
        );
    }

    get mergeDocuments() {
        return this.props.documentsChanged.concat(this.props.documents);
    }

    render() {
        let { identifier, onGridSelect, selectedFilter, documentArchived, selectedAttachment } = this.props;
        return (
            <div className={style.documentsWrap}>
                <Vertical fixedComponent={this.header}>
                    <DocumentsGrid
                      identifier={identifier}
                      documents={this.mergeDocuments}
                      selectedFilter={selectedFilter}
                      documentArchived={documentArchived}
                      onGridSelect={onGridSelect}
                      selected={selectedAttachment}
                    />
                </Vertical>
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
    documents: PropTypes.array,
    documentsChanged: PropTypes.array,
    selectedAttachment: PropTypes.object, // immutable object
    requiresFetch: PropTypes.bool,
    isLoading: PropTypes.bool,
    selectedFilter: PropTypes.string,
    documentArchived: PropTypes.object, // immutable object

    // funcs
    fetchDocuments: PropTypes.func.isRequired,
    fetchArchivedDocuments: PropTypes.func.isRequired,
    onGridSelect: PropTypes.func,
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
    archiveDocument: PropTypes.func,
    // updatedAttachments: PropTypes.object, // immutable list
    allowedFileTypes: PropTypes.array,
    // excludeAttachmentIds: PropTypes.array,

    permissions: Toolbox.propTypes.permissions
};

Documents.defaultProps = {
    requiresFetch: false,
    isLoading: false,
    allowedFileTypes: ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'],
    documentTypes: []
};

export default Documents;
