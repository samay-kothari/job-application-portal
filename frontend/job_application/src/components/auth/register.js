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
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {register} from '../../actions/authActions';
import { clearErrors } from "../../actions/errorActions";
import { addApplicantData } from "../../actions/applicantActions"

class RegisterModal extends Component {
    state = {
        modal: false,
        name: '',
        password: '',
        email: '',
        role: 'Applicant',
        msg: null,
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        register: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired,
        addApplicantData: PropTypes.func.isRequired
    }

    componentDidUpdate(prevProps){
        const { error } = this.props;
        if(error !== prevProps.error){
            if(error.id === 'REGISTER_FAIL'){
                this.setState({ msg: error.msg.msg });
            } else {
                this.setState( {msg: null} );
            }
        }

        if(this.state.modal){
            if(this.props.isAuthenticated){
                this.toggle();
            }
        }
    }

    toggle = () => {
        this.props.clearErrors();
        this.setState({
            modal: !this.state.modal
        });
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit = (e) => {
        e.preventDefault()
        const { name, email, password, role} = this.state;
        const newUser = {
            name,
            email,
            password,
            role
        };
        this.props.register(newUser);
        if(role == "Applicant"){
            this.props.addApplicantData(newUser)
        }
    }

    render(){
        return (
            <div>
                <NavLink onClick={this.toggle} href='#'>
                    Register
                </NavLink> 
                <Modal
                    centered = {true}
                    isOpen = {this.state.modal}
                    toggle = {this.toggle}>
                    <ModalHeader toggl={this.toggle}>Register</ModalHeader>
                    <ModalBody>
                        { this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null }
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label for="name" style={{marginBottom: '0.5rem'}}>
                                    Name:
                                </Label>
                                <Input type="text" name="name" id="name" placeholder="Name" onChange={this.onChange} style= {{ marginBottom: '1rem' }}>
                                </Input>

                                <Label for="email" style={{marginBottom: '0.5rem'}}>
                                    Email:
                                </Label>
                                <Input style={{marginBottom: '1rem'}} type="email" name="email" id="email" placeholder="Email" onChange={this.onChange}>
                                </Input>

                                <Label for="password" style={{marginBottom: '0.5rem'}}>
                                    Password:
                                </Label>
                                <Input style={{marginBottom: '1rem'}} type="password" name="password" id="password" placeholder="Password" onChange={this.onChange}>
                                </Input>
                                <Label for="role" style={{marginBottom: '0.5rem', marginRight:'1rem'}}>
                                    Role:
                                </Label>
                                <select name="role" onChange={this.onChange} >
                                    <option value="Applicant" selected >Applicant</option>
                                    <option value="Recruiter" >Recruiter</option>
                                </select>
                                <Button color="dark" style={{marginTop: '2rem'}} block>Register</Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error
})

export default connect(mapStateToProps, { register, clearErrors, addApplicantData })(RegisterModal);