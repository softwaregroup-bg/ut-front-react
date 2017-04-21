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
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {
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

    render() {
        let renderUploadDocumentForm = (
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
        let closeHandler = () => {
            this.setState({
                fileType: '',
                description: '',
                isValidForm: false
            });
            this.props.closePopup();
        };
        let useFileHandler = (uploadedFile) => {
            let type;
            for (let i = 0; i < this.props.documentTypes.length; i++) {
                if (this.props.documentTypes[i].key === this.state.fileType) {
                    type = this.props.documentTypes[i];
                    break;
                }
            }
            let status = 'New';
            this.props.uploadNewDocument({type, status, description: this.state.description, ...uploadedFile});
            closeHandler();
        };
        return (
            <DocumentUpload
              isOpen={this.props.isOpen}
              header={this.props.header}
              closePopup={closeHandler}
              scaleDimensions={{width: 350, height: 350}}
              additionalContent={renderUploadDocumentForm}
              additionalContentValidate={() => { this.handleValidation(this.state.fileType, this.state.description); }}
              isAdditionalContentValid={this.state.isValidForm}
              useFile={useFileHandler}
            />
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
    uploadNewDocument: PropTypes.func
};

DocumentUploadWithForm.defaultProps = {
    documentTypes: [],
    uploadNewDocument: () => {},
    closePopup: () => {}
};

export default DocumentUploadWithForm;
