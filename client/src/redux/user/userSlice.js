import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  currentUser: null,
  errorMessage: null,
  loading: false,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStarted: (state) => {
      state.loading = true
      state.errorMessage = null
    },
    signInSuccess: (state, action) => {
      state.loading = false
      state.currentUser = action.payload
    },
    signInFailure: (state, action) => {
      state.loading = false
      state.errorMessage = action.payload
    },
    updateUserStarted: (state) => {
      state.loading = true
      state.errorMessage = null
    },
    updateUserSuccess: (state, action) => {
      state.loading = false
      state.currentUser = action.payload
    },
    updateUserFailure: (state, action) => {
      state.loading = false
      state.errorMessage = action.payload
    },
    resetErrorMessage: (state) => {
      state.errorMessage = null
    },
    deleteUserStart: (state) => {
      state.loading = true
      state.errorMessage = null
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null
      state.loading = false
      state.errorMessage = null
    },
    deleteUserFailure: (state, action) => {
      state.loading = false
      state.errorMessage = action.payload
    },
    signoutSuccess: (state) => {
      state.currentUser = null
      state.errorMessage = null
      state.loading = false
    },
  },
})

export const {
  signInStarted,
  signInSuccess,
  signInFailure,
  updateUserFailure,
  updateUserStarted,
  updateUserSuccess,
  resetErrorMessage,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} = userSlice.actions
export default userSlice.reducer
