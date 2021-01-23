import axios from "axios";
import { Component, useState, useEffect } from "react";
import { Button, ListGroup, ListGroupItem, Label, Form, FormGroup } from "reactstrap";
import '../../App.css'
import moment from 'moment'
import { Link } from 'react-router-dom' 
import AddSopApply from "./addSopApply";

function ApplicantVisit(){
    const [ jobs, setJobs ] = useState(null);
    const [ jobsForSearch, setJobsForSearch ] = useState(null);
    const [ isApplying, setIsApplying ] = useState(false)
    const [ isApplyingIndex, setIsApplyingIndex ] = useState(null)
    const [ applicantApplications, setApplicantApplications ] = useState([])
    const [ applicationLimit, setApplicationLimit ] = useState(false)
    const [ searchInput, setSearchInput ] = useState('')
    const [ sortOrder, setSortOrder ] = useState('ascending')
    const [ sortAttribute, setSortAttribute ] = useState('salary')

    const [ filterSalaryStart, setFilterSalaryStart ] = useState(0)
    const [ filterSalaryEnd, setFilterSalaryEnd ] = useState(Infinity)

    const [ typeFilter, setFilterType ] = useState('none')

    const [ durationFilter, setDurationFilter ] = useState(7)

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
                    setJobsForSearch(res.data.jobs)
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
        var i;
        var activeApplication = 0;
        for( i = 0; i<applicantApplications.length ; i++ ){
            if(applicantApplications[i].status==="Applied"){
                activeApplication += 1;
            }
        }
        if(activeApplication >= 10){
            setApplicationLimit(true)
        } else{
            setIsApplying(true);
            setIsApplyingIndex(index);
        }
    }
    const reloadJobs = async() => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        await axios.get('/api/applicantJob/getJobs/')
        .then(
            res => {
                setJobs(res.data.jobs)
                setJobsForSearch(res.data.jobs) 
            }
        )
        const data = { email: localStorage.getItem('email') }
        const body = JSON.stringify(data)
        await axios.post('/api/applicantJob/getApplicantApplications/', body, config)
            .then( res => {
                setApplicantApplications(res.data.applications)
            })
        setIsApplyingIndex(null)
        setIsApplying(false)
    }
    const updateInput = (input) => {
        const filtered = jobs.filter(job => {
            return job.title.toLowerCase().includes(input.toLowerCase())
        })
        setSearchInput(input);
        setJobsForSearch(filtered);
    }
    const handleCheck = (job) => {
        return applicantApplications.some(item => job._id === item.job_id);
    }

    const sortArray = (type, order) => {
        const types = {
          salary: 'salary',
          duration: 'duration',
          rating: 'rating_sum',
        };
        const sortProperty = types[type];
        var sorted;
        if(sortProperty === 'rating_sum'){
            sorted = [...jobsForSearch].sort((a, b) => b[sortProperty]/b['number_of_ratings'] - a[sortProperty]/a['number_of_ratings']);
        }else{
            sorted = [...jobsForSearch].sort((a, b) => b[sortProperty] - a[sortProperty]);
        }
        console.log(sorted);
        setSortAttribute(sortProperty)
        if(order === 'descending'){
            setJobsForSearch(sorted);
        }else{
            setJobsForSearch(sorted.concat().reverse());
        }
    };

    const changeSort = type => {
        setSortOrder(type)
        if(type === 'ascending'){
            sortArray(sortAttribute, 'ascending')
        }else{
            sortArray(sortAttribute, 'descending')
        }
    }

    const applyAllFilters = () => {
        var filteredJobs
        if(typeFilter === "none"){
            filteredJobs = [...jobs]
        }else{
            filteredJobs = [...jobs].filter(job => {
                return job.type.includes(typeFilter)
            })
        }
        filteredJobs = filteredJobs.filter(job => {
            if(job.salary <= filterSalaryEnd && job.salary >= filterSalaryStart && job.duration <= durationFilter){
                return true;
            }
            else return false;
        })
        setJobsForSearch(filteredJobs)
    }
    const handlefilterType = type => {
        setFilterType(type)
    }

    const handleFilterSalaryStart = val => {
        setFilterSalaryStart(val)
    }

    const handleFilterSalaryEnd = val => {
        setFilterSalaryEnd(val)
    }

    const handleDurationFilter = (duration) => {
        setDurationFilter(duration)
    }

    const clearFilters = () => {
        setJobsForSearch(jobs)
    }


    const BarStyling = {width:"20rem",background:"#F2F1F9", border:"none", padding:"0.5rem"};
    return (
        <div className = "box">
            <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
                <center>
                    <Link to={{pathname:'/myApplication', state:{ jobs: jobs, applications: applicantApplications }}}>
                        <Button style={{backgroundColor:'maroon'}}>My Applications</Button><br/><br/>
                    </Link>
                    <Form>
                        <FormGroup>
                            <Label style={{marginRight:'40px'}}>Search:</Label>
                            <input 
                                style={BarStyling}
                                key="random1"
                                value={searchInput}
                                placeholder={"Search Title"}
                                onChange={(e) => updateInput(e.target.value)}
                                /> <br/><br/>
                            <Label style={{marginRight:'40px'}}>Sort:</Label>
                            <select onChange={(e) => sortArray(e.target.value, sortOrder)}>
                                <option value="salary" >Salary</option>
                                <option value="duration">Duration</option>
                                <option value="rating">Rating</option>
                            </select>
                            <select onChange={(e) => changeSort(e.target.value)}>
                                <option value="ascending">Ascending</option>
                                <option value="descending">Descending</option>
                            </select>
                            <br/><br/>
                            <div onChange={(e) => handlefilterType(e.target.value)}>
                                <Label style={{marginRight:'40px'}}>Filter:</Label>
                                <input type="radio" value="Full-time" name="type" /> Full Time
                                <input type="radio" value="Part-time" name="type" /> Part Time
                                <input type="radio" value="Work-from-home" name="type" /> Work form Home
                                <input type="radio" value="none" name="type" /> None
                            </div>
                            <br/>
                            <Label style = {{marginRight:'40px'}}>Salary Range:</Label>
                            <div>
                                <input type="number" placeholder="Start Range" onChange={(e) => handleFilterSalaryStart(e.target.value)} style = {{marginRight:'40px'}}/>
                                <input type="number" placeholder="EndRange" onChange={(e) => handleFilterSalaryEnd(e.target.value)}/>
                            </div>
                            <br/>
                            <Label style = {{marginRight:'40px'}}>Duration (in Months)</Label>
                            <select onChange={(e) => handleDurationFilter(e.target.value)}>
                                <option value="1" >1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7" selected>7</option>
                            </select>
                            <br/><br/>
                            <Button onClick={applyAllFilters} style = {{marginRight:'40px', backgroundColor:'green'}}>Apply Filters</Button> 
                            <Button onClick={clearFilters}>Clear Filters</Button><br/><br/>
                            { applicationLimit ? <div><h1 style={{color: "red"}}> Limit of Applications Reached </h1></div> : null }
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
                                    {
                                        jobsForSearch != null ? jobsForSearch.map((job, index) => {
                                            {
                                                return moment(job.deadline, 'YYYY-MM-DDTHH:mm:ss.SSSZ').isValid && moment().isBefore(moment(job.deadline, 'YYYY-MM-DDTHH:mm:ss.SSSZ')) 
                                                ? handleCheck(job) 
                                                    ?   applicantApplications!= null 
                                                        ? applicantApplications.map((item, index) => {
                                                            return job._id === item.job_id && item.status!="Rejected" ? (
                                                            <tr>
                                                                <td>{job.title}</td>
                                                                <td>{job.name}</td>
                                                                <td>{ job.number_of_ratings!=0 ? job.ratings_sum/job.number_of_ratings : 0}</td>
                                                                <td>{job.salary}</td>
                                                                <td>{job.duration}</td>
                                                                <td>{moment(job.deadline).format("YYYY-MM-DD")}</td>
                                                                {item.status === "Applied" ? <td><Button style={{ color: "black", backgroundColor:"white" }} >{item.status}</Button></td> : null}
                                                            </tr> 
                                                            ) : null
                                                        }) 
                                                        : null
                                                    :  (<tr>
                                                            <td>{job.title}</td>
                                                            <td>{job.name}</td>
                                                            <td>{ job.number_of_ratings!=0 ? job.ratings_sum/job.number_of_ratings : 0}</td>
                                                            <td>{job.salary}</td>
                                                            <td>{job.duration}</td>
                                                            <td>{moment(job.deadline).format("YYYY-MM-DD")}</td>
                                                            {
                                                                job.pending_applicants.length >= job.application_no || job.accepted_applicants.length >= job.positions_no 
                                                                ? <td><Button style={{ color: "red", backgroundColor:"white" }} >Full</Button></td>
                                                                : <td>
                                                                    <Button style={{ backgroundColor:'green'}} onClick={callEditing.bind(this, index)} >Apply</Button>
                                                                    { isApplying && isApplyingIndex===index ? <AddSopApply job={job} reload={reloadJobs} />  : null}
                                                                </td>
                                                            }
                                                        </tr>)
                                                : null

                                            }
                                        }) : null
                                    }
                                    {/* { jobs != null ? jobs.map((job, index) =>
                                        { return moment(job.deadline, 'YYYY-MM-DDTHH:mm:ss.SSSZ').isValid && moment().isBefore(moment(job.deadline, 'YYYY-MM-DDTHH:mm:ss.SSSZ')) ? 
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
                                            </tr>) :null
                                        } 
                                    ) : null } */}
                                </tbody>
                            </table>
                        </FormGroup>
                    </Form>
                </center>
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