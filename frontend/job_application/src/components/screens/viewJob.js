import { Component } from "react";
import '../../App.css'
import { Link } from 'react-router-dom'
import { Button, Label, Form, FormGroup, ListGroupItem, ListGroup } from 'reactstrap'
import axios from 'axios'
import moment from 'moment'
import Moment from 'react-moment'
import EditJobModal from './editJobModal'

class ViewJobs extends Component {

    constructor(props){
        super(props);
        this.state = {
            email: localStorage.getItem('email'),
            jobs: null,
            now: Date(),
            isEditing: false,
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
                })
            })
            .catch(err => {
                console.log(err.response);
                alert('An error occurred! Try submitting the form again.');
            });

    }

    editJob = () => {
        this.setState({
            isEditing: !this.state.isEditing
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
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
                    <ListGroup>
                        { this.state.jobs != null ? this.state.jobs.map((job, index) =>
                            { return moment(job.deadline, 'YYYY-MM-DDTHH:mm:ss.SSSZ').isValid && moment().isBefore(moment(job.deadline, 'YYYY-MM-DDTHH:mm:ss.SSSZ')) ? 
                                <ListGroupItem>
                                    <Form>
                                        <Label>Title: {job.title}</Label><br/>
                                        <Label>Date of Posting: <Moment format="YYYY-MM-DD">{job.date_of_posting}</Moment></Label><br/>
                                        <Label>Number of Applicants: {job.pending_applicants.length}</Label><br/>
                                        <Label>Remaining Positions: {job.positions_no - job.accepted_applicants.length}</Label>
                                    </Form>
                                    <center><Button onClick={this.editJob}>Edit</Button></center>
                                    { this.state.isEditing ? <EditJobModal job = {job}/> : null}
                                </ListGroupItem>
                                : null }
                        ) : null }
                    </ListGroup>
                </div>
            </div>
        )
    }
}

export default ViewJobs