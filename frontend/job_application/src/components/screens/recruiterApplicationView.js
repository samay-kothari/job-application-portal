import { Component, useState, useEffect } from "react";
import axios from "axios";
import { Button, Label, ListGroup, ListGroupItem } from 'reactstrap'
import moment from 'moment'

function RecruiterApplicationView (props){
    const [ job, setJob ] = useState(props.location.state.job)
    const [ jobApplications, setJobApplications ] = useState(null)
    const [ jobApplicationsDefault, setJobApplicationsDefault ] = useState(null)
    const [ users, setUsers ] = useState(null)
    const [ sortOrder, setSortOrder ] = useState('ascending')
    const [ sortAttribute, setSortAttribute ] = useState('name')

    useEffect( async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const data = { _id: job._id }
        var body = JSON.stringify(data)
        await axios.post('/api/recruiterApplication/getJobApplications/', body, config)
            .then(
                res => {
                    setJobApplications(res.data.applications)
                    setJobApplicationsDefault(res.data.applications)
                }
            )
        const condition = { role: 'Applicant' }
        body = JSON.stringify(condition)
        await axios.get('/api/recruiterApplication/getUsers/')
                .then(
                    res => {
                        setUsers(res.data.profiles)
                    }
                )
    }, []);
    
    const sortArray = (type, order) => {
        const types = {
          name: 'applicant_name',
          date_of_posting: 'date_of_posting',
          rating: 'rating_sum',
        };
        const sortProperty = types[type];
        var sorted;
        console.log(`${sortProperty}`)
        if(sortProperty === 'rating_sum'){
            sorted = [...jobApplications].sort((a, b) => {
                const b_user = [...users].find((user) => user.email == b.applicant_email)
                const a_user = [...users].find((user) => user.email == a.applicant_email)
                return b_user.rating/b_user.total_rating - a_user.rating/a_user.total_rating
            });
        }else{
            sorted = [...jobApplications].sort((a, b) => {
                return b[sortProperty]-a[sortProperty]});
        }
        setSortAttribute(sortProperty)
        if(order === 'descending'){
            setJobApplications(sorted);
        }else{
            setJobApplications(sorted.concat().reverse());
        }
    };

    const changeSortOrder = (order) => {
        setSortOrder(order)
        sortArray(sortAttribute, order)
    }
    
    const shortListJob = (application) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const update = { status: 'Shortlisted' }
        const together = { _id: application._id, update: update }
        const body = JSON.stringify({ together })
        console.log(`${body}`)
        axios.post('/api/recruiterApplication/updateApplicationStatus', body, config)
            .then(
                res => {
                    console.log(res.data.data)
                }
            )
        var updatedApplicaitons = [...jobApplications]
        const index = updatedApplicaitons.indexOf(application)
        if(index != -1){
            updatedApplicaitons[index].status='Shortlisted'
            setJobApplications(updatedApplicaitons)
            setJobApplicationsDefault(updatedApplicaitons)
        }
    }

    const rejectJob = async (application, jobData) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        var update = { status: 'Rejected' }
        var together = { _id: application._id, update: update }
        var body = JSON.stringify({ together })
        console.log(`${body}`)
        await axios.post('/api/recruiterApplication/updateApplicationStatus', body, config)
            .then(
                res => {
                    console.log(res.data.data)
                }
            )
        const dataToBeDeleted = jobData.pending_applicants.find(data => data[1] === application.applicant_email)
        var newData = [...jobData.pending_applicants]
        var index = jobData.pending_applicants.indexOf(dataToBeDeleted)
        if(index != -1){
            newData.splice(index, 1)
        }
        update = { pending_applicants: newData }
        together = { _id: jobData._id, update: update }
        body = JSON.stringify( { together } )
        await axios.post('/api/recruiterApplication/removePendingApplicant', body , config)
            .then(
                res => {
                    console.log(res.data.data)
                }
            )
        if(jobData === job)
        {   
            var updatedApplicaitons = [...jobApplications]
            index = updatedApplicaitons.indexOf(application)
            if(index != -1){
                updatedApplicaitons[index].status='Rejected'
                setJobApplications(updatedApplicaitons)
                setJobApplicationsDefault(updatedApplicaitons)
            }
        }
    }

    const acceptApplicant = async (application) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        var update
        var together
        // var update = { status: 'Rejected' }
        // var together = { applicant_email: application.applicant_email, update: update }
        // var body = JSON.stringify({together})

        // // Rejecting all pending applications of accepted applicants
        // await axios.post('/api/recruiterApplication/rejectApplicationsofApplicant', body, config)
        //     .then(
        //         res => {
        //             console.log(res.data.data)
        //         }
        //     )
        const data = { email: application.applicant_email }
        var body = JSON.stringify(data)
        var applicant_applications
        await axios.post('/api/applicantJob/getApplicantApplications/', body, config)
            .then( res => {
                applicant_applications = res.data.applications
            })
        var i
        for(i = 0; i < applicant_applications.length; i++){
            if(applicant_applications[i]!=application){
                var jobData
                update = { _id: applicant_applications[i].job_id }
                body = JSON.stringify({update})
                await axios.post('/api/recruiterApplication/getApplicantJob', body, config)
                    .then(res => {
                        jobData = res.data.jobdata
                    })
                await rejectJob(applicant_applications[i], jobData)
            }
        }
        // Handling the data present in Job model
        const dataToBeDeleted = job.pending_applicants.find(data => data[1] === application.applicant_email)
        var pending_applicants = [...job.pending_applicants]
        var index = job.pending_applicants.indexOf(dataToBeDeleted)
        if(index != -1){
            pending_applicants.splice(index, 1)
        }
        var accepted_applicants = [...job.accepted_applicants]
        accepted_applicants = accepted_applicants.concat([dataToBeDeleted])
        if(accepted_applicants.length >= job.positions_no){
            // Rejecting all pending applications if the positions are full
            var i
            for(i = 0; i < jobApplications.length; i++){
                if((jobApplications[i].status === "Applied" || jobApplications[i].status === "Shortlisted") && jobApplications[i]!=application){
                    // update = { status: 'Rejected' }
                    // together = { _id: jobApplications[i]._id, update: update }
                    // body = JSON.stringify({ together })
                    // console.log(`${body}`)
                    // await axios.post('/api/recruiterApplication/updateApplicationStatus', body, config)
                    //     .then(
                    //         res => {
                    //             console.log(res.data.data)
                    //         }
                    //     )
                    rejectJob(jobApplications[i], job)
                }
            }
        }

        // Updating the job data
        update = { accepted_applicants: accepted_applicants, pending_applicants: pending_applicants }
        together = { _id: job._id, update: update }
        body = JSON.stringify({together})
        await axios.post('api/applicantJob/updateJobData/', body, config)
            .then( res => {
                console.log(`${res.data.updatedJob}`)
            } )
            .catch(
                err => {
                    console.log(`${err}`)
                }
            )

        update = { status: 'Accepted' }
        together = { _id: application._id, update: update }
        body = JSON.stringify({together})

        // Accepting the given applicant
        await axios.post('/api/recruiterApplication/updateApplicationStatus/', body, config)
            .then(
                res => {
                    console.log(res.data.data)
                }
            )
        var updatedApplicaitons = [...jobApplications]
        index = updatedApplicaitons.indexOf(application)
        if(index != -1){
            updatedApplicaitons[index].status='Accepted'
            setJobApplications(updatedApplicaitons)
            setJobApplicationsDefault(updatedApplicaitons)
        }
    }

    return (
        <div class="box">
            <center>
                <div style={{marginTop:'30px'}}>
                    <Label style={{marginInline:'6px'}}>Sort Options:</Label>
                    <select onChange={(e) => sortArray(e.target.value, sortOrder)} style={{marginInline:'6px'}}>
                        <option value="name" >Name</option>
                        <option value="date_of_posting">Date of Application</option>
                        <option value="rating">Rating</option>
                    </select>
                    <select onChange={(e) => changeSortOrder(e.target.value)} style={{marginInline:'6px'}}>
                        <option value="ascending">Ascending</option>
                        <option value="descending">Descending</option>
                    </select>
                </div>
                <div style={{marginTop:'30px', width:'70%'}}>
                {
                    jobApplications!=null && users!=null
                        ?   jobApplications.map((application, index) => {
                            return users.map((applicant_data, applicant_index) => {
                                return application.applicant_email === applicant_data.email && application.status != "Rejected"
                                    ? <div style={{backgroundColor:'white', marginBottom:'30px', padding: '20px'}} key={index}>
                                        <Label>Name: {applicant_data.name}</Label><br/>
                                        <Label>Skills: </Label>
                                            { applicant_data.skills.map((data, index) => {
                                                return <Label style={{marginInline:'5px', backgroundColor:'lightblue', padding:'6px'}}>{data!='' ? data : 'NotAvailable'}</Label>
                                            }) }
                                            <br/>
                                        <Label>Date of Application: </Label>    
                                        <Label style={{marginInline:'5px'}}>{moment(application.date_of_posting).format("YYYY-MM-DD")}</Label>
                                        <table>
                                            <tr><th>Institution</th><th>Start Year</th><th>End Year</th></tr>
                                            { applicant_data.education.map((edu, index) => {
                                                return <tr>
                                                    <td>
                                                        {edu[0]!='' ? edu[0] : 'Not Available'}
                                                    </td>
                                                    <td>
                                                        {edu[1]!='' ? edu[1] : 'Not Available'}
                                                    </td>
                                                    <td>
                                                        {edu[2]!='' ? edu[2] : 'Not Available'}
                                                    </td>
                                                </tr>
                                            }) }
                                        </table><br/>
                                        <Label style={{marginInline:'5px'}}>SOP: </Label>
                                        <Label>{application.sop}</Label><br/>
                                        <Label style={{marginInline:'5px'}}>Rating: </Label>
                                        <Label>{ applicant_data.total_rating === 0 ? applicant_data.rating / applicant_data.total_rating : 0 }</Label><br/>
                                        <Label style={{marginInline:'5px'}}>Application Status: </Label>
                                        <Label>{application.status}</Label><br/>
                                        { application.status === 'Applied' 
                                            ? <div>
                                                <Button style={{color: 'lightgreen', backgroundColor:'white', marginInline:'3px'}} onClick={() => shortListJob(application)}>Shortlist</Button>
                                                <Button style={{color: 'white', backgroundColor:'lightgreen', marginInline:'3px'}} onClick={() => acceptApplicant(application)}>Accept</Button>
                                                <Button style={{color: 'white', backgroundColor:'red', marginInline:'3px'}} onClick={() => rejectJob(application, job)}>Reject</Button>
                                            </div> 
                                            : null }
                                        { application.status === 'Shortlisted' 
                                            ? <div>
                                                <Button style={{color: 'white', backgroundColor:'lightgreen', marginInline:'3px'}} onClick={() => acceptApplicant(application)}>Accept</Button>
                                                <Button style={{color: 'white', backgroundColor:'red', marginInline:'3px'}} onClick={() => rejectJob(application, job)}>Reject</Button>
                                            </div> 
                                            : null }
                                    </div>
                                    : null
                            })
                        })
                        : null
                    }
                </div>
            </center>
        </div>
    )
}

export default RecruiterApplicationView