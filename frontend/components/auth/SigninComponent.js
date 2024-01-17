import React, { useEffect, useState } from 'react';
import { signin, authenticate, isAuth } from '../../actions/auth';
import Router from 'next/router';

function SigninComponent(props) {
    const [values, setValues] = useState({
        email: '',
        password: '',
    });

    const handleChange = (name) => (event) => {
        setValues({ ...values, [name]: event.target.value });
    };

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const user = { email: values.email, password: values.password };

            // Your API call goes here
            const data = await signin(user);

            if (data.error) {
                setError(data.error);
            } else {
                setValues({ ...values, email: '', password: '' });
                setSuccess(data.message);
                authenticate(data, () => {
                    if (isAuth() && isAuth().role === 1) {
                        Router.push(`/admin`);
                    } else {
                        Router.push(`/user`);
                    }

                })
            }
        } catch (error) {
            console.error('Error signing up:', error);
            setError('Error signing up. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuth()) {
            Router.push(`/`);
        }
    }, []);

    const signinForm = () => (
        <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <div className='form-group mb-3'>
                <label>Email</label>
                <input
                    type='email'
                    onChange={handleChange('email')}
                    className='form-control'
                    placeholder='Enter your email'
                    value={values.email}
                />
            </div>
            <div className='form-group mb-3'>
                <label>Password</label>
                <input
                    type='password'
                    onChange={handleChange('password')}
                    className='form-control'
                    placeholder='Enter your password'
                    value={values.password}
                />
            </div>
            <button type='submit' className='btn btn-primary mb-3'>
                Submit
            </button>
        </form>
    );

    return <>{signinForm()}</>;
}

export default SigninComponent;
