import axios from "axios";
import { Component, useState, useEffect } from "react";
import { Button, ListGroup, ListGroupItem, Label } from "reactstrap";
import '../../App.css'
import moment from 'moment'
import { Link } from 'react-router-dom' 
import AddSopApply from "./addSopApply";

function ApplicantVisit(){
    const [ jobs, setJobs ] = useState(null);
    const [ isApplying, setIsApplying ] = useState(false)
    const [ isApplyingIndex, setIsApplyingIndex ] = useState(null)
    const [ applicantApplications, setApplicantApplications ] = useState(null)
    useEffect(() => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        axios.get('/api/applicantJob/getJobs/')
            .then(
                res => {
                    setJobs(res.data.jobs) 
                }
            )
        const data = { email: localStorage.getItem('email') }
        const body = JSON.stringify(data)
        axios.post('/api/applicantJob/getApplicantApplications/', body, config)
            .then( res => {
                setApplicantApplications(res.data.applications)
            })
    }, []);
    const callEditing = (index, event) =>{
        console.log(`${index}`)
        setIsApplying(true);
        setIsApplyingIndex(index);
    }
    const reloadJobs = async() => {
        await axios.get('/api/applicantJob/getJobs/')
        .then(
            res => {
                setJobs(res.data.jobs) 
            }
        )
        setIsApplyingIndex(null)
        setIsApplying(false)
    }

    const handleCheck = (job) => {
        return applicantApplications.some(item => job._id === item.job_id);
    }
    // if(applicantApplications!=null){
    //     var i;
    //     for(i = 0; i < applicantApplications.length ; i++){
    //         console.log(`${i} ${applicantApplications[i].status}`)
    //         // setAppliedJobIds(appliedJobIds.concat([[applicantApplications[i].job_id, applicantApplications[i].status]]))
    //     }
    // }

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
                            <th>Duration (Months)</th>
                            <th>Deadline</th>
                            <th>Status</th>
                        </tr>
                        { jobs != null ? jobs.map((job, index) =>
                            // { return moment(job.deadline, 'YYYY-MM-DDTHH:mm:ss.SSSZ').isValid && moment().isBefore(moment(job.deadline, 'YYYY-MM-DDTHH:mm:ss.SSSZ')) ? 
                                (<tr style={{ border: '1px solid black'  }} key={index}>
                                    <td>{job.title}</td>
                                    <td>{job.name}</td>
                                    <td>{ job.number_of_ratings!=0 ? job.ratings_sum/job.number_of_ratings : 0}</td>
                                    <td>{job.salary}</td>
                                    <td>{job.duration}</td>
                                    <td>{moment(job.deadline).format("YYYY-MM-DD")}</td>
                                    { handleCheck(job) ? applicantApplications!=null ? applicantApplications.map((item, index) => {
                                        return item.job_id === job._id && item.status === "Applied" ? <td><Button style={{ color: "black", backgroundColor:"white" }} >{item.status}</Button></td> 
                                        : item.job_id === job._id && item.status === "Rejected" ? <td><Button style={{ color: "white", backgroundColor:"red" }} >{item.status}</Button></td> 
                                        : null
                                    }) : null : job.pending_applicants.length >= job.application_no || job.accepted_applicants.length >= job.positions_no ? <td><Button style={{ color: "red", backgroundColor:"white" }} >Full</Button></td>
                                            : <td>
                                            <Button style={{ backgroundColor:'green'}} onClick={callEditing.bind(this, index)} >Apply</Button>
                                            { isApplying && isApplyingIndex===index ? <AddSopApply job={job} reload={reloadJobs} />  : null}
                                        </td>
                                    }
                                </tr>) 
                        ) : null }
                    </tbody>
                </table>
            </div>
        </div>
    )
} 

// class ApplicantVisit extends Component {

//     constructor(props){
//         super(props);
//         this.state = {
//             jobs: null
//         }
//     }

//     componentDidMount (){
//         axios.get('/api/applicantJob/getJobs/')
//             .then(
//                 res => {
//                     this.setState({
//                         jobs: res.data.jobs
//                     })   
//                 }
//             )
//     }

//     render() {
//         return (
//             <div className = "box">
//                 <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
//                     <table style={{ border: '1px solid black', width: '90%' }}>
//                         <tbody>
//                             <tr style={{ border: '1px solid black'  }}>
//                                 <th>Title</th>
//                                 <th>Recruiter Name</th>
//                                 <th>Job Rating</th>
//                                 <th>Salary</th>
//                                 <th>Duration(Months)</th>
//                                 <th>Deadline</th>
//                                 <th>Status</th>
//                             </tr>
//                             { this.state.jobs != null ? this.state.jobs.map((job, index) =>
//                                 // { return moment(job.deadline, 'YYYY-MM-DDTHH:mm:ss.SSSZ').isValid && moment().isBefore(moment(job.deadline, 'YYYY-MM-DDTHH:mm:ss.SSSZ')) ? 
//                                 <tr style={{ border: '1px solid black'  }} key={index}>
//                                     <td>{job.title}</td>
//                                     <td>{job.name}</td>
//                                     <td>{ job.number_of_ratings!=0 ? job.ratings_sum/job.number_of_ratings : 0}</td>
//                                     <td>{job.salary}</td>
//                                     <td>{job.pending_applicants.length}</td>
//                                     <td>{moment(job.deadline).format("YYYY-MM-DD")}</td>
//                                     <td><Link to={{ pathname: '/applyJob',
//                                         state: {
//                                             job: job,
//                                             jobs: this.state.jobs,
//                                             index: index
//                                         } }}>
//                                     <Button style={{ backgroundColor:'green'}}>Apply</Button>
//                                     </Link></td>
//                                 </tr>
//                             ) : null }
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         )
//     }
// }

export default ApplicantVisit