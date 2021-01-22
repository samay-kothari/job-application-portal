import axios from "axios";
import { Component, useState } from "react";
import { Button, Label, ListGroup, ListGroupItem, Form } from "reactstrap";
import '../../App.css'
import { Link, Redirect } from 'react-router-dom'
import moment from 'moment'

function AddSopApply(props){
    const [job, setJob] = useState(props.job);
    const [Sop, setSop] = useState('');
    const [application_ID, setApplication_id] = useState(null);
    const [redirect, setRedirect] = useState(null);

    const applyForJob = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        console.log(`${job.title}`)
        const jobapplication = {
            job_id: job._id,
            job_title: job.title,
            applicant_name: localStorage.getItem('name'),
            applicant_email: localStorage.getItem('email'),
            recruiter_name: job.name,
            recruiter_email: job.email,
            sop: Sop,
            status: 'Applied'
        }
        const { job_id ,job_title ,applicant_name ,applicant_email ,recruiter_name ,recruiter_email , date_of_posting, sop, status } = jobapplication
        var body = JSON.stringify({job_id ,job_title ,applicant_name ,applicant_email ,recruiter_name ,recruiter_email , date_of_posting, sop, status})
        await axios.post('/api/applicantJob/postApplication/', body, config)
            .then( res=> {
                setApplication_id(res.data.applicationData._id)
                console.log(`${application_ID}`)
            } )
            .catch( err=> {
                console.log(`${err}`)
            })
        var job_applicants = job.pending_applicants;
        job_applicants = job_applicants.concat([[ application_ID ,localStorage.getItem('email'), localStorage.getItem('name')]])
        const update = { pending_applicants: job_applicants }
        const together = { _id: job._id, update: update }
        body =  JSON.stringify({together})
        await axios.post('api/applicantJob/updateJobData/', body, config)
            .then( res => {
                console.log(`${res.data.updatedJob}`)
            } )
            .catch(
                err => {
                    console.log(`${err}`)
                }
            )
        await props.reload()
    }

    const handleSopChange = (e) => {
        setSop(e.target.value);
    }

    if(redirect){
        return <Redirect to={redirect} />
    }
    console.log('lollmaolol')
    return (
            <div className = "box">
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
                    <Form>
                        <h3>Applying for {job.title} at {job.name}</h3>
                        <br/><br/>
                        <h3>Enter Sop:</h3>
                        <textarea class="form-control" type="textarea" 
                            onChange={handleSopChange}
                            /><br/>
                        <center>
                            <Button style={{backgroundColor: "green", marginRight:'100px'}} onClick={applyForJob}>Apply</Button>
                            <Button style={{backgroundColor: "red"}} onClick={props.reload}>Cancel</Button>
                        </center>
                    </Form>
                </div>
            </div>
        )
}

// class AddSopApply extends Component {

//     constructor(props){
//         super(props);
//         this.state = {
//             job: this.props.location.state.job,
//             sop: '',
//             jobApplicationID: null,
//             redirect: null
//         }
//     }

//     applyForJob = async () => {
//         const config = {
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         }
//         const jobapplication = {
//             job_id: this.state.job._id,
//             job_title: this.state.job.title,
//             applicant_name: localStorage.getItem('name'),
//             applicant_email: localStorage.getItem('email'),
//             recruiter_name: this.state.job.name,
//             recruiter_email: this.state.job.email,
//             sop: this.state.sop,
//             status: 'Applied'
//         }
//         const { job_id ,job_title ,applicant_name ,applicant_email ,recruiter_name ,recruiter_email , date_of_posting, sop, status } = jobapplication
//         var body = JSON.stringify({job_id ,job_title ,applicant_name ,applicant_email ,recruiter_name ,recruiter_email , date_of_posting, sop, status})
//         await axios.post('/api/applicantJob/postApplication/', body, config)
//             .then( res=> {
//                 this.setState({
//                     jobApplicationID: res.data.applicationData._id
//                 })
//             } )
//             .catch( err=> {
//                 console.log(`${err}`)
//             })
//         var job_applicants = this.state.job.pending_applicants;
//         job_applicants = job_applicants.concat([[ this.state.jobApplicationID ,localStorage.getItem('email'), localStorage.getItem('name')]])
//         const update = { pending_applicants: job_applicants }
//         const together = { _id: this.state.job._id, update: update }
//         body =  JSON.stringify({together})
//         await axios.post('api/applicantJob/updateJobData/', body, config)
//             .then( res => {
//                 console.log(`${res.data.updatedJob}`)
//             } )
//             .catch(
//                 err => {
//                     console.log(`${err}`)
//                 }
//             )
//         this.setState({
//             redirect: '/'
//         })
//     }

//     onChange = (e) => {
//         this.setState({ [e.target.name]: e.target.value });
//     }

//     render() {
//         if (this.state.redirect) {
//             return <Redirect to={this.state.redirect} />
//         }
//         return (
//             <div className = "box">
//                 <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
//                     <Form>
//                         <h3>Applying for {this.state.job.title} at {this.state.job.name}</h3>
//                         <br/><br/>
//                         <h3>Enter Sop:</h3>
//                         <textarea class="form-control" type="textarea" 
//                             name="sop" id="sop"
//                             onChange={this.onChange
//                             }
//                             value={this.state.sop}
//                             /><br/>
//                         <Button style={{backgroundColor: "green"}} onClick={this.applyForJob}>Apply</Button>
//                     </Form>
//                 </div>
//             </div>
//         )
//     }
// }

export default AddSopApply