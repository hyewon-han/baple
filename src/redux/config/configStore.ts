import auth from '../../redux/modules/authSlice';
import { configureStore } from '@reduxjs/toolkit';
import placesData from '../modules/placesDataSlice';
import search from '../modules/searchSlice';
import selectedBtn from '../modules/seletedBtnSlice';
import selectedCity from '../modules/selectedCitySlice';

export type RootState = ReturnType<typeof store.getState>;
const store = configureStore({
  reducer: { auth, placesData, search, selectedBtn, selectedCity },
});
export default store;

const onChange = () => {
  // console.log('리덕스스토어', store.getState());
};

store.subscribe(onChange);
