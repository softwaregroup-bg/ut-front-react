import React, { Component, PropTypes } from 'react';
import Documents from '../../components/Documents';

class DocumentsContainer extends Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <div>
                <Documents />
            </div>
        );
    }
}

Documents.propTypes = {
    key: PropTypes.string.isRequired
};

Documents.defaultProps = {

};

export default DocumentsContainer;
