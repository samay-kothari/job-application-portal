import React, { Component } from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    Label,
    Input,
    NavLink,
    Alert
} from 'reactstrap';
import { Redirect } from 'react-router-dom'
import moment from 'moment'
import axios from 'axios'


class EditJobModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: localStorage.getItem('email'),
            job: props.job,
            modal: true,
            application_no: this.props.job.application_no,
            positions_no: this.props.job.positions_no,
            deadline: this.props.job.deadline,
            redirect: null
        }
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit = async(e) => {
        e.preventDefault()

        const update = { application_no: this.state.application_no, positions_no:this.state.positions_no, deadline:this.state.deadline };
        const togeather = { _id: this.state.job._id, update: update }
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const body = JSON.stringify({ togeather })
        console.log(`${body}`)
        await axios.post('/api/viewJobs/editJob/', body, config)
            .then( res => {
                console.log("successfully updated")
            })
            .catch(err => {
                console.log(err.response);
                alert('An error occurred! Try submitting the form again.');
            });
        this.setState({
            redirect: '/'
        })
    }

    render(){
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <div>
                <Modal
                    centered = {true}
                    isOpen = {this.state.modal}
                    toggle = {this.toggle}>
                    <ModalHeader toggl={this.toggle}>Update Job</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label style={{marginBottom: '0.5rem'}}>
                                    Maximum number of applications:
                                </Label>
                                <Input style={{marginBottom: '1rem'}} type="number" name="application_no" id="application_no" value={this.state.application_no} onChange={this.onChange}>
                                </Input>
                                <Label style={{marginBottom: '0.5rem'}}>
                                    Maximum number of positions:
                                </Label>
                                <Input style={{marginBottom: '1rem'}} type="number" name="positions_no" id="positions_no" value={this.state.positions_no} onChange={this.onChange}>
                                </Input>
                                <Label style={{marginBottom: '0.5rem'}}>
                                    Deadline for application:
                                </Label>
                                <Input style={{marginBottom: '1rem'}} type="date" name="deadline" id="deadline" value={moment(this.state.deadline).format("YYYY-MM-DD")} onChange={this.onChange}></Input>
                                <Button color="dark" style={{marginTop: '2rem'}} block>Update</Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}


export default EditJobModal