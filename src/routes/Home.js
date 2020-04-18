import React, { useState, useRef } from "react";
import Select from "react-select";
import { connect } from "react-redux";
import "./Home.css";
import SampleImages from "../components/SampleImages";
import LutImages from "../components/LutImages";
import { selectSrc, selectLut } from "../store";
import useInput from "../components/useInput";

function mapper(obj) {
  let rObj = {};
  rObj.value = obj.url;
  rObj.label = obj.name;
  return rObj;
}

const imgList = SampleImages.map((obj) => mapper(obj));
const lutList = LutImages.map((obj) => mapper(obj));

function Home({ imgManagerSt, selectSrcSt, selectLutSt }) {
  // console.log("lco:", localStorage.getItem("state"));
  // localStorage.setItem("img", JSON.stringify(imgList));
  // console.log("imglist local", localStorage.getItem("img"));
  const range = useInput(0.7);

  const [lutstate, setLutstate] = useState({
    lut: "https://i.imgur.com/yKpfItb.jpg",
  });
  const [state, setState] = useState({
    src: "https://i.imgur.com/BlUVaOM.jpg",
  });
  console.log("imgManagerSt: ", imgManagerSt);
  console.log("imgManagertype: ", typeof imgManagerSt);

  const source = {
    src: "https://i.imgur.com/BlUVaOM.jpg",
    lut: "https://i.imgur.com/yKpfItb.jpg",
  };
  const onChange = (event) => {
    selectSrcSt(event);
  };
  const onLutChange = (event) => {
    selectLutSt(event);

    console.log("imgManagerSt: ", imgManagerSt);
    //state.lut = state.lut;
  };
  var lutOpacity = 0.7;
  var lutName = "default";

  var sourceImage = document.createElement("img");
  var lutImage = document.createElement("img");

  var imageDataWrapper = null;
  var imageData = null;
  var imageDataWrapper3 = null;
  var imageData3 = null;

  var c = document.createElement("canvas");
  var ctx = c.getContext("2d");
  document.body.appendChild(c);

  var c2 = document.createElement("canvas");
  var ctx2 = c2.getContext("2d");
  document.body.appendChild(c2);

  var lutCanvas = document.createElement("canvas");
  lutCanvas.id = "lut_vas";
  var lutCanvasContext = lutCanvas.getContext("2d");
  document.body.appendChild(lutCanvas);

  function openLut() {
    lutImage.src = lutstate.lut; //LUT URL
    lutImage.crossOrigin = "Anonymous";
    console.log("source lut", lutImage.src);

    console.log("LUT loaded!");
    lutImage.onload = openSource();
    lutImage.onerror = () => {
      errMsgEl.current.innerText = "Error occured loading LUT";
      errMsgEl.current.style.backgroundColor = "red";
    };
  }

  function openSource() {
    sourceImage.onload = processImage;
    sourceImage.onerror = () => {
      errMsgEl.current.innerText = "Error occured loading image";
      errMsgEl.current.style.backgroundColor = "red";
    };
    sourceImage.src = state.src; // IMAGE URL
    console.log("state:", state);
    console.log("sourceImage.src", sourceImage.src);
    sourceImage.crossOrigin = "Anonymous";

    console.log("Source loaded!");
  }

  const errMsgEl = useRef();
  //const errMSG = errMsgEl.current;

  const resultAreaEl = useRef();
  //const resultArea = resultAreaEl.current;

  const imgSelectEl = useRef();

  function processImage() {
    c.width = c2.width = sourceImage.width;
    c.height = c2.height = sourceImage.height;
    // ctx2.clearRect(0, 0, c2.width, c2.height);
    // console.log("canvas 2 Cleared!");

    lutCanvas.width = lutImage.width;
    lutCanvas.height = lutImage.height;
    if (lutCanvas.width === 0) {
      console.log("lut loading error");
      errMsgEl.current.innerText = "LUT is not loaded! Try again!";
      errMsgEl.current.style.backgroundColor = "red";
      return;
    }

    ctx.drawImage(sourceImage, 0, 0);

    imageDataWrapper = ctx.getImageData(0, 0, c.width, c.height);
    imageData = imageDataWrapper.data;
    console.log(imageData.length / 4);

    lutCanvasContext.drawImage(lutImage, 0, 0);
    // this error occurs wrong result!!
    try {
      imageDataWrapper3 = lutCanvasContext.getImageData(
        0,
        0,
        lutCanvas.width,
        lutCanvas.height
      );
    } catch (err) {
      console.log(err);
      errMsgEl.current.innerText = err;
      errMsgEl.current.style.backgroundColor = "red";
    }

    imageData3 = imageDataWrapper3.data;

    console.log(lutOpacity);

    for (var i = 0; i < imageData.length; i += 4) {
      //console.log("rendering...");
      var r = Math.floor(imageData[i] / 4);
      var g = Math.floor(imageData[i + 1] / 4);
      var b = Math.floor(imageData[i + 2] / 4);
      var lutX = (b % 8) * 64 + r;
      var lutY = Math.floor(b / 8) * 64 + g;
      var lutIndex = (lutY * 512 + lutX) * 4;

      imageData[i] =
        imageData3[lutIndex] * lutOpacity + imageData[i] * (1 - lutOpacity);
      imageData[i + 1] =
        imageData3[lutIndex + 1] * lutOpacity +
        imageData[i + 1] * (1 - lutOpacity);
      imageData[i + 2] =
        imageData3[lutIndex + 2] * lutOpacity +
        imageData[i + 2] * (1 - lutOpacity);

      // imageData[i] = imageData3[lutIndex];
      // imageData[i + 1] = imageData3[lutIndex + 1];
      // imageData[i + 2] = imageData3[lutIndex + 2];
    }
    //complete and refresh UI
    ctx2.putImageData(imageDataWrapper, 0, 0);
    console.log("processing Done!");
    errMsgEl.current.innerText = "Processing Completed!";
    errMsgEl.current.style.backgroundColor = "grey";
    //canvasResizer();
    var originalImg = new Image();
    var resultImg = new Image();
    originalImg = convertCanvasToImage(c);
    resultImg = convertCanvasToImage(c2);
    originalImg.style.width = "50%";
    resultImg.style.width = "50%";

    var lutTitle = document.createTextNode(lutName.concat(" : ", lutOpacity));
    var lutBtn = document.createElement("button");
    var divEl = document.createElement("div");
    lutBtn.appendChild(lutTitle);

    resultAreaEl.current.appendChild(lutBtn);
    resultAreaEl.current.appendChild(divEl);
    resultAreaEl.current.appendChild(originalImg);
    resultAreaEl.current.appendChild(resultImg);
  }
  //   useEffect(() => {
  //     console.log(imgSelectEl.current.onChange);
  //   });

  function convertCanvasToImage(canvas) {
    var image = new Image();
    image.src = canvas.toDataURL("image/jpeg");
    return image;
  }

  //   function createDOMRef() {
  //     console.log(errMsgEl, resultAreaEl);
  //   }

  function onClick(event) {
    errMsgEl.current.innerText = "Processing...";
    errMsgEl.current.style.backgroundColor = "#006B54";
    //console.log(event);
    openLut(source);
  }

  return (
    <>
      <div className="title">3D LUT React App</div>
      <div>
        <label htmlFor="imgs">Choose a Sample</label>
        <Select
          options={imgList}
          ref={imgSelectEl}
          onChange={onChange}
          name="imgs"
        />
        <label htmlFor="luts">Choose a LUT</label>
        <Select options={lutList} name="luts" onChange={onLutChange} />
      </div>

      <div ref={errMsgEl} id="errMSG">
        Ready...
      </div>
      <div class="controls__range">
        Opacity :
        <input
          type="range"
          id="jsRange"
          min="0.0"
          max="1.0"
          value="0.7"
          step="0.1"
        />
        <input placeholder="Name" {...range} />
        <span id="rangeText">0.7</span>
      </div>
      <button onClick={onClick}>Apply LUT</button>
      <div ref={resultAreaEl} id="resultArea" />
    </>
  );
}

// store 에서 statue 받아서 props 로 넘겨주는 함수
function mapStateToProps(state) {
  return { imgManagerSt: state };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    selectSrcSt: (value) => dispatch(selectSrc(value, ownProps)),
    selectLutSt: (value) => dispatch(selectLut(value, ownProps)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
