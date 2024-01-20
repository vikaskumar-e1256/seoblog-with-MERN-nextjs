import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Router from "next/router";
import { create, getTags, deleteTag } from "../../actions/tag";
import { isAuth, getCookie } from "../../actions/auth";

function Tag(props) {
    const [values, setValues] = useState({
        name: '',
        error: false,
        success: false,
        tags: [],
        removed: false,
        reload: false
    });
    const { name, error, success, tags, removed, reload } = values;
    const token = getCookie('token');

    useEffect(() => {
        loadCategories()
    }, [reload]);

    const loadCategories = () => {
        getTags(token).then((data) => {
            // console.log(data.tags);
            if (data.error) {
                console.log(data.error);
            } else {
                setValues({ ...values, tags: data.tags });
            }
        });
    };

    const showTags = () => {
        return tags.map((tag, index) => {
            return (
                <button
                    onDoubleClick={() => deleteConfirm(tag.slug)}
                    title="Double click to delete"
                    key={index}
                    className="btn btn-outline-primary mr-1 ml-1 mt-3"
                >
                    {tag.name}
                </button>
            );
        })
    };

    const deleteConfirm = slug => {
        let answer = window.confirm('Are you sure you want to delete this tag?');
        if (answer) {
            removeTag(slug);
        }
    };

    const removeTag = slug => {
        // console.log('delete', slug);
        deleteTag(slug, token).then(data => {
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
            return <p className="text-success">Tag is created</p>;
        }
    };

    const showError = () => {
        if (error) {
            return <p className="text-danger">Tag already exist</p>;
        }
    };

    const showRemoved = () => {
        if (removed) {
            return <p className="text-danger">Tag is removed</p>;
        }
    };

    const mouseMoveHandler = e => {
        setValues({ ...values, error: false, success: false, removed: '' });
    };

    const newTagForm = () => (
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
                {newTagForm()}
                {showTags()}
            </div>
        </>
    );
}

export default Tag;