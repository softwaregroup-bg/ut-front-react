import {login, loginData} from './containers/LoginForm/reducer';
// import {login, loginData} from './pages/Login/reducer';
import gate from './pages/Gate/reducer';
import master from './pages/Master/reducer';
import { reducer as form } from 'redux-form/immutable';

export default {login, loginData, gate, form, ...master};
