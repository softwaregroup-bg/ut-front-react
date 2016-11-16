import React, { Component } from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

const styles = {
    customWidth: {
        width: 200
    },
    customHeight: {
        Height: 200
    }
};

export default class SelectableSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {value: 1};
        this.handleChange = (event, index, value) => this.setState({value});
    }

    render() {
        return (
            <div style={{height: '37px', border: '1px solid black'}}>
                <DropDownMenu value={this.state.value} onChange={this.handleChange} style={styles.customWidth} autoWidth={false}>
                    <MenuItem value={1} primaryText='Never' />
                    <MenuItem value={2} primaryText='Every Night' />
                    <MenuItem value={3} primaryText='Weeknights' />
                    <MenuItem value={4} primaryText='Weekends' />
                    <MenuItem value={5} primaryText='Weekly' />
                </DropDownMenu>
                <input />
                <button style={{width: '37px', height: '37px'}} />
            </div>
        );
    }
}
