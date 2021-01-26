import { Component } from "react";
import '../../App.css'
import { Link, Redirect } from 'react-router-dom'
import { Button, Label, Form, FormGroup, ListGroupItem, ListGroup } from 'reactstrap'
import axios from 'axios'
import moment from 'moment'
import Moment from 'react-moment'
import EditJobModal from './editJobModal'

class ViewJobs extends Component {

    constructor(props){
        super(props);
        this.refresh = this.refresh.bind(this)
        this.state = {
            email: localStorage.getItem('email'),
            jobs: null,
            now: Date(),
            isEditing: false,
            editingIndex: null,
        }
    }


    componentDidMount (){
        const user = {
            email: this.state.email,
        }
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const {email} = user
        const body = JSON.stringify({email})
        axios.post('/api/viewJobs/getJobs/', body, config)
            .then( res => {
                this.setState({
                    jobs: res.data.jobs,
                    }
                )
            })
            .catch(err => {
                console.log(err.response);
                alert('An error occurred! Try submitting the form again.');
            });
    }
    refresh = () => {
        this.setState({
            isEditing: false
        })
    }
    editJob = (index, e) => {
        console.log(`${JSON.stringify(index)}`)
        this.setState({
            isEditing: !this.state.isEditing,
            editingIndex: index
        })
    }

    deleteJob = async (value, job) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        var jobApplications
        const data = { _id: job._id }
        var body = JSON.stringify(data)
        await axios.post('/api/recruiterApplication/getJobApplications/', body, config)
            .then(
                res => {
                    jobApplications = res.data.applications
                }
            )
        // deleting the job applications corresponding to this job
        var filter = { job_id : job._id }
        body = JSON.stringify(filter)
        await axios.post('/api/recruiterApplication/deleteJobApplications/', body, config)
                .then( res => {
                    console.log('Applications deleted')
                })
        var filter = { _id : job._id }
        body = JSON.stringify(filter)
        await axios.post('/api/recruiterApplication/deleteJob/', body, config)
                .then( res => {
                    console.log('Applications deleted')
                })
        var JobsCopy = [...this.state.jobs]
        const index = JobsCopy.indexOf(job)
        if(index!=-1){
            JobsCopy.splice(index, 1)
        }
        this.setState({
            jobs: JobsCopy
        })
    }

    // onChange = (e) => {
    //     this.setState({ [e.target.name]: e.target.value });
    // }

    // updateData = () => {
    //     var updatedData = {
    //         _id: this.state._id,
    //         name: this.state.name,
    //         email: this.state.email,
    //         bio: this.state.bio,
    //         contact_number: this.state.contact_number
    //     }
    //     const { _id, name, email, bio, contact_number } = updatedData
    //     const config = {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     }
    //     const body = JSON.stringify({ _id ,name, email, bio, contact_number})
    //     console.log(`${body}`)
    //     axios.post('/api/recruiterProfile/update', body, config)
    //         .then( res => {
    //             console.log(`${res.data}`)
    //         })
    //         .catch( err => {
    //             console.log(`${err}`)
    //         })
    // }

    render() {
        return (
            <div className = "box">
                {/* <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
                    <h1 style={{ color:'white'}}>Welcome Recruiter</h1>
                </div> */}
                <div style={{marginTop:"30px"}}>
                    <center>
                        <Form>
                            { this.state.jobs != null ? this.state.jobs.map((job, index) =>
                                // { return moment(job.deadline, 'YYYY-MM-DDTHH:mm:ss.SSSZ').isValid && moment().isBefore(moment(job.deadline, 'YYYY-MM-DDTHH:mm:ss.SSSZ')) ? 
                                {return job.accepted_applicants.length < job.positions_no ?
                                    <div style={{ backgroundColor:'white', marginBottom:'20px', padding:'10px', width:'40%' }} id={index}>
                                        <Form>
                                            <Label>Title: {job.title}</Label><br/>
                                            <Label>Date of Posting: <Moment format="YYYY-MM-DD">{job.date_of_posting}</Moment></Label><br/>
                                            <Label>Number of Applicants: {job.pending_applicants.length}</Label><br/>
                                            <Label>Remaining Positions: {job.positions_no - job.accepted_applicants.length}</Label>
                                        </Form>
                                        <Link to={{pathname:'/recruiterApplication', state: {job: job}}}>
                                            <Button style={{marginRight:'20px'}}>View Applications</Button>
                                        </Link>
                                        <Button onClick={this.editJob.bind(this, index)}>Edit</Button>
                                        { this.state.isEditing && index===this.state.editingIndex ? <EditJobModal job = {job} parentRefresh={this.refresh}/> : null}<br/>
                                        <Button style={{backgroundColor:'red', marginTop:'10px'}} onClick={(e)=> this.deleteJob(e.target.value, job)}>Delete</Button>
                                    </div> : null
                                }
                            ) : null }
                        </Form>
                    </center>
                </div>
            </div>
        )
    }
}

export default ViewJobs