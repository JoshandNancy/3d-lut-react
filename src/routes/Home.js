import React, { useState, useRef, useEffect } from "react";

import Select from "react-select";
import { connect } from "react-redux";
import "./Home.css";
import SampleImages from "../components/SampleImages";
import LutImages from "../components/LutImages";
import { selectSrc, selectLut } from "../store";
import InputRange from "react-input-range";

function selectMapper(obj) {
  let rObj = {};
  rObj.value = obj.url;
  rObj.label = obj.name;
  return rObj;
}

const imgList = SampleImages.map((obj) => selectMapper(obj));
const lutList = LutImages.map((obj) => selectMapper(obj));

// imgMananerSt : 이미지 관리 스테이트 , SrcReducer / LutReducer > 스토어 리듀서로 보내는 연결 함수
function Home({ imgManagerSt, SrcReducer, LutReducer }) {
  const errMsgEl = useRef();
  const resultAreaEl = useRef();
  const imgSelectEl = useRef();
  const canvasAreaEl = useRef();
  const srcCanvasEl = useRef();
  const resultCanvasEl = useRef();
  const lutCanvasEl = useRef();
  const dropboxEl = useRef();
  const lutboxEl = useRef();
  const dropmsgEl = useRef();
  const lutmsgEl = useRef();

  const [opacity, setOpacity] = useState(70); // InputRange Initial Value

  console.log("imgManagerSt: ", imgManagerSt);
  console.log("imgManagerSt.src: ", imgManagerSt.src);
  console.log("imgManagerSt.lut: ", imgManagerSt.lut);

  // const source = {
  //   src: "https://i.imgur.com/BlUVaOM.jpg",
  //   lut: "https://i.imgur.com/yKpfItb.jpg",
  // };
  const onChange = (event) => {
    console.log("event: ", event);
    SrcReducer(event);
  };
  const onLutChange = (event) => {
    LutReducer(event);
  };

  let lutName = "default";

  let sourceImage = document.createElement("img");
  let lutImage = document.createElement("img");

  let imageDataWrapper = null;
  let imageData = null;
  let imageDataWrapper3 = null;
  let imageData3 = null;

  // 캔버스 초기화
  let c = null;
  let ctx = null;
  let c2 = null;
  let ctx2 = null;
  let lutCanvas = null;
  let lutCanvasContext = null;

  // 파일 드롭 영역 초기화
  let dropbox = null;
  let dropmsg = null;
  let lutbox = null;
  let lutmsg = null;

  let resultArea = null;
  let errMSG = null;

  useEffect(() => {
    c = srcCanvasEl.current;
    if (c) {
      ctx = c.getContext("2d");
    }
    c2 = resultCanvasEl.current;
    if (c2) {
      ctx2 = c2.getContext("2d");
    }
    lutCanvas = lutCanvasEl.current;
    if (lutCanvas) {
      lutCanvasContext = lutCanvas.getContext("2d");
    }
    errMSG = errMsgEl.current;
    errMSG.style.backgroundColor = "#006B54";
    errMSG.style.color = "white";

    dropbox = dropboxEl.current;
    dropbox.addEventListener("dragenter", dragenter, false);
    dropbox.addEventListener("dragover", dragover, false);
    dropbox.addEventListener("drop", drop, false);

    dropmsg = dropmsgEl.current;

    lutbox = lutboxEl.current;
    lutbox.addEventListener("dragenter", dragenter, false);
    lutbox.addEventListener("dragover", dragover, false);
    lutbox.addEventListener("drop", lutdrop, false);

    lutmsg = lutmsgEl.current;

    resultArea = resultAreaEl.current;
  });

  function dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function dragover(e) {
    e.stopPropagation();
    e.preventDefault();
  }
  function drop(e) {
    e.stopPropagation();
    e.preventDefault();

    const dt = e.dataTransfer;
    const files = dt.files;
    console.log(files);
    handleFiles(files);
  }

  function lutdrop(e) {
    e.stopPropagation();
    e.preventDefault();

    const dt = e.dataTransfer;
    const files = dt.files;
    console.log(files);
    handleLutFiles(files);
  }

  function handleFiles(files) {
    console.log("handleFiles");
    const blobUrl = window.URL.createObjectURL(files[0]);
    console.log("filename:", files[0].name);
    var filename = files[0].name;
    dropmsg.innerText = filename;
    const dropFile = {
      value: blobUrl,
      label: filename,
    };

    SrcReducer(dropFile);
  }
  function handleLutFiles(files) {
    const blobUrl = window.URL.createObjectURL(files[0]);
    console.log("filename:", files[0].name);
    var filename = files[0].name;
    lutmsg.innerText = filename;
    const dropFile = {
      value: blobUrl,
      label: filename,
    };
    lutName = filename;

    LutReducer(dropFile);
  }

  function openLut() {
    lutImage.src = imgManagerSt.lut; //LUT URL
    lutImage.crossOrigin = "Anonymous";

    console.log("LUT loaded!");
    lutImage.onload = openSource();
    lutImage.onerror = () => {
      errMSG.innerText = "Error occured loading LUT";
      errMSG.style.backgroundColor = "red";
    };
  }

  function openSource() {
    sourceImage.onload = processImage;
    sourceImage.onerror = () => {
      errMSG.innerText = "Error occured loading image";
      errMSG.style.backgroundColor = "red";
    };
    sourceImage.src = imgManagerSt.src; // IMAGE URL

    sourceImage.crossOrigin = "Anonymous";

    console.log("Source loaded!");
  }

  function processImage() {
    c.width = c2.width = sourceImage.width;
    c.height = c2.height = sourceImage.height;

    lutCanvas.width = lutImage.width;
    lutCanvas.height = lutImage.height;
    if (lutCanvas.width === 0) {
      console.log("lut loading error");
      errMSG.innerText = "LUT is not loaded! Try again!";
      errMSG.style.backgroundColor = "red";
      return;
    }

    ctx.drawImage(sourceImage, 0, 0);
    try {
      imageDataWrapper = ctx.getImageData(0, 0, c.width, c.height);
    } catch (err) {
      console.log(err);
      errMSG.innerText = err;
      errMSG.style.backgroundColor = "red";
    }
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
      errMSG.innerText = err;
      errMSG.style.backgroundColor = "red";
    }

    imageData3 = imageDataWrapper3.data;
    let lutOpacity = opacity / 100;
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
    }
    //complete and refresh UI
    ctx2.putImageData(imageDataWrapper, 0, 0);
    console.log("processing Done!");
    errMSG.innerText = "Processing Completed!";
    errMSG.style.backgroundColor = "grey";
    canvasResizer();
    var originalImg = new Image();
    var resultImg = new Image();
    originalImg = convertCanvasToImage(c);
    resultImg = convertCanvasToImage(c2);
    originalImg.style.width = "50%";
    resultImg.style.width = "50%";

    var lutTitle = document.createTextNode(lutName.concat(" : ", opacity, "%"));
    var lutBtn = document.createElement("button");
    var divEl = document.createElement("div");
    lutBtn.appendChild(lutTitle);

    resultArea.appendChild(lutBtn);
    resultArea.appendChild(divEl);
    resultArea.appendChild(originalImg);
    resultArea.appendChild(resultImg);
  }

  function onUndo() {
    if (resultArea.lastChild) {
      resultArea.removeChild(resultArea.lastChild);
      resultArea.removeChild(resultArea.lastChild);
      resultArea.removeChild(resultArea.lastChild);
      resultArea.removeChild(resultArea.lastChild);
    } else {
      console.log("Nothing to Undo");
      errMSG.innerText = "Nothing to Undo.";
      errMSG.style.backgroundColor = "orange";
    }
  }

  function canvasResizer() {
    console.log("resized!");
    c.style.width = c2.style.width = "50%";
    //c.style.height = c2.style.height = "600px";
    console.log(c.style.width);
  }

  function convertCanvasToImage(canvas) {
    var image = new Image();
    image.src = canvas.toDataURL("image/jpeg");
    return image;
  }

  function onClick(event) {
    errMsgEl.current.innerText = "Processing...";
    errMsgEl.current.style.backgroundColor = "#006B54";

    openLut();
  }

  return (
    <>
      <div className="title">3D LUT React App</div>
      <div className="selector selector--src">
        <label className="label label--selector" htmlFor="imgs">
          Choose a Sample
        </label>
        <Select
          options={imgList}
          ref={imgSelectEl}
          onChange={onChange}
          id="imgs"
        />
      </div>
      <div className="selector selector--lut">
        <label className="label label--selector" htmlFor="luts">
          Choose a LUT
        </label>
        <Select options={lutList} id="luts" onChange={onLutChange} />
      </div>
      <div id="dropbox" ref={dropboxEl}>
        <h2>
          <div id="dropmsg" ref={dropmsgEl}>
            Drag and Drop Image File HERE! <br />*<br />*<br />*<br />*<br />
            Image DropZone
            <br />
          </div>
        </h2>
      </div>
      <div id="lutbox" ref={lutboxEl}>
        <h2>
          <div id="lutmsg" ref={lutmsgEl}>
            Drag and Drop LUT File HERE! <br />*<br />*<br />*<br />*<br />
            LUT DropZone
            <br />
          </div>
        </h2>
      </div>
      <form className="form">
        <label>[ LUT Opacity ]</label>
        <InputRange
          formatLabel={(opacity) => `${opacity} %`}
          minValue={0}
          maxValue={100}
          step={5}
          value={opacity}
          onChange={(opacity) => {
            setOpacity(opacity);
          }}
        />
      </form>
      <div ref={errMsgEl} id="errMSG">
        Ready...
      </div>
      <button onClick={onClick}>Apply LUT</button>{" "}
      <button onClick={onUndo}>Undo</button>
      <div ref={canvasAreaEl} id="canvasArea" className="canvas fixedcanvas">
        <canvas ref={srcCanvasEl} id="srcCanvas" />
        <canvas ref={resultCanvasEl} id="resultCanvas" />
        <canvas ref={lutCanvasEl} id="lutCanvas" />
      </div>
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
    SrcReducer: (value) => dispatch(selectSrc(value, ownProps)),
    LutReducer: (value) => dispatch(selectLut(value, ownProps)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
