import { actionTypes } from "./actions";

const initState = {
    userEvents: [],
    userId: localStorage.getItem("userId"),
    isError: false,
    errorMessage: "",
    authToken: localStorage.getItem("authToken")
}

const reducer = (state = initState, actions) => {
    switch (actions.type) {
        case actionTypes.login:
            localStorage.setItem('userId', actions.result.data.userId)
            localStorage.setItem('authToken', actions.result.data.token)
            return {
                ...state,
                userId: actions.result.data.userId,
                isError: false,
                errorMessage: "",
                authToken: actions.result.data.token
            }
        case actionTypes.logout:
            localStorage.clear()
            return {
                ...state,
                userId: null,
                isError: false,
                errorMessage: "",
                authToken: null,
                userEvents: []
            }
        case actionTypes.signup:
            return {
                ...state,
                isError: false,
                errorMessage: ""
            }
        case actionTypes.fetchEvents:
            return {
                ...state,
                isError: false,
                errorMessage: "",
                userEvents: actions.result.data
            }
        case actionTypes.createEvent:
            return {
                ...state,
                isError: false,
                errorMessage: "",
                userEvents: [...state.userEvents, actions.result.data]
            }
        case actionTypes.updateEvent:
            return {
                ...state,
                isError: false,
                errorMessage: "",
                userEvents: [...state.userEvents, actions.result.data]
            }
        case actionTypes.error:
            return {
                ...state,
                isError: true,
                errorMessage: actions.error.data,
            }

        default: return state;
    }

}

export default reducer;