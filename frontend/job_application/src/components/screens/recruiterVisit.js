import { Component } from "react";
import '../../App.css'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'

class RecruiterVisit extends Component {
    render() {
        return (
            <div className = "box">
                {/* <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
                    <h1 style={{ color:'white'}}>Welcome Recruiter</h1>
                </div> */}
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
                    <Link to="/addJob">
                        <Button color="dark" style={{marginTop: '2rem'}}>Add New Job</Button>
                    </Link>
                </div>
            </div>
        )
    }
}

export default RecruiterVisit