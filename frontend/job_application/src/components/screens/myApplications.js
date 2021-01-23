import { Component, useState, useEffect } from "react";
import axios from "axios";

function MyApplication (props){
    const [ myApplications, setMyApplications ] = useState(props.location.state.applications)
    const [ allJobs, setAllJobs ] = useState(props.location.state.jobs)

    useEffect(() => {
        
    }, []);

    
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
                        </tr>
                        { myApplications!=null 
                            ?  myApplications.map((application, index) => {
                                return allJobs!= null
                                    ? allJobs.map((job, jobIndex) => {
                                        return application.job_id === job._id 
                                        ?  <tr>
                                            <td>{application.job_title}</td>
                                            <td>{application.status === "Accepted" ? application.date_of_posting : 'Not Available'}</td>
                                            <td>{job.salary}</td>
                                            <td>{application.recruiter_name}</td>
                                            <td>{application.status}</td>
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