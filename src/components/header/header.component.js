import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
//import { ReactComponent as Logo } from '../../assets/crown.svg'
import './header.styles.css'
//import CartIcon from '../cart-icon/cart-icon.component'
//import CartDropDown from '../cart-dropdown/cart-dropdown.component'

const Header = ({ currentUser }) => (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand >
            </Navbar.Brand>
                <Nav className="mr-auto">
                   
                    <LinkContainer to="/"><Nav.Link>Home</Nav.Link></LinkContainer>
                    <LinkContainer to="/quals"><Nav.Link>Qualifications</Nav.Link></LinkContainer>
                    <LinkContainer to="/establishments"><Nav.Link>Establishments</Nav.Link></LinkContainer>
                        
                </Nav>               
        </Navbar>
)

export default Header