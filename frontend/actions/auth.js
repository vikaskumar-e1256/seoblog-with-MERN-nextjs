import fetch from "isomorphic-fetch";
import { API } from "../config";
import cookie from "js-cookie";


export const signup = (user) => {
    return fetch(`${API}/api/signup`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-type": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then((response) => {
        return response.json()
    })
    .catch((err) => {
        console.log(err);
    })
};

export const signin = (user) => {
    return fetch(`${API}/api/signin`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-type": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then((response) => {
        return response.json()
    })
    .catch((err) => {
        console.log(err);
    })
};

export const signout = (next) => {
    removeCookie('token');
    removeLocalStorage('user');
    next();

    return fetch(`${API}/api/signout`, {
        method: 'GET'
    }).then((response) => {
        console.log(response.message);
    }).catch(err => console.log(err));
}

// get cookie
export const getCookie = (key) => {
    // identify request is comming from browser
    if (typeof window !== 'undefined') {
        return cookie.get(key);
    }
    return null;
}

// set cookie
export const setCookie = (key, value) => {
    // identify request is comming from browser
    if (typeof window !== 'undefined') {
        cookie.set(key, value, {
            expires: 1
        })
    }
}
// remove cookie
export const removeCookie = (key) => {
    // identify request is comming from browser
    if (typeof window !== 'undefined') {
        cookie.remove(key, {
            expires: 1
        })
    }
}
// setlocalstorage
export const setLocalStorage = (key, value) => {
    // identify request is comming from browser
    if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
    }
}
// removelocalstorage
export const removeLocalStorage = (key) => {
    // identify request is comming from browser
    if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
    }
}

// authenticate user by pass datat to cookie and localstorage
export const authenticate = (data, next) => {
    setCookie('token', data.token);
    setLocalStorage('user', data.user);
    next();
}

// get user information
export const isAuth = () => {
    // identify request is comming from browser
    if (typeof window !== 'undefined') {
        const cookieChecked = getCookie('token');
        if (cookieChecked) {
            if (localStorage.getItem('user')) {
                return JSON.parse(localStorage.getItem('user'));
            } else {
                return false;
            }
        }
        return false;
    }
}