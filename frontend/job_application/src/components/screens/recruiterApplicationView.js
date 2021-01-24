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
    
    const shortListJob = (aopplication) => {
        
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
                                    ? <div style={{backgroundColor:'white', marginBottom:'30px', padding: '20px'}}>
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
                                                <Button style={{color: 'lightgreen', backgroundColor:'white', marginInline:'3px'}}>Shortlist</Button>
                                                <Button style={{color: 'white', backgroundColor:'lightgreen', marginInline:'3px'}}>Accept</Button>
                                                <Button style={{color: 'white', backgroundColor:'red', marginInline:'3px'}}>Reject</Button>
                                            </div> 
                                            : null }
                                        { application.status === 'Shortlisted' 
                                            ? <div>
                                                <Button style={{color: 'white', backgroundColor:'lightgreen', marginInline:'3px'}}>Accept</Button>
                                                <Button style={{color: 'white', backgroundColor:'red', marginInline:'3px'}}>Reject</Button>
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