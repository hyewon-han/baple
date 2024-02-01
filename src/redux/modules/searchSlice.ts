import { createSlice } from '@reduxjs/toolkit';

const initialState = '';

const searchSlice = createSlice({
  name: 'searchValue',
  initialState,
  reducers: {
    saveSearchValue: (state, action) => {
      return (state = action.payload);
    },
  },
});

export default searchSlice.reducer;
export const { saveSearchValue } = searchSlice.actions;
