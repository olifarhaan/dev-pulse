import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  theme: "light",
}

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      if (state.theme === "light") state.theme = "dark"
      else state.theme = "light"
    },
  },
})

export const { toggleTheme } = themeSlice.actions
export default themeSlice.reducer
