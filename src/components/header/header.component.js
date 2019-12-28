import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap'
//import { ReactComponent as Logo } from '../../assets/crown.svg'
import './header.styles.css'
//import CartIcon from '../cart-icon/cart-icon.component'
//import CartDropDown from '../cart-dropdown/cart-dropdown.component'

const Header = ({ currentUser }) => (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand >
                
            </Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link >
                    <Link className='logo-container' to="/" >
                    Home
                </Link>
                    </Nav.Link>
                    <Nav.Link >
                        <Link to="/quals">
                            Quals
                        </Link>
                    </Nav.Link>
                </Nav>               
          
        </Navbar>
)

export default Header