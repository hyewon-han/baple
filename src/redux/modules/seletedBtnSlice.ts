import { createSlice } from '@reduxjs/toolkit';

const initialState: string[] = [];

const selectedBtnSlice = createSlice({
  name: 'selected',
  initialState,
  reducers: {
    saveSelectedBtn: (state, action) => {
      return state.includes(action.payload)
        ? state.filter((item) => item !== action.payload)
        : [...state, action.payload];
    },
    resetSelectedBtn: (state) => {
      return (state = []);
    },
  },
});

export default selectedBtnSlice.reducer;
export const { saveSelectedBtn, resetSelectedBtn } = selectedBtnSlice.actions;
