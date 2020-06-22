import { login } from '../containers/LoginForm/reducer';
// import {login, loginData} from './pages/Login/reducer';
// import gate from './pages/Gate/reducer';
import gate from '../containers/Gate/reducer';
import master from '../pages/Master/reducer';
import frontDocuments from '../containers/Documents/reducer';
import tabReducers from '../containers/TabMenu/reducers';

export default {login, /* loginData, */ gate, ...master, ...tabReducers, frontDocuments};
