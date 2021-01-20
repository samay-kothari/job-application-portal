import axios from "axios";
import { Component } from "react";
import { Button, Label, ListGroup, ListGroupItem, Form } from "reactstrap";
import '../../App.css'
import moment from 'moment'

class AddSopApply extends Component {

    constructor(props){
        super(props);
        this.state = {
            job: this.props.location.state.job,
            sop: ''
        }
    }


    applyForJob = () => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const jobapplication = {
            job_id: this.state.job._id,
            job_title: this.state.job.title,
            applicant_name: localStorage.getItem('name'),
            applicant_email: localStorage.getItem('email'),
            recruiter_name: this.state.job.name,
            recruiter_email: this.state.job.email,
            sop: this.state.sop,
            status: 'Applied'
        }
        const { job_id ,job_title ,applicant_name ,applicant_email ,recruiter_name ,recruiter_email , date_of_posting, sop, status } = jobapplication
        const body = JSON.stringify({job_id ,job_title ,applicant_name ,applicant_email ,recruiter_name ,recruiter_email , date_of_posting, sop, status})
        axios.post('/api/applicantJob/postApplication/', body, config)
            .then( res=> {
                console.log(`${res.data}`)
            } )
            .catch( err=> {
                console.log(`${err}`)
            })

    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        return (
            <div className = "box">
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
                    <Form>
                        <h3>Applying for {this.state.job.title} at {this.state.job.name}</h3>
                        <br/><br/>
                        <h3>Enter Sop:</h3>
                        <textarea class="form-control" type="textarea" 
                            name="sop" id="sop"
                            onChange={this.onChange
                            }
                            value={this.state.sop}
                            /><br/>
                        <Button style={{backgroundColor: "green"}} onClick={this.applyForJob}>Apply</Button>
                    </Form>
                </div>
            </div>
        )
    }
}

export default AddSopApply