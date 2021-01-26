import { Component, useState, useEffect } from "react";
import axios from "axios";
import moment from 'moment'

function MyApplication (props){
    const [ myApplications, setMyApplications ] = useState(props.location.state.applications)
    const [ allJobs, setAllJobs ] = useState(props.location.state.jobs)

    useEffect(() => {
        
    }, []);

    const handleRating = async(newvalue, application) => {
        newvalue = parseInt(newvalue, 10)
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        var body
        var update
        if(newvalue!=0){
            var jobData
            update = { _id: application.job_id }
            body = JSON.stringify({update})
            await axios.post('/api/recruiterApplication/getApplicantJob', body, config)
                .then(res => {
                    jobData = res.data.jobdata
                })
            
            var number_of_ratings
            var rating_sum 
            var together
            if(application.recuiter_rating === 0){
                number_of_ratings = jobData.number_of_ratings + 1 
            }
            rating_sum = jobData.rating_sum - application.recuiter_rating + newvalue
            update = { number_of_ratings: number_of_ratings, rating_sum: rating_sum }
            const togeather = { _id: jobData._id, update: update }
            body = JSON.stringify({ togeather })
            await axios.post('/api/viewJobs/editJob/', body, config)
                .then( res => {
                    console.log("successfully updated")
                })
                .catch(err => {
                    console.log(err.response);
                    alert('An error occurred! Try submitting the form again.');
                });
            update = { recuiter_rating: newvalue }
            together = { _id: application._id, update: update }
            body = JSON.stringify({ together })
            await axios.post('/api/recruiterApplication/updateApplicationStatus/', body, config)
                .then(
                    res => {
                        console.log(res.data)
                    }
                )
        }
        const index = myApplications.indexOf(application)
        var myApplicationNew = [...myApplications]
        myApplicationNew[index].recuiter_rating = newvalue
        setMyApplications(myApplicationNew)
    }
    
    return (
        <div class="box">
            <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
                <center>
                    <table>
                        <tr>
                            <th>Title</th>
                            <th>Date of Joining</th>
                            <th>Salary per Month</th>
                            <th>Name of Recruiter</th>
                            <th>Status</th>
                            <th>Rate</th>
                        </tr>
                        { myApplications!=null 
                            ?  myApplications.map((application, index) => {
                                return allJobs!= null
                                    ? allJobs.map((job, jobIndex) => {
                                        return application.job_id === job._id 
                                        ?  <tr>
                                            <td>{application.job_title}</td>
                                            <td>{application.status === "Accepted" ? moment(application.date_of_posting).format("YYYY-MM-DD") : 'Not Available'}</td>
                                            <td>{job.salary}</td>
                                            <td>{application.recruiter_name}</td>
                                            <td>{application.status}</td>
                                            <td>
                                                { application.status === "Accepted" 
                                                ? <select value={application.recuiter_rating} onChange={(e) => handleRating(e.target.value, application)}>
                                                    <option value="0">0</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                                </select>
                                                : null}
                                            </td>
                                        </tr>
                                        : null
                                    })
                                    : null
                            })
                            : null }
                    </table>
                </center>
            </div>
        </div>
    )
}

export default MyApplication