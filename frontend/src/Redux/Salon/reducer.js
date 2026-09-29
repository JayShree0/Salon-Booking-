import { searchSalons } from "./action"
import { CREATE_SALON_FAILURE, CREATE_SALON_REQUEST, CREATE_SALON_SUCCESS, FETCH_SALON_BY_ID_FAILURE, FETCH_SALON_BY_ID_REQUEST, FETCH_SALON_BY_ID_SUCCESS, FETCH_SALON_BY_OWNER_FAILURE, FETCH_SALON_BY_OWNER_REQUEST, FETCH_SALON_BY_OWNER_SUCCESS, FETCH_SALONS_FAILURE, FETCH_SALONS_REQUEST, FETCH_SALONS_SUCCESS, SEARCH_SALONS_FAILURE, SEARCH_SALONS_REQUEST, SEARCH_SALONS_SUCCESS, UPDATE_SALON_FAILURE, UPDATE_SALON_REQUEST, UPDATE_SALON_SUCCESS } from "./actionTypes"

const initialState = {
    salons: [],
    searchSalons: [],
    salon: null,
    loading: false,
    error: null
}



export const salonReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_SALONS_REQUEST:
        case CREATE_SALON_REQUEST:
        case UPDATE_SALON_REQUEST:
        case FETCH_SALON_BY_ID_REQUEST:
        case FETCH_SALON_BY_OWNER_REQUEST:
        case SEARCH_SALONS_REQUEST:
            return { ...state, loading: true }

        case FETCH_SALONS_SUCCESS:
            return { ...state, salons: action.payload, loading: false }
        case UPDATE_SALON_SUCCESS:
            return { ...state, salon: action.payload, loading: false }
        case CREATE_SALON_SUCCESS:
            return { ...state, salon: action.payload, loading: false }

        case FETCH_SALON_BY_ID_SUCCESS:
        case FETCH_SALON_BY_OWNER_SUCCESS:
            return { ...state, salon: action.payload, loading: false }

        case SEARCH_SALONS_SUCCESS:
            return { ...state, searchSalons: action.payload, loading: false }

        case FETCH_SALONS_FAILURE:
        case CREATE_SALON_FAILURE:
        case UPDATE_SALON_FAILURE:
        case FETCH_SALON_BY_ID_FAILURE:
        case FETCH_SALON_BY_OWNER_FAILURE:
        case SEARCH_SALONS_FAILURE:
            return { ...state, loading: false, error: action.payload }

        default:
            return state

    }
}