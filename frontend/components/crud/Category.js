import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Router from "next/router";
import { create, getCategories, deleteCategory } from "../../actions/category";
import { isAuth, getCookie } from "../../actions/auth";

function Category(props) {
    const [values, setValues] = useState({
        name: '',
        error: false,
        success: false,
        categories: [],
        removed: false,
        reload: false
    });
    const { name, error, success, categories, removed, reload } = values;
    const token = getCookie('token');

    useEffect(() => {
        loadCategories()
    }, [reload]);

    const loadCategories = () => {
        getCategories(token).then((data) => {
            // console.log(data.categories);
            if (data.error) {
                console.log(data.error);
            } else {
                setValues({ ...values, categories: data.categories });
            }
        });
    };

    const showCategories = () => {
        return categories.map((category, index) => {
            return (
                <button
                    onDoubleClick={() => deleteConfirm(category.slug)}
                    title="Double click to delete"
                    key={index}
                    className="btn btn-outline-primary mr-1 ml-1 mt-3"
                >
                    {category.name}
                </button>
            );
        })
    };

    const deleteConfirm = slug => {
        let answer = window.confirm('Are you sure you want to delete this category?');
        if (answer) {
            removeCategory(slug);
        }
    };

    const removeCategory = slug => {
        // console.log('delete', slug);
        deleteCategory(slug, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setValues({ ...values, error: false, success: false, name: '', removed: !removed, reload: !reload });
            }
        });
    };

    const clickSubmit = (e) => {
        e.preventDefault();
        create({ name }, token).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error, success: false });
            } else {
                setValues({ ...values, error: false, success: true, name: '', removed: false, reload: !reload });
            }
        })
    };

    const handleChange = (e) => {
        setValues({ ...values, name: e.target.value, error: false, success: false, removed: '' });
    };

    const showSuccess = () => {
        if (success) {
            return <p className="text-success">Category is created</p>;
        }
    };

    const showError = () => {
        if (error) {
            return <p className="text-danger">Category already exist</p>;
        }
    };

    const showRemoved = () => {
        if (removed) {
            return <p className="text-danger">Category is removed</p>;
        }
    };

    const mouseMoveHandler = e => {
        setValues({ ...values, error: false, success: false, removed: '' });
    };

    const newCategoryForm = () => (
        <form onSubmit={clickSubmit}>
            <div className='form-group'>
                <label className='text-muted'>Name</label>
                <input type='text' className='form-control' onChange={handleChange} value={name} required />
            </div>
            <div>
                <button type='submit' className='btn btn-primary'>Create</button>
            </div>
        </form>
    );

    return (
        <>
            {showSuccess()}
            {showError()}
            {showRemoved()}
            <div onMouseMove={mouseMoveHandler}>
                {newCategoryForm()}
                {showCategories()}
            </div>
        </>
    );
}

export default Category;