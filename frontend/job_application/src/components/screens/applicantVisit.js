import axios from "axios";
import { Component } from "react";
import { Button, ListGroup, ListGroupItem } from "reactstrap";
import '../../App.css'
import moment from 'moment'
import { Link } from 'react-router-dom' 

class ApplicantVisit extends Component {

    constructor(props){
        super(props);
        this.state = {
            jobs: null
        }
    }

    componentDidMount (){
        axios.get('/api/applicantJob/getJobs/')
            .then(
                res => {
                    this.setState({
                        jobs: res.data.jobs
                    })   
                }
            )
    }

    render() {
        return (
            <div className = "box">
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
                    <table style={{ border: '1px solid black', width: '90%' }}>
                        <tbody>
                            <tr style={{ border: '1px solid black'  }}>
                                <th>Title</th>
                                <th>Recruiter Name</th>
                                <th>Job Rating</th>
                                <th>Salary</th>
                                <th>Duration(Months)</th>
                                <th>Deadline</th>
                                <th>Status</th>
                            </tr>
                            { this.state.jobs != null ? this.state.jobs.map((job, index) =>
                                // { return moment(job.deadline, 'YYYY-MM-DDTHH:mm:ss.SSSZ').isValid && moment().isBefore(moment(job.deadline, 'YYYY-MM-DDTHH:mm:ss.SSSZ')) ? 
                                <tr style={{ border: '1px solid black'  }} key={index}>
                                    <td>{job.title}</td>
                                    <td>{job.name}</td>
                                    <td>{ job.number_of_ratings!=0 ? job.ratings_sum/job.number_of_ratings : 0}</td>
                                    <td>{job.salary}</td>
                                    <td>{job.pending_applicants.length}</td>
                                    <td>{moment(job.deadline).format("YYYY-MM-DD")}</td>
                                    <td><Link to={{ pathname: '/applyJob',
                                        state: {
                                            job: job,
                                            jobs: this.state.jobs,
                                            index: index
                                        } }}>
                                    <Button style={{ backgroundColor:'green'}}>Apply</Button>
                                    </Link></td>
                                </tr>
                            ) : null }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default ApplicantVisit