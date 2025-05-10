import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signInSucces: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
            state.error = false;
        },
        signInFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateSucces: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
            state.error = false;
        },
        updateFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteUserSucces: (state) => {
            state.loading = false;
            state.currentUser = null;
            state.error = null;
        },
        deleteUserFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        signOutSuccess: (state) => {
            state.loading = false;
            state.currentUser = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
          }
    }
});
export const { signInStart, signInSucces, signInFail, updateStart, updateSucces, updateFail, deleteUserStart, deleteUserSucces, deleteUserFail, signOutSuccess,  clearError } = userSlice.actions;
export default userSlice.reducer;