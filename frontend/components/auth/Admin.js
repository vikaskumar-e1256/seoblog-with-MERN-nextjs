import React, { useEffect } from 'react';
import { isAuth } from '../../actions/auth';
import Router from 'next/router';
import { API } from "../../config";
import { getCookie } from '../../actions/auth';


function Admin({ children }) {
    const token = getCookie('token');
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(`${API}/api/profile`,
                    {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            "Content-type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                    });
                if (response.status === 401) {
                    Router.push('/signin');
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
            }
        };
        if (!isAuth()) {
            Router.push('/signin');
        }else if (isAuth().role !== 1) {
            Router.push('/');
        }
    }, []);
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    );
}

export default Admin;