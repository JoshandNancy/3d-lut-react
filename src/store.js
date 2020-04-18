import { configureStore, createSlice } from "@reduxjs/toolkit";
import { loadState } from "./localStorage";

const persistedState = loadState();

const imgManager = createSlice(
  {
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
  }
  //   {
  //     name: "inputManager",
  //     initialState: [],
  //     reducers: {
  //       addFile: (state, action) => {
  //         const { filename, data } = action.payload;
  //         state.push({ filename, data });
  //       },
  //       removeFile: (state, action) => {
  //         const { filename } = action.payload;
  //         state.filter((file) => file.filename !== filename);
  //       },
  //     },
  //   }
);

export const { selectSrc, selectLut } = imgManager.actions;
//export const { addFile, removeFile } = inputManager.actions;

export default configureStore({ reducer: imgManager.reducer });
