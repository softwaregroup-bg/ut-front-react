import { inputs as possibleFormInputs } from '../config';

export const paths = Object.keys(possibleFormInputs).reduce((prev, curr) => {
    prev.push(['loginForm', 'inputs', curr, 'value']);
    return prev;
}, []);