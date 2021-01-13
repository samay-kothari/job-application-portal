import { APPLICANT_DATA_LOADED, APPLICANT_DATA_LOADING, APPLICANT_DATA_POSTING, APPLICANT_DATA_POSTED, APPLICANT_DATA_INITIALISING, APPLICANT_DATA_INITIALISED } from './types';
import axios from 'axios';

export const getApplicantData = ({email}) => dispatch => {
    dispatch({
        type: APPLICANT_DATA_LOADING
    })
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({email})
    axios.post('/api/applicantProfile/getData', body, config)
        .then(res => dispatch({
            type: APPLICANT_DATA_LOADED,
            payload: res.data.applicantProfile
        }))
}

export const addApplicantData = ({name, email}) => dispatch => {
    dispatch({
        type: APPLICANT_DATA_INITIALISING
    })
    const skills = ['']
    const education = [['', '', '']]
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({name, email, skills, education})
    console.log(`${body}`)
    axios.post('/api/applicantProfile/', body, config)
        .then( res => dispatch({
            type: APPLICANT_DATA_INITIALISED,
            payload: res.data.applicantProfile
        })   
        )
        .catch(err => {
            console.log(err.response);
            alert('An error occurred! Try submitting the form again.');
        });
}

export const updateApplicantData = (applicantData) => dispatch => {
    dispatch({
        type: APPLICANT_DATA_POSTING
    })
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify(applicantData)
    console.log(`${body}`)
    axios.post('/api/applicantProfile/update', body, config)
        .then( res => dispatch({
            type: APPLICANT_DATA_POSTED,
            payload: applicantData
        })   
        )
        .catch(err => {
            console.log(err.response);
            alert('An error occurred! Try submitting the form again.');
        });
}
