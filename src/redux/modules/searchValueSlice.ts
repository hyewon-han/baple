import { createSlice } from '@reduxjs/toolkit';

const initialState = '';

const searchValueSlice = createSlice({
  name: 'searchValue',
  initialState,
  reducers: {
    setSearchValue: (state, action) => {
      return (state = action.payload);
    },
  },
});

export default searchValueSlice.reducer;
export const { setSearchValue } = searchValueSlice.actions;
