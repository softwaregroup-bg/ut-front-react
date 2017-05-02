import React, { Component, PropTypes } from 'react';
import immutable from 'immutable';
import { getDocumentTypeValidators, getDocumentDescriptionValidators } from './helpers';
import { validateAll } from '../../utils/validator';
import Input from '../Input';
import Dropdown from '../Input/Dropdown';
import DocumentUpload from '../DocumentUpload';
import style from './style.css';

class DocumentUploadWithForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileType: '',
            description: '',
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
        }
    }

    handleValidation(fileType, description) {
        let result = validateAll(immutable.fromJS({
            fileType: fileType,
            description: description
        }), [getDocumentTypeValidators(), getDocumentDescriptionValidators()]);
        let errors = {};
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
        return (
            <div className={style.formWrapper}>
                <div className={style.formRow}>
                    <Dropdown
                      label='File type'
                      data={this.props.documentTypes}
                      canSelectPlaceholder={false}
                      placeholder='Select type'
                      keyProp='fileType'
                      defaultSelected={this.state.fileType}
                      onSelect={(obj) => {
                          this.setState({
                              fileType: obj.value
                          }, this.handleValidation(obj.value, this.state.description));
                      }}
                      isValid={this.state.errors.fileType === undefined}
                      errorMessage={this.state.errors.fileType}
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
                    />
                </div>
            </div>
        );
    };

    closeHandler() {
        this.setState({
            fileType: '',
            description: '',
            isValidForm: false
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
        let statusId = 'New';
        let description = this.state.description;
        this.closeHandler();
        this.props.uploadNewDocument({
            documentTypeId: type.key,
            documentType: type.name,
            statusId,
            documentDescription: description,
            ...uploadedFile
        });
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
              hideCrop
              allowedFileTypes={this.props.allowedFileTypes}
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
    documentTypes: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            name: PropTypes.string
        })
    ),
    allowedFileTypes: PropTypes.array,
    uploadNewDocument: PropTypes.func
};

DocumentUploadWithForm.defaultProps = {
    documentTypes: [],
    uploadNewDocument: () => {},
    closePopup: () => {}
};

export default DocumentUploadWithForm;
