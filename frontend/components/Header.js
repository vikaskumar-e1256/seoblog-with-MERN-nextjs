import React, { useState } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,  // Import NavLink
} from 'reactstrap';
import { APP_NAME } from '../config';
import Link from 'next/link';
import { isAuth, signout } from '../actions/auth';
import Router from 'next/router';
import NProgress from 'nprogress';

Router.onRouteChangeStart = url => NProgress.start();
Router.onRouteChangeComplete = url => NProgress.done();
Router.onRouteChangeError = url => NProgress.done();

function Header(args) {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <div>
            <Navbar
                color="secondary"
                dark {...args}
                expand="md"
            >
                <Link href="/">
                    <NavbarBrand>{APP_NAME}</NavbarBrand>
                </Link>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="me-auto" navbar>
                        {isAuth() && isAuth().role === 0 && (
                        <React.Fragment>
                        <NavItem>
                            <Link href="https://github.com/reactstrap/reactstrap">
                                <NavLink>Home</NavLink>
                            </Link>
                        </NavItem>
                        <NavItem>
                            <Link href="/components/">
                                <NavLink>About</NavLink>
                            </Link>
                        </NavItem>
                        <NavItem>
                            <Link href="/components/">
                                <NavLink>Pricing</NavLink>
                            </Link>
                        </NavItem>
                        </React.Fragment>
                        )}
                    </Nav>
                    <Nav className="me" navbar>
                        {!isAuth() && (
                            <React.Fragment>
                                <NavItem>
                                    <Link href="/signin">
                                        <NavLink>Signin</NavLink>
                                    </Link>
                                </NavItem>
                                <NavItem>
                                    <Link href="/signup">
                                        <NavLink>Signup</NavLink>
                                    </Link>
                                </NavItem>
                            </React.Fragment>
                        )}
                        {isAuth() && isAuth().role === 0 && (
                            <NavItem>
                                <Link href="/user">
                                    <NavLink>{`${isAuth().name}'s Dashboard`}</NavLink>
                                </Link>
                            </NavItem>
                        )}

                        {isAuth() && isAuth().role === 1 && (
                            <NavItem>
                                <Link href="/admin">
                                    <NavLink>{`${isAuth().name}'s Dashboard`}</NavLink>
                                </Link>
                            </NavItem>
                        )}
                        {isAuth() && (
                            <NavItem style={{ cursor: 'pointer' }} onClick={() => signout(() => Router.push(`/signin`))}>
                                <NavLink>Logout</NavLink>
                            </NavItem>
                        )}
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    );
}

export default Header;
