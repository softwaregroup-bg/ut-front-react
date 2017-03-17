import React, { PropTypes, Component } from 'react';

class Documents extends Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <div>Documents components</div>
        );
    }
}

Documents.propTypes = {
    key: PropTypes.string.isRequired
};

Documents.defaultProps = {

};

export default Documents;
