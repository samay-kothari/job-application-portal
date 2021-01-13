import React, {Component, Fragment} from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Container
} from 'reactstrap';
import RegisterModal from './auth/register'
import Logout from './auth/logout';
import LoginModal from './auth/loginModal'
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'


class AppNavbar extends Component {

    static propTypes = {
        auth: propTypes.object.isRequired
    }
    state = {
        isOpen: false
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    render() {
        const { isAuthenticated, user, role } = this.props.auth;
        const authLinks = (
            <Fragment>
                <span className="navbar-text mr-3" style={{ color: "violet" }}>
                    <strong>{ user ? `Welcome ${user.name}` : ''}</strong>
                </span>
                { role === "Applicant" ? 
                <Link to="/applicantEdit">
                    <span className="navbar-text mr-3" style={{ color: "violet" }}>
                        <strong>Account</strong>
                    </span>
                </Link> : null}
                <NavItem>
                    <Logout/>
                </NavItem>
            </Fragment>
        )

        const guestLinks = (
            <Fragment>
                <NavItem>
                    <RegisterModal/>
                </NavItem>
                <NavItem>
                    <LoginModal/>
                </NavItem>
            </Fragment>
        )

        return (
            <div>
                <Navbar color = "dark" dark expand="sm" className="mb-5">
                    <Container>
                        <Link to="/">
                            <NavbarBrand href="/">JOB APPLICATION PORTAL</NavbarBrand>
                        </Link>
                        <NavbarToggler onClick={this.toggle}></NavbarToggler>
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar>
                                { isAuthenticated ?  authLinks : guestLinks }
                            </Nav>
                        </Collapse>
                    </Container>
                </Navbar>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
})

export default connect( mapStateToProps, null)(AppNavbar)