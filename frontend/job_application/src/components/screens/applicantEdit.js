import { Component } from "react";
import '../../App.css';
import propTypes from 'prop-types';
import { connect } from 'react-redux'
import { getApplicantData, updateApplicantData } from '../../actions/applicantActions'
import { Button, Form, FormGroup, Label, ListGroupItem} from 'reactstrap';
import { combineReducers } from "redux";

class ApplicantEdit extends Component {

    // state = {
    //     name: null,
    //     email: localStorage.getItem('email'),
    //     education: null,
    //     skills: null,
    // }
    constructor(props){
        super(props);
        this.state = {
            name: null,
            email: localStorage.getItem('email'),
            education: null,
            skills: null,
            data: null,
        }
    }

    propTypes = {
        email: propTypes.string,
        getApplicantData: propTypes.func.isRequired,
        updateApplicantData: propTypes.func.isRequired
    }

    componentDidUpdate(prevProps){
        const { applicantData } = this.props;
        if(applicantData !== prevProps.applicantData){
            this.setState({
                name: this.props.applicantData.name,
                email: this.props.applicantData.email,
                skills: this.props.applicantData.skills,
                education: this.props.applicantData.education
            })
        }
    }

    componentDidMount(){
        const user = {
            email: this.props.email,
        }
        this.props.getApplicantData(user);
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSkillListChange = (index, event) => {
        var skills = this.state.skills.slice(); // Make a copy of the emails first.
        skills[index] = event.target.value; // Update it with the modified email.
        this.setState({skills: skills}); // Update the state.
    }

    handleEducationListChangeFirst = (index, event) => {
        var education = this.state.education.slice(); // Make a copy of the emails first.
        education[index][0] = event.target.value; // Update it with the modified email.
        this.setState({education: education});
    }

    handleEducationListChangeSec = (index, event) => {
        var education = this.state.education.slice(); // Make a copy of the emails first.
        education[index][1] = event.target.value; // Update it with the modified email.
        this.setState({education: education});
    }
    handleEducationListChangeThi = (index, event) => {
        var education = this.state.education.slice(); // Make a copy of the emails first.
        education[index][2] = event.target.value; // Update it with the modified email.
        this.setState({education: education});
    }

    addNewSkill = () => {
        this.setState({
            skills: this.state.skills.concat('')
        })
    }

    addNewEducation = () => {
        this.setState({
            education: this.state.education.concat([['','','']])
        })
    }

    deleteSkill = (name) => {
        this.setState({
            skills: this.state.skills.filter(function(person) { 
            return person !== name 
        })});
    }

    deleteEducation = (name) => {
        this.setState({
            education: this.state.education.filter(function(person) { 
            return person !== name 
        })});
    }

    updateApplicantData = () => {
        var updatedData = {
            _id: this.props.applicantData._id,
            name: this.state.name,
            skills: this.state.skills,
            email: this.state.email,
            education: this.state.education,
            rating: this.props.applicantData.rating,
            total_ratings: this.props.applicantData.total_ratings
        }
        this.props.updateApplicantData(updatedData)
    }

    render() {
        return (
            <div className = "box">
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
                    <Form>
                    <FormGroup>
                        <Label>Name:</Label>
                        <h2>{this.state.name}</h2>
                        <Label>Email:</Label>
                        <h2>{this.state.email}</h2>
                        <Label>Skills:</Label>
                        { this.state.skills != null ? this.state.skills.map((name, index) => (
                            <div key={index} className="input-group">
                                <Button className= "remove-btn" color="danger" size="sm" onClick = {this.deleteSkill.bind(this, name)}>&times;</Button>
                                <input type="text"
                                    className="form-control"
                                    onChange={this.handleSkillListChange.bind(this, index)} value={name}/>
                            </div>
                        ))
                        : null}
                        <Button block onClick={this.addNewSkill}>Add skill</Button>
                        <Label>Education:</Label>
                        { this.state.education != null ? this.state.education.map((edu, index) => (
                            <div key={index} className="input-group">
                                <Button className= "remove-btn" color="danger" size="sm" onClick = {this.deleteEducation.bind(this, edu)}>&times;</Button>
                                <input type="text"
                                    className="form-control"
                                    onChange={this.handleEducationListChangeFirst.bind(this.target, index)} value={edu[0]}/>
                                <input type="text"
                                    className="form-control"
                                    onChange={this.handleEducationListChangeSec.bind(this.target, index)} value={edu[1]}/>
                                <input type="text"
                                    className="form-control"
                                    onChange={this.handleEducationListChangeThi.bind(this.target, index)} value={edu[2]}/>
                            </div>
                        ))
                        : null}
                        <Button block onClick={this.addNewEducation}>Add Education</Button>
                        <Button block onClick={this.updateApplicantData}>Submit</Button>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    email: state.auth.email,
    applicantData: state.applicantDataReducer.applicantData
})

export default connect(mapStateToProps, { getApplicantData, updateApplicantData })(ApplicantEdit);
