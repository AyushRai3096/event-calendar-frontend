import axios from "axios";
import config from './config'

var authToken = localStorage.getItem("authToken")
var loginUrl = `${config.baseUrl}/login`
var signupUrl = `${config.baseUrl}/signup`

const customAxios = axios.create()

const requestHandler = (request) => {
    if (request.url === loginUrl || request.url === signupUrl) return request;
    else {
        if (authToken) {
            request.headers['Authorization'] = 'Bearer ' + authToken;
        }
        return request
    }
}

const errorHandler = error => {
    return Promise.reject(error);
};

customAxios.interceptors.request.use(
    (request) => requestHandler(request),
    (error) => errorHandler(error)
);


export default customAxios;