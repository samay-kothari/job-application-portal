import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import applicantReducer from './applicantReducer';


export default combineReducers({
    auth: authReducer,
    error: errorReducer,
    applicantDataReducer: applicantReducer
});