import PropTypes from 'prop-types';
import React, { Component } from 'react';
import immutable from 'immutable';
import { getDocumentTypeValidators, getDocumentDescriptionValidators } from './helpers';
import { validateAll } from '../../utils/validator';
import Input from '../Input';
import Dropdown from '../Input/Dropdown';
import DocumentUpload from '../DocumentUpload';
import DatePicker from '../DatePicker/Simple';
import style from './style.css';

class DocumentUploadWithForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileType: '',
            description: '',
            attachmentId: 0,
            countryId: 0,
            documentNumber: '',
            expirationDate: null,
            issueDate: null,
            issuedBy: null,
            isValidForm: false,
            errors: {}
        };
        this.handleValidation = this.handleValidation.bind(this);
        this.closeHandler = this.closeHandler.bind(this);
        this.useFileHandler = this.useFileHandler.bind(this);
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.isOpen === false && nextProps.isOpen === true) {
            this.setState({
                isValidForm: false,
                errors: {}
            });
            if (nextProps.type === 'replace') {
                this.setState({
                    fileType: nextProps.editValues.documentTypeId,
                    description: nextProps.editValues.description,
                    documentNumber: nextProps.editValues.documentNumber,
                    expirationDate: nextProps.editValues.expirationDate,
                    issueDate: nextProps.editValues.issueDate,
                    issuedBy: nextProps.editValues.issuedBy,
                    isValidForm: true,
                    attachmentId: nextProps.editValues.attachmentId,
                    countryId: nextProps.editValues.countryId,
                });
            } else if (nextProps.type === 'add') {
                this.setState({
                    fileType: '',
                    description: '',
                    documentNumber: '',
                    expirationDate: null,
                    issueDate: null,
                    issuedBy: null,
                    isValidForm: false,
                    attachmentId: 0,
                    countryId: 0
                });
            }
        }
    }

    handleValidation(fileType, description) {
        const result = validateAll(immutable.fromJS({
            fileType: fileType,
            description: description
        }), [getDocumentTypeValidators(), getDocumentDescriptionValidators()]);
        const errors = {};
        if (result.errors && result.errors.length > 0) {
            result.errors.forEach((err) => {
                errors[err.key[0]] = err.errorMessage;
            });
        }
        this.setState({
            isValidForm: result.isValid,
            errors: errors
        });
    };

    get renderUploadDocumentForm() {
        let disabledField = false;
        if (this.props.type === 'replace' && this.props.editValues) {
            disabledField = true;
        }
        return (
            <div className={style.formWrapper}>
                <div className={style.formRow}>
                    <Dropdown
                        label='Document type'
                        data={this.props.documentTypes}
                        canSelectPlaceholder={false}
                        placeholder='Select document type'
                        keyProp='fileType'
                        defaultSelected={this.state.fileType}
                        onSelect={(obj) => {
                            this.setState({
                                fileType: obj.value
                            }, this.handleValidation(obj.value, this.state.description));
                        }}
                        isValid={this.state.errors.fileType === undefined}
                        errorMessage={this.state.errors.fileType}
                        disabled={disabledField}
                    />
                </div>
                <div className={style.formRow}>
                    <Input
                        label='Document Number'
                        keyProp='documentNumber'
                        placeholder='Document number'
                        value={this.state.documentNumber}
                        onChange={(obj) => {
                            this.setState({
                                documentNumber: obj.value
                            }, this.handleValidation(this.state.fileType, obj.value));
                        }}
                        isValid={this.state.errors.documentNumber === undefined}
                        errorMessage={this.state.errors.documentNumber}
                        readonly={disabledField}
                    />
                </div>
                <div className={style.formRow}>
                    <DatePicker
                        label={'Issue Date'}
                        defaultValue= {this.state.issueDate}
                        onChange={(obj) => {
                            this.setState({
                                issueDate: obj.value
                            }, this.handleValidation(this.state.fileType, obj.value));
                        }}
                        maxDate= {new Date()}
                        format="dd/MM/yyyy"
                        clearable={true}
                        disabled={disabledField}
                        wrapperClassName={style.boldLabel}
                        withVerticalClass={true}
                    />
                </div>
                <div className={style.formRow}>
                    <Dropdown
                        label='Country'
                        data={this.props.countries}
                        keyProp='countryId'
                        defaultSelected={this.state.countryId}
                        placeholder='Select Country'
                        onSelect={(obj) => {
                            this.setState({
                                countryId: obj.value
                            }, this.handleValidation(this.state.fileType, obj.value));
                        }}
                        disabled={disabledField}
                    />
                </div>
                <div className={style.formRow}>
                    <Input
                        label='Issued By'
                        keyProp='issuedBy'
                        placeholder='Issued By'
                        value={this.state.issuedBy}
                        onChange={(obj) => {
                            this.setState({
                                issuedBy: obj.value
                            }, this.handleValidation(this.state.fileType, obj.value));
                        }}
                        isValid={this.state.errors.issuedBy === undefined}
                        errorMessage={this.state.errors.issuedBy}
                        readonly={disabledField}
                    />
                </div>
                <div className={style.formRow}>
                    <DatePicker
                        label={'Expiration Date'}
                        defaultValue= {this.state.expirationDate}
                        onChange={(obj) => {
                            this.setState({
                                expirationDate: obj.value
                            }, this.handleValidation(this.state.fileType, obj.value));
                        }}
                        minDate= {new Date()}
                        format="dd/MM/yyyy"
                        clearable={true}
                        disabled={disabledField}
                        wrapperClassName={style.boldLabel}
                        withVerticalClass={true}
                    />
                </div>
                <div className={style.formRow}>
                    <Input
                        label='Description'
                        keyProp='description'
                        placeholder='Description of the document'
                        value={this.state.description}
                        onChange={(obj) => {
                            this.setState({
                                description: obj.value
                            }, this.handleValidation(this.state.fileType, obj.value));
                        }}
                        isValid={this.state.errors.description === undefined}
                        errorMessage={this.state.errors.description}
                        readonly={disabledField}
                    />
                </div>
            </div>
        );
    };

    closeHandler() {
        this.setState({
            fileType: '',
            description: '',
            documentNumber: '',
            expirationDate: null,
            issueDate: null,
            issuedBy: null,
            isValidForm: false,
            countryId: 0
        });
        this.props.closePopup();
    };

    useFileHandler(uploadedFile) {
        let type;
        for (let i = 0; i < this.props.documentTypes.length; i++) {
            if (this.props.documentTypes[i].key === this.state.fileType) {
                type = this.props.documentTypes[i];
                break;
            }
        }
        const description = this.state.description;
        const documentNumber = this.state.documentNumber;
        const expirationDate = this.state.expirationDate;
        const issueDate = this.state.issueDate;
        const issuedBy = this.state.issuedBy;
        const countryId = this.state.countryId;

        this.closeHandler();
        if (this.props.type === 'add') {
            this.props.uploadNewDocument({
                documentTypeId: type.key,
                documentType: type.name,
                statusId: 'new',
                description: description,
                documentNumber: documentNumber,
                issueDate: issueDate,
                issuedBy: issuedBy,
                expirationDate: expirationDate,
                countryId: countryId,
                ...uploadedFile
            });
        } else if (this.props.type === 'replace') {
            this.props.replaceDocument({
                attachmentId: this.state.attachmentId,
                statusId: 'pending',
                ...uploadedFile
            });
        }
    };

    render() {
        return (
            <DocumentUpload
                isOpen={this.props.isOpen}
                header={this.props.header}
                closePopup={this.closeHandler}
                scaleDimensions={{width: 350, height: 350}}
                additionalContentValidate={() => { this.handleValidation(this.state.fileType, this.state.description); }}
                isAdditionalContentValid={this.state.isValidForm}
                useFile={this.useFileHandler}
                uploadDocument={this.props.uploadDocument}
                hideCrop
                allowedFileTypes={this.props.allowedFileTypes}
                uploadURL={this.props.uploadURL}
            >
                {this.renderUploadDocumentForm}
            </DocumentUpload>
        );
    }
}

DocumentUploadWithForm.propTypes = {
    isOpen: PropTypes.bool,
    header: PropTypes.object,
    closePopup: PropTypes.func,
    type: PropTypes.oneOf(['add', 'replace']),
    editValues: PropTypes.object,
    documentTypes: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            name: PropTypes.string
        })
    ),
    countries: PropTypes.array,
    uploadURL: PropTypes.string,
    allowedFileTypes: PropTypes.array,
    replaceDocument: PropTypes.func,
    uploadNewDocument: PropTypes.func,
    uploadDocument: PropTypes.func
};

DocumentUploadWithForm.defaultProps = {
    documentTypes: [],
    uploadNewDocument: () => {},
    replaceDocument: () => {},
    closePopup: () => {},
    uploadDocument: () => {}
};

export default DocumentUploadWithForm;
