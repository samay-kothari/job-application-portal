import { Component } from "react";
import '../../App.css'

class ApplicantVisit extends Component {

    constructor(props){
        super(props);
        this.state = {
            jobs: null
        }
    }

    componentDidMount (){
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }

    render() {
        return (
            <div className = "box">
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
                    <h1 style={{ color:'white'}}>Welcome Applicant</h1>
                </div>
            </div>
        )
    }
}

export default ApplicantVisit