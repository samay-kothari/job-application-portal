import { Component } from "react";
import '../../App.css'
import { Link, Redirect } from 'react-router-dom'
import { Button, Form, FormGroup, Label, ListGroupItem} from 'reactstrap';
import axios from 'axios'


class AddJob extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            redirect: null,
            title: '',
            name: localStorage.getItem('name'),
            email: localStorage.getItem('email'),
            application_no: 0,
            positions_no: 0,
            deadline: null,
            required_skill: [''],
            type: 'Full-time',
            duration: null,
            salary: null,
        }
    }
    handleSkillListChange = (index, event) => {
        var required_skill = this.state.required_skill.slice(); // Make a copy of the emails first.
        required_skill[index] = event.target.value; // Update it with the modified email.
        this.setState({required_skill: required_skill}); // Update the state.
    }
    addNewSkill = () => {
        this.setState({
            required_skill: this.state.required_skill.concat('')
        })
    }
    deleteSkill = (name) => {
        this.setState({
            required_skill: this.state.required_skill.filter(function(person) { 
            return person !== name 
        })});
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    
    addJob = () => {
        var updatedData = {
            title: this.state.title,
            name: this.state.name,
            required_skill: this.state.required_skill,
            email: this.state.email,
            application_no: this.state.application_no,
            positions_no: this.state.positions_no,
            deadline: this.state.deadline,
            type: this.state.type,
            duration: this.state.duration,
            salary: this.state.salary
        }
        const { title, name, email, application_no, positions_no, deadline, required_skill, type, duration, salary } = updatedData
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const body = JSON.stringify({ title, name, email, application_no, positions_no, deadline, required_skill, type, duration, salary } )
        console.log(`${body}`)
        axios.post('/api/jobspost/', body, config)
            .then( res => ({
            })   
            )
            .catch(err => {
                console.log(err.response);
                alert('An error occurred! Try submitting the form again.');
            });
        this.setState({
            redirect: "/"
        })
    }
    
    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <div className = "box">
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
                    <Form>
                        <FormGroup>
                            <Label>Title:</Label>
                            <input className="form-control" type="title" name="title" id="title" placeholder="Title" onChange={this.onChange}></input>
                            <Label>Name:</Label>
                            <h2>{this.state.name}</h2>
                            <Label>Email:</Label>
                            <h2>{this.state.email}</h2>
                            <Label>Max Applications:</Label>
                            <input className="form-control" type="number" name="application_no" id="application_no" placeholder="Number of Application" onChange={this.onChange}></input>
                            <Label>Max positions:</Label>
                            <input className="form-control" type="number" name="positions_no" id="positions_no" placeholder="Number of Positions" onChange={this.onChange}></input>
                            <Label>Deadline</Label>
                            <input className="form-control" type="date" name="deadline" id="deadline" placeholder="Deadline of Application" onChange={this.onChange}></input>
                            <Label>Required Skills:</Label>
                            { this.state.required_skill != null ? this.state.required_skill.map((name, index) => (
                                <div key={index} className="input-group">
                                    <Button className= "remove-btn" color="danger" size="sm" onClick = {this.deleteSkill.bind(this, name)}>&times;</Button>
                                    <input type="text"
                                        className="form-control"
                                        onChange={this.handleSkillListChange.bind(this, index)} value={name}/>
                                </div>
                            ))
                            : null}
                            <Button block onClick={this.addNewSkill}>Add skill</Button>
                            <Label>Type of Job</Label><br/>
                            <select name="type" onChange={this.onChange} >
                                <option value="Full-time" selected >Full-time</option>
                                <option value="Part-time" >Part-time</option>
                                <option value="Work-from-home" >Work from Home</option>
                            </select><br/>
                            <Label>Duration</Label>
                            <input className="form-control" type="number" name="duration" id="duration" placeholder="Duration" onChange={this.onChange}></input>
                            <Label>Salary</Label>
                            <input className="form-control" type="number" name="salary" id="salary" placeholder="Salary in Rupees" onChange={this.onChange}></input>
                            <Button block onClick={this.addJob}>Submit</Button>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        )
    }
}

export default AddJob