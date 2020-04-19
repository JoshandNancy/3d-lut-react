import { configureStore, createSlice } from "@reduxjs/toolkit";
import { loadState } from "./localStorage";

const persistedState = loadState();

const imgManager = createSlice({
  name: "imgManager",
  initialState: persistedState,
  reducers: {
    selectSrc: (state, action) => {
      return {
        src: action.payload.value,
        srcname: action.payload.label,
        lut: state.lut,
        lutname: state.lutname,
      };
    },
    selectLut: (state, action) => {
      return {
        src: state.src,
        srcname: state.srcname,
        lut: action.payload.value,
        lutname: action.payload.label,
      };
    },
  },
});

export const { selectSrc, selectLut } = imgManager.actions;

export default configureStore({ reducer: imgManager.reducer });
