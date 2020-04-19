export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("state");
    console.log("firstload: ", serializedState);
    if (serializedState === null) {
      return {
        src: "https://i.imgur.com/BlUVaOM.jpg",
        srcname: "Sample",
        lut: "https://i.imgur.com/yKpfItb.jpg",
        lutname: "testLUT",
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
    console.log("saved state :", serializedState);
    localStorage.setItem("state", serializedState);
  } catch (err) {
    console.log("write error :");
  }
};
