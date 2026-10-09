// write logic fetch data from the backend

import { CREATE_SALON_FAILURE, CREATE_SALON_REQUEST, CREATE_SALON_SUCCESS, FETCH_SALON_BY_ID_FAILURE, FETCH_SALON_BY_ID_REQUEST, FETCH_SALON_BY_ID_SUCCESS, FETCH_SALON_BY_OWNER_FAILURE, FETCH_SALON_BY_OWNER_REQUEST, FETCH_SALON_BY_OWNER_SUCCESS, FETCH_SALONS_FAILURE, FETCH_SALONS_REQUEST, FETCH_SALONS_SUCCESS, SEARCH_SALONS_FAILURE, SEARCH_SALONS_REQUEST, SEARCH_SALONS_SUCCESS, UPDATE_SALON_FAILURE, UPDATE_SALON_REQUEST, UPDATE_SALON_SUCCESS } from "./actionTypes";
import api from "../../config/api";

const API_BASE_URL = "/api/salons"

export const createSalon = (reqData) => async (dispatch) => {
    dispatch({
        type: CREATE_SALON_REQUEST
    })

    try {
        const response = await api.post(API_BASE_URL, reqData.salonDetails)
        reqData.navigate("/salon-dashboard")
        dispatch({ type: CREATE_SALON_SUCCESS, payload: response.data })
    }
    catch (error) {
        dispatch({ type: CREATE_SALON_FAILURE, payload: error.response?.data?.message || error.message })

    }
}



export const updateSalon = ({ salonId, salon, jwt }) => async (dispatch) => {
    dispatch({
        type: UPDATE_SALON_REQUEST
    })

    try {


        const response = await api.put(`${API_BASE_URL}/${salonId}`, salon, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })

        dispatch({ type: UPDATE_SALON_SUCCESS, payload: response.data })
    }
    catch (error) {
        dispatch({ type: UPDATE_SALON_FAILURE, payload: error.response?.data?.message || error.message })

    }
}

export const fetchSalons = () => async (dispatch) => {
    dispatch({
        type: FETCH_SALONS_REQUEST
    })

    try {
        const response = await api.get(API_BASE_URL);

        dispatch({ type: FETCH_SALONS_SUCCESS, payload: response.data })
    }
    catch (error) {
        dispatch({ type: FETCH_SALONS_FAILURE, payload: error.response?.data?.message || error.message })

    }
}

export const fetchSalonById = (salonId) => async (dispatch) => {
    dispatch({
        type: FETCH_SALON_BY_ID_REQUEST
    })

    try {
        const response = await api.get(`${API_BASE_URL}/${salonId}`);

        dispatch({ type: FETCH_SALON_BY_ID_SUCCESS, payload: response.data })
    }
    catch (error) {
        dispatch({ type: FETCH_SALON_BY_ID_FAILURE, payload: error.response?.data?.message || error.message })

    }
}

export const fetchSalonByOwner = (jwt) => async (dispatch) => {
    dispatch({
        type: FETCH_SALON_BY_OWNER_REQUEST
    })

    try {
        const token = jwt || localStorage.getItem("jwt");
        const headers = (token && token !== "null" && token !== "undefined")
            ? { Authorization: `Bearer ${token}` }
            : {};

        const response = await api.get(`${API_BASE_URL}/owner`, { headers });

        dispatch({ type: FETCH_SALON_BY_OWNER_SUCCESS, payload: response.data })
    }
    catch (error) {
        dispatch({ type: FETCH_SALON_BY_OWNER_FAILURE, payload: error.response?.data?.message || error.message })

    }
}


export const searchSalons = (jwt, city) => async (dispatch) => {
    dispatch({
        type: SEARCH_SALONS_REQUEST
    })

    try {
        const response = await api.get(`${API_BASE_URL}/search`, {
            params: {
                city: city
            }
        })

        dispatch({ type: SEARCH_SALONS_SUCCESS, payload: response.data })
    }
    catch (error) {
        dispatch({ type: SEARCH_SALONS_FAILURE, payload: error.response?.data?.message || error.message })

    }
}