import { Component, useState, useEffect } from "react";
import axios from "axios";
import { Button, Label, ListGroup, ListGroupItem } from 'reactstrap'
import moment from 'moment'

function RecruiterEmployees (props){
    const [jobs, setJobs] = useState(null)
    const [applications, setApplications] = useState(null)
    const [ sortOrder, setSortOrder ] = useState('ascending')
    const [ sortAttribute, setSortAttribute ] = useState('applicant_name')


    useEffect( async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        var data = { recruiter_email: localStorage.getItem('email') }
        var body = JSON.stringify(data)
        await axios.post('/api/recruiterApplication/getRecruiterApplications/', body, config)
            .then(
                res => {
                    setApplications(res.data.data)
                }
            )
        data = { email: localStorage.getItem('email') }
        body = JSON.stringify(data)
        await axios.post('/api/viewJobs/getJobs/', body, config)
            .then( res => {
                setJobs(res.data.jobs)
            })
    }, []);

    const sortArray = (type, order) => {
        const types = {
          applicant_name: 'applicant_name',
          date_of_posting: 'date_of_posting',
          job_title: 'job_title',
          applicant_rating: 'applicant_rating'
        };
        const sortProperty = types[type];
        var sorted;
        sorted = [...applications].sort((a, b) => {
            return b[sortProperty]-a[sortProperty]});

        setSortAttribute(sortProperty)
        if(order === 'descending'){
            setApplications(sorted);
        }else{
            setApplications(sorted.concat().reverse());
        }
    };

    const changeSortOrder = (order) => {
        setSortOrder(order)
        sortArray(sortAttribute, order)
    }

    const handleRating = async (newvalue, application) => {
        newvalue = parseInt(newvalue, 10)
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        var body
        var update
        // only updating if the user changes the rating to something other than 0, 0 is being taken as default
        if(newvalue!=0){
            var userData
            body = JSON.stringify({ email: application.applicant_email })
            await axios.post('/api/applicantProfile/getData/', body, config)
                .then(res => {
                    userData=res.data.applicantProfile
                })

            var total_ratings
            var rating
            var together
            if(application.applicant_rating === 0){
                total_ratings = userData.total_ratings + 1
            }
            rating = userData.rating - application.applicant_rating + newvalue
            update = { rating: rating, total_ratings: total_ratings }
            together = { _id: userData._id, update: update }
            body = JSON.stringify(together)
            console.log(body)
            await axios.post('/api/applicantProfile/ratingsUpdate/', body, config)
                .then(
                    res => {
                        console.log(res.data)
                    }
                )

            update = { applicant_rating: newvalue }
            together = { _id: application._id, update: update }
            body = JSON.stringify({ together })
            await axios.post('/api/recruiterApplication/updateApplicationStatus/', body, config)
                .then(
                    res => {
                        console.log(res.data)
                    }
                )
        }
        const index = applications.indexOf(application)
        var applications_temp = [...applications]
        applications_temp[index].applicant_rating = newvalue
        setApplications(applications_temp)
    }

    return <div className='box'>
        <center>
            <div style={{marginTop:'30px'}}>
                <Label style={{marginInline:'6px'}}>Sort Options:</Label>
                <select onChange={(e) => sortArray(e.target.value, sortOrder)} style={{marginInline:'6px'}}>
                    <option value="applicant_name">Applicant Name</option>
                    <option value="job_title">Job Title</option>
                    <option value="date_of_posting">Date of Joining</option>
                    <option value="applicant_rating">Applicant Rating</option>
                </select>
                <select onChange={(e) => changeSortOrder(e.target.value)} style={{marginInline:'6px'}}>
                    <option value="ascending">Ascending</option>
                    <option value="descending">Descending</option>
                </select>
            </div>
            <div style={{marginTop:'30px', width: '50%'}}>
                {
                    jobs!=null && applications!=null
                    ? applications.map((application , application_index) => {
                        return jobs.map((job, index) => {
                            return job._id === application.job_id && application.status === "Accepted"
                            ? <div key={application_index} style={{backgroundColor:'white', marginBottom:'30px', padding: '20px'}}>
                                <Label style={{marginInline:'3px'}}>Name: </Label>
                                <Label>{application.applicant_name}</Label><br/>
                                <Label style={{marginInline:'3px'}}>Date of Joining: </Label>
                                <Label>{moment(application.date_of_posting).format("YYYY-MM-DD")}</Label><br/>
                                <Label style={{marginInline:'3px'}}>Type: </Label>
                                <Label>{job.type}</Label><br/>
                                <Label style={{marginInline:'3px'}}>Title: </Label>
                                <Label>{job.title}</Label><br/>
                                <Label>Rating:</Label>
                                <select value={application.applicant_rating} onChange={(e) => handleRating(e.target.value, application)}>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </div>
                            : null
                        })
                    })
                    : null
                }
            </div>
        </center>
    </div>
}

export default RecruiterEmployees