import { Chip, Container, Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import DocumentsGrid from './DocumentsGrid';
import { mergeDocumentsWithChanged } from './helpers';
import style from './style.css';
import Toolbox from './Toolbox';

class Documents extends Component {
    constructor(props) {
        super(props);
        this.fetchArchivedDocs = this.fetchArchivedDocs.bind(this);
        this.validateDocumentType = this.validateDocumentType.bind(this);
        this.filterDocumentTypes = this.filterDocumentTypes.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedFilter === 'archived' && nextProps.documentArchived.get('requiresFetch')) {
            this.fetchArchivedDocs(nextProps.actorId, nextProps.documentArchived.get('requiresFetch'), nextProps.documentArchived.get('isLoading'), nextProps.identifier);
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
                documents={this.mergeDocuments}
                countries={this.props.countries}
                documentArchived={this.props.documentArchived}
                selectedFilter={this.props.selectedFilter}
                changeDocumentFilter={this.props.changeDocumentFilter}
                documentTypes={this.props.documentTypes}
                uploadNewDocument={this.props.uploadNewDocument}
                uploadDocument={this.props.uploadDocument}
                replaceDocument={this.props.replaceDocument}
                deleteDocument={this.props.deleteDocument}
                archiveDocument={this.props.archiveDocument}
                allowedFileTypes={this.props.allowedFileTypes}
                permissions={this.props.permissions}
                uploadURL={this.props.uploadURL}
                mode={this.props.mode}
            />
        );
    }

    get mergeDocuments() {
        return mergeDocumentsWithChanged(this.props.documents, this.props.documentsChanged);
    }

    validateDocumentType(key) {
        const { documentsChanged, validationConfig } = this.props;

        const validation = validationConfig[key];
        if (!validation) return false;
        const typeDocuments = documentsChanged.filter(doc => doc.documentTypeId === key);
        if (!validation.required) return true;
        return typeDocuments.length >= validation.min && typeDocuments.length <= validation.max;
    }

    filterDocumentTypes(key) {
        const { documentsChanged, validationConfig } = this.props;

        const validation = validationConfig[key];
        if (!validation) return false;
        const typeDocuments = documentsChanged.filter(doc => doc.documentTypeId === key);
        if (!validation.required) return true;
        return !(typeDocuments.length === validation.max);
    }

    render() {
        const { identifier, onGridSelect, selectedFilter, documentArchived, selectedAttachment, documentTypes, documentsChanged, validationConfig } = this.props;

        const docTypes = validationConfig ? documentTypes.filter(type => this.filterDocumentTypes(type.key)) : documentTypes;

        return (
            <div className={style.documentsWrap}>
                <Toolbox
                    selectedAttachment={this.props.selectedAttachment}
                    documents={this.mergeDocuments}
                    countries={this.props.countries}
                    documentArchived={this.props.documentArchived}
                    selectedFilter={this.props.selectedFilter}
                    changeDocumentFilter={this.props.changeDocumentFilter}
                    documentTypes={docTypes}
                    uploadNewDocument={this.props.uploadNewDocument}
                    uploadDocument={this.props.uploadDocument}
                    replaceDocument={this.props.replaceDocument}
                    deleteDocument={this.props.deleteDocument}
                    archiveDocument={this.props.archiveDocument}
                    allowedFileTypes={this.props.allowedFileTypes}
                    permissions={this.props.permissions}
                    uploadURL={this.props.uploadURL}
                    mode={this.props.mode}
                >
                    <DocumentsGrid
                        identifier={identifier}
                        documents={this.mergeDocuments}
                        selectedFilter={selectedFilter}
                        documentArchived={documentArchived}
                        onGridSelect={onGridSelect}
                        selected={selectedAttachment}
                        mode={this.props.mode}
                    />
                    {validationConfig && <Container maxWidth disableGutters={true} style={{ position: 'absolute', bottom: '2rem' }}>
                        <Grid container style={{ gap: '1rem' }}>
                            {
                                this.props.documentTypes.map(type => {
                                    console.log('type', type);
                                    const uploadedDocs = documentsChanged.filter(doc => doc.documentTypeId === type.key).length;
                                    const validated = this.validateDocumentType(type.key);
                                    return <Grid>
                                        <Chip
                                            label={type.name}
                                            icon={
                                                <span style={{ width: '17px', height: '17px', color: 'white', background: validated ? 'green' : 'red', borderRadius: '50%', marginLeft: '7px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
                                                    {uploadedDocs}
                                                </span>
                                            }
                                        />
                                    </Grid>;
                                })
                            }
                        </Grid>
                    </Container>}
                </Toolbox>
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
    countries: PropTypes.array,
    documentsChanged: PropTypes.array,
    selectedAttachment: PropTypes.object, // immutable object
    // requiresFetch: PropTypes.bool,
    // isLoading: PropTypes.bool,
    selectedFilter: PropTypes.string,
    documentArchived: PropTypes.object, // immutable object
    uploadURL: PropTypes.string,
    validationConfig: PropTypes.objectOf(PropTypes.exact({
        min: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired,
        required: PropTypes.bool.isRequired,
    })),

    // funcs
    fetchArchivedDocuments: PropTypes.func.isRequired,
    onGridSelect: PropTypes.func,
    changeDocumentFilter: PropTypes.func.isRequired,

    documentTypes: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            name: PropTypes.string
        })
    ),
    documentTypeClass: PropTypes.string,
    mode: PropTypes.string,

    uploadNewDocument: PropTypes.func,
    uploadDocument: PropTypes.func,
    replaceDocument: PropTypes.func,
    deleteDocument: PropTypes.func,
    archiveDocument: PropTypes.func,
    allowedFileTypes: PropTypes.array,

    permissions: Toolbox.propTypes.permissions
};

Documents.defaultProps = {
    // requiresFetch: false,
    // isLoading: false,
    allowedFileTypes: ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'],
    documentTypes: [],
    mode: 'default'
};

export default Documents;
