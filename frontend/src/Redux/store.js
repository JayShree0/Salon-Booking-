import { applyMiddleware, combineReducers, legacy_createStore } from "redux"
import { thunk } from "redux-thunk"
import { salonReducer } from "./Salon/reducer"


const rootReducers = combineReducers ({
    salon: salonReducer
})

export const store = legacy_createStore(rootReducers, applyMiddleware(thunk))


/**
 * REDUX DATA FLOW:
 * 
 * 1. actionTypes
 *    - Just names/constants (e.g., FETCH_SALONS_REQUEST, FETCH_SALONS_SUCCESS).
 *    - Prevents typos and defines what events can happen.
 * 
 * 2. action.js
 *    - Triggers the event and carries the payload/data.
 *    - Often handles asynchronous backend calls (via Redux Thunk).
 * 
 * 3. reducer
 *    - Pure function that receives the current state and action.
 *    - Decides how to update and return the new state.
 * 
 * 4. store
 *    - The single central state container holding the app's entire data.
 * 
 * 5. component
 *    - Displays the state (via useSelector) or triggers actions (via useDispatch).
 */