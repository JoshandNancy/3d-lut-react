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
        srclist: state.srclist,
        lutlist: state.lutlist,
        profile: state.profile,
        quality: state.quality,
      };
    },
    selectLut: (state, action) => {
      return {
        src: state.src,
        srcname: state.srcname,
        lut: action.payload.value,
        lutname: action.payload.label,
        srclist: state.srclist,
        lutlist: state.lutlist,
        profile: state.profile,
        quality: state.quality,
      };
    },
    updateSrcList: (state, action) => {
      //console.log("updateSrcList action.payload :", action.payload);
      return {
        src: state.src,
        srcname: state.srcname,
        lut: state.lut,
        lutname: state.lutname,
        srclist: [...state.srclist, action.payload],
        lutlist: state.lutlist,
        profile: state.profile,
        quality: state.quality,
      };
    },

    updateLutList: (state, action) => {
      //console.log("updateSrcList action.payload :", action.payload);
      return {
        src: state.src,
        srcname: state.srcname,
        lut: state.lut,
        lutname: state.lutname,
        srclist: state.srclist,
        lutlist: [...state.lutlist, action.payload],
        profile: state.profile,
        quality: state.quality,
      };
    },

    selectProfile: (state, action) => {
      return {
        src: state.src,
        srcname: state.srcname,
        lut: state.lut,
        lutname: state.lutname,
        srclist: state.srclist,
        lutlist: state.lutlist,
        profile: action.payload,
        quality: state.quality,
      };
    },

    selectQuality: (state, action) => {
      return {
        src: state.src,
        srcname: state.srcname,
        lut: state.lut,
        lutname: state.lutname,
        srclist: state.srclist,
        lutlist: state.lutlist,
        profile: state.profile,
        quality: { url: action.payload.url, name: action.payload.name },
      };
    },
  },
});

export const {
  selectSrc,
  selectLut,
  updateSrcList,
  updateLutList,
  selectProfile,
  selectQuality,
} = imgManager.actions;

export default configureStore({ reducer: imgManager.reducer });
