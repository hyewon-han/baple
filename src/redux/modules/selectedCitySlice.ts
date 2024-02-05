import { createSlice } from '@reduxjs/toolkit';

const initialState = '';

const selectedCity = createSlice({
  name: 'selectedCity',
  initialState,
  reducers: {
    saveSelectedCity: (state, action) => {
      return (state = action.payload);
    },
  },
});

export default selectedCity.reducer;
export const { saveSelectedCity } = selectedCity.actions;
