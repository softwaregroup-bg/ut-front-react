export const filterElementTypes = {
    dropDown: 'dropDown',
    searchBox: 'searchBox',
    datePicker: 'datePicker',
    datePickerBetween: 'datePickerBetween',
    dateTimePickerBetween: 'dateTimePickerBetween',
    clear: 'clear'
};

// Important: when adding new type -> add it respectively to GridToolbox PropTypes
export const actionButtonElementTypes = {
    link: 'link',
    button: 'button',
    buttonWithConfirmPopUp: 'buttonWithConfirmPopUp',
    // E.g. Lock/Unlock: If two rows are checked and they are with different status error message should notify user
    // Only checked rows with same status can submit this action
    buttonWithPopUpsDependingOnProperty: 'buttonWithPopUpsDependingOnProperty',
    buttonWithPopUpsDependingOnPropertyValue: 'buttonWithPopUpsDependingOnPropertyValue',
    buttonWithMultipleDialogs: 'buttonWIthMultimpleDialogs'
};

// Determines if the button can be clicked when multiple items are checked
export const actionButtonClickFunctionality = {
    singleSelect: 'singleSelect',
    multiSelect: 'multiSelect'
};
