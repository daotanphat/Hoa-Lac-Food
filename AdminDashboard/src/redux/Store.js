import { applyMiddleware, combineReducers, legacy_createStore } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import storage from "redux-persist/lib/storage";
import { thunk } from "redux-thunk";
import { authReducer } from "./Authentication/Reducer";
import { foodReducer } from "./Food/Reducer";
import { userReducer } from "./User/Reducer";
import { orderReducer } from "./Order/Reducer";
import { categoryReducer } from "./Category/Reducer";
import { shopReducer } from "./Shop/Reducer";

const rooteReducer = combineReducers({
    auth: authReducer,
    shop: shopReducer,
    food: foodReducer,
    user: userReducer,
    order: orderReducer,
    category: categoryReducer
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
    whitelist: ['auth', 'shop', 'food', 'user', 'order', 'category']
}

const persitedReducer = persistReducer(persitConfig, rootReducer);

export const store = legacy_createStore(persitedReducer, applyMiddleware(thunk));
export const persistor = persistStore(store);