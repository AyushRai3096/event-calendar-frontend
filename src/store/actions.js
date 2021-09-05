import axios from "../customAxios";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify'
import config from '../config'

const actionTypes = {
    login: "LOGIN",
    error: "ERROR",
    signup: "SIGNUP",
    fetchEvents: "FETCHEVENTS",
    logout: "LOGOUT",
    createEvent: "CREATEEVENT",
    updateEvent: "UPDATEEVENT"
}

const initLogin = (emailId, password) => {
    return (dispatch) => {
        axios.post(`${config.baseUrl}/login`, {
            emailId,
            password
        }).then((result) => {
            dispatch(_login(result));
        }).catch((err) => {
            dispatch(_error(err.response));
            toast.error(err.response.data)
        })
    }
}

const initLogout = (userId) => {
    return (dispatch) => {
        axios.post(`${config.baseUrl}/logout`, {}, { params: { "userId": userId } }).then((result) => {
            dispatch(_logout(result));
        }).catch((err) => {
            dispatch(_error(err.response));
            toast.error(err.response.data)
        })
    }
}

const _login = (result) => {
    return {
        type: actionTypes.login,
        result
    }
}

const _logout = (result) => {
    return {
        type: actionTypes.logout,
        result
    }
}

const initSignup = (userName, emailId, password, history) => {
    return (dispatch) => {
        axios.post(`${config.baseUrl}/signup`, {
            userName,
            emailId,
            password
        }).then((result) => {
            dispatch(_signup(result));
            toast.success("Successully created account. Please login!")
        }).catch((err) => {
            dispatch(_error(err.response));
            toast.error(err.response.data)
        })
    }
}

const initFetchEvents = (userId) => {
    return (dispatch) => {
        axios.get(`${config.baseUrl}/event`, { params: { "userId": userId } })
            .then((result) => {
                dispatch(_fetchEvents(result));
            }).catch((err) => {
                dispatch(_error(err.response));
                toast.error('Could not fetch events')
            })
    }
}

const initCreateEvent = (title, description, start, end, allDay, userId) => {
    return (dispatch) => {
        const availableColors = ["#32a852", "#a32a2a", "#2c3e50"];
        const color = availableColors[Math.floor(Math.random() * availableColors.length)];
        axios.post(`${config.baseUrl}/event`, { title, description, start, end, allDay, color, userId })
            .then((result) => {
                dispatch(_createEvent(result));
            })
            .catch((err) => {
                dispatch(_error(err.response));
                toast.error('Some problem occurred! Event could not be created')
            })
    }
}

const initUpdateEvent = (title, description, start, end, allDay, userId, eventId) => {
    return (dispatch) => {
        axios.put(`${config.baseUrl}/event/` + eventId, { title, description, start, end, allDay, userId, eventId })
            .then((result) => {
                // dispatch(_updateEvent(result));
                return axios.get(`${config.baseUrl}/event`, { params: { "userId": userId } })
            }).then((result) => {
                dispatch(_fetchEvents(result));
            })
            .catch((err) => {
                dispatch(_error(err.response));
                toast.error('Something went wrong!')
            })
    }
}

const initDeleteEvent = (userId, eventId) => {
    return (dispatch) => {
        axios.delete(`${config.baseUrl}/event/` + eventId)
            .then((result) => {
                return axios.get(`${config.baseUrl}event`, { params: { "userId": userId } })
            }).then((result) => {
                dispatch(_fetchEvents(result));
            })
            .catch((err) => {
                dispatch(_error(err.response));
                toast.error('Something went wrong!')
            })
    }
}

const _fetchEvents = (result) => {
    return {
        type: actionTypes.fetchEvents,
        result
    }
}

const _createEvent = (result) => {
    return {
        type: actionTypes.createEvent,
        result
    }
}

const _signup = (result) => {
    return {
        type: actionTypes.signup,
        result
    }
}

const _error = (err) => {
    return {
        type: actionTypes.error,
        error: err
    }
}

export { actionTypes, initLogin, initSignup, initFetchEvents, initLogout, initCreateEvent, initUpdateEvent, initDeleteEvent };