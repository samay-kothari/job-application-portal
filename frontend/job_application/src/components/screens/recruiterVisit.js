import { Component } from "react";
import '../../App.css'
import { Link } from 'react-router-dom'
import { Button, Label, Form, FormGroup } from 'reactstrap'
import axios from 'axios'

class RecruiterVisit extends Component {

    constructor(props){
        super(props);
        this.state = {
            redirect: null,
            name: localStorage.getItem('name'),
            email: localStorage.getItem('email'),
            contact_number: '',
            bio: '',
            _id: ''
        }
    }

    componentDidMount (){
        const user = {
            email: this.state.email,
        }
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const {email} = user
        const body = JSON.stringify({email})
        axios.post('/api/recruiterProfile/getData/', body, config)
            .then( res => {
                this.setState({
                    contact_number: res.data.recruiterProfile.contact_number,
                    bio: res.data.recruiterProfile.bio,
                    _id: res.data.recruiterProfile._id
                })
            })
            .catch(err => {
                console.log(err.response);
                alert('An error occurred! Try submitting the form again.');
            });

    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    updateData = () => {
        var updatedData = {
            _id: this.state._id,
            name: this.state.name,
            email: this.state.email,
            bio: this.state.bio,
            contact_number: this.state.contact_number
        }
        const { _id, name, email, bio, contact_number } = updatedData
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const body = JSON.stringify({ _id ,name, email, bio, contact_number})
        console.log(`${body}`)
        axios.post('/api/recruiterProfile/update', body, config)
            .then( res => {
                console.log(`${res.data}`)
            })
            .catch( err => {
                console.log(`${err}`)
            })
    }

    render() {
        console.log(`${this.state.contact_number}`)
        return (
            <div className = "box">
                {/* <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
                    <h1 style={{ color:'white'}}>Welcome Recruiter</h1>
                </div> */}
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
                    <FormGroup>
                        <Form>
                            <Label>Name:</Label><br/>
                            <h2>{this.state.name}</h2><br/>
                            <Label>Email:</Label><br/>
                            <h2>{this.state.email}</h2><br/>
                            <Label>Contact Number:</Label>
                            <input type="textarea" 
                                name="contact_number" id="contact_number"
                                onChange={this.onChange
                                } value={this.state.contact_number}
                                /><br/>
                            <Label>Bio:</Label><br/>
                            <textarea type="textarea" 
                                name="bio" id="bio"
                                onChange={this.onChange
                                }
                                value={this.state.bio}
                                /><br/>
                            <Button color = "light" style={{marginTop: '2rem'}} onClick={this.updateData}>Update</Button>
                        </Form>
                        <Link to="/addJob">
                            <Button color="dark" style={{marginTop: '2rem', marginRight:'5rem'}}>Add New Job</Button>
                        </Link>
                        <Link to="/viewJob">
                            <Button color="dark" style={{marginTop: '2rem' }}>View posted jobs</Button>
                        </Link>
                    </FormGroup>
                </div>
            </div>
        )
    }
}

export default RecruiterVisit