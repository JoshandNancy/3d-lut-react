//import PropTypes from "prop-types";
import SampleImages from "./components/SampleImages";
import LutImages from "./components/LutImages";
import config from "./components/cloudinary_config";

export const loadState = () => {
  try {
    const initialSampleList = SampleImages;
    const initialLutList = LutImages;
    const initialProfile = "merlin";
    const serializedState = localStorage.getItem("state");
    const initialQuaility = {
      url: config.cloud_1024_download_url,
      name: "1024",
    };

    //const fileStorage = localStorage.getItem("srclist");
    console.log("firstloadQuality: ", initialQuaility);
    if (serializedState === null) {
      return {
        src: "https://i.imgur.com/BlUVaOM.jpg",
        srcname: "Sample",
        lut: "https://i.imgur.com/yKpfItb.jpg",
        lutname: "testLUT",
        srclist: initialSampleList,
        lutlist: initialLutList,
        profile: initialProfile,
        quality: initialQuaility,
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    //console.log("saved state :", serializedState);
    localStorage.setItem("state", serializedState);
  } catch (err) {
    console.log("write error :");
  }
};

export const clearState = () => {
  localStorage.clear();
};

// serializedState.propTypes = {
//   src: PropTypes.string.isRequired,
//   srcname: PropTypes.string.isRequired,
//   lut: PropTypes.string.isRequired,
//   lutname: PropTypes.string.isRequired,
// };
