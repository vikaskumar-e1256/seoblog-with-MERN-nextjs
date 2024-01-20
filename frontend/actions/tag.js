import fetch from "isomorphic-fetch";
import { API } from "../config";

export const create = (tag, token) => {
    return fetch(`${API}/api/tag-create`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(tag)
    })
        .then((response) => {
            return response.json();
        })
        .catch((err) => {
            console.log(err);
        })
};

export const getTags = (token) => {
    return fetch(`${API}/api/tags`, {
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

export const singleTag = (slug, token) => {
    return fetch(`${API}/api/tag/${slug}`, {
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

export const deleteTag = (slug, token) => {
    return fetch(`${API}/api/tag-delete/${slug}`, {
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