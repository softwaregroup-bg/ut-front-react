import { login } from './containers/LoginForm/reducer';
// import {login, loginData} from './pages/Login/reducer';
// import gate from './pages/Gate/reducer';
import gate from './containers/Gate/reducer';
import master from './pages/Master/reducer';
import { reducer as form } from 'redux-form/immutable';
import frontDocuments from './containers/Documents/reducer';

export default {login, /* loginData, */ gate, form, ...master, frontDocuments};
