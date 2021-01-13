import { Component } from "react";
import '../../App.css'
import ApplicantVisit from './applicantVisit'
import RecruiterVisit from './recruiterVisit'
import { connect } from 'react-redux';
import propTypes from 'prop-types';


class LandingPage extends Component {

    static propTypes = {
        auth: propTypes.object.isRequired
    }
    render() {
        const { isAuthenticated, user, role } = this.props.auth;
        return (
            !isAuthenticated ? 
            <div className = "box">
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
                    <h1 style={{ color:'white'}}>Welcome.</h1>
                </div>
            </div> : role === "Applicant" ? <ApplicantVisit/> : <RecruiterVisit/>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
})

export default connect( mapStateToProps, null)(LandingPage)