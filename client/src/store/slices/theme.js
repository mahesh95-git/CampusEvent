import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: localStorage.getItem("vite-ui-theme") || "system",
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.value = action.payload;
      localStorage.setItem("vite-ui-theme", action.payload);
    },
  },
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
