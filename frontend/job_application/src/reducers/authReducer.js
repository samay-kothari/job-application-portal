import { USER_LOADED, USER_LOADING, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, REGISTER_SUCCESS, REGISTER_FAIL } from '../actions/types'

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    isLoading: false,
    user: null,
    role: localStorage.getItem('role'),
    email: localStorage.getItem('email')
};

export default function(state = initialState, action){
    switch(action.type){
        case USER_LOADING:
            return {
                ...state,
                isLoading: true,
            }
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload,
                role: action.payload.user!=null ? action.payload.user.role : null,
                email: action.payload.user!=null ? action.payload.user.email : null 
            }
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('role', action.payload.user.role);
            localStorage.setItem('email', action.payload.user.email)
            localStorage.setItem('name', action.payload.user.name);
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                isLoading: false,
                role: action.payload.user.role,
                email: action.payload.user.email
            }
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT_SUCCESS:
        case REGISTER_FAIL:
            localStorage.removeItem('token');
            localStorage.removeItem('role')
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                role: null,
                email: null
            }
        default:
            return state;
    }
}