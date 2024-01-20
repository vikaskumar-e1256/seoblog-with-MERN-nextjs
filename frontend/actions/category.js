import fetch from "isomorphic-fetch";
import { API } from "../config";

export const create = (category, token) => {
    return fetch(`${API}/api/category-create`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(category)
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => {
            console.log(err);
        })
};

export const getCategories = (token) => {
    return fetch(`${API}/api/categories`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => {
            console.log(err);
        })
};

export const singleCategory = (slug, token) => {
    return fetch(`${API}/api/category/${slug}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => {
            console.log(err);
        })
};

export const deleteCategory = (slug, token) => {
    return fetch(`${API}/api/category-delete/${slug}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => {
            console.log(err);
        })
};