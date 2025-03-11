import { applyMiddleware, combineReducers, legacy_createStore } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import storage from "redux-persist/lib/storage";
import { thunk } from "redux-thunk";
import { authReducer } from "./Authentication/Reducer";
import { categoryReducer } from "./Category/Reducer";
import { foodReducer } from "./Food/Reducer";
import { cartReducer } from "./Cart/Reducer";
import { orderReducer } from "./Order/Reducer";

const rooteReducer = combineReducers({
    auth: authReducer,
    food: foodReducer,
    category: categoryReducer,
    cart: cartReducer,
    order: orderReducer
})

const rootReducer = (state, action) => {
    if (action.type === 'LOGOUT_SUCCESS') {
        state = undefined;
    }
    return rooteReducer(state, action);
}

const persitConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'category', 'food', 'cart', 'order']
}

const persitedReducer = persistReducer(persitConfig, rootReducer);

export const store = legacy_createStore(persitedReducer, applyMiddleware(thunk));
export const persistor = persistStore(store);