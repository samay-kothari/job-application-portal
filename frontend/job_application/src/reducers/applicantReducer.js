import { APPLICANT_DATA_LOADED, APPLICANT_DATA_LOADING, APPLICANT_DATA_POSTING, APPLICANT_DATA_POSTED, APPLICANT_DATA_INITIALISING, APPLICANT_DATA_INITIALISED } from '../actions/types'

const initialState = {
    email : localStorage.getItem('email'),
    isLoading: false,
    applicantData: null
}

export default function(state = initialState, action){
    switch(action.type){
        case APPLICANT_DATA_LOADING: {
            return{
                ...state,
                isLoading: true
            }
        }
        case APPLICANT_DATA_LOADED: {
            return{
                ...state,
                isLoading: false,
                applicantData: action.payload
            }
        }
        case APPLICANT_DATA_POSTING: {
            return{
                ...state,
                isLoading: true
            }
        }
        case APPLICANT_DATA_POSTED: {
            return{
                ...state,
                isLoading: false,
                applicantData: action.payload
            }
        }
        case APPLICANT_DATA_INITIALISING: {
            return{
                ...state,
                isLoading: true
            }
        }
        case APPLICANT_DATA_INITIALISED: {
            return{
                ...state,
                applicantData: action.payload,
                isLoading: false
            }
        }
        default: {
            return state
        }
    }
}