import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import { connect } from "react-redux";
import "./Home.css";
import SampleImages from "../components/SampleImages";
import LutImages from "../components/LutImages";
import { selectSrc, selectLut } from "../store";
import InputRange from "react-input-range";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  root: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    border: 0,
    borderRadius: 20,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: "white",
    minWidth: "310px",
    height: 45,
    padding: "10px",
  },
});

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
  const imgInputEl = useRef();
  const lutInputEl = useRef();

  const [opacity, setOpacity] = useState(70); // InputRange Initial Value
  //const [srclist, setSrclist] = useState(null); // source image input and save to imgManagerSt
  //const [lutlist, setLutlist] = useState(null); // lut image input and save to imgManagerSt

  const classes = useStyles();

  console.log("imgManagerSt: ", imgManagerSt);
  console.log("imgManagerSt.src: ", imgManagerSt.src);
  console.log("imgManagerSt.lut: ", imgManagerSt.lut);

  // const source = {
  //   src: "https://i.imgur.com/BlUVaOM.jpg",
  //   lut: "https://i.imgur.com/yKpfItb.jpg",
  // };
  const onChange = (event) => {
    console.log("event: ", event);
    dropmsg.innerText = event.label;
    SrcReducer(event);
  };
  const onLutChange = (event) => {
    lutmsg.innerText = event.label;
    LutReducer(event);
  };

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

  let imgInput = null;
  let lutInput = null;

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

    // 파일 업로드 처리
    imgInput = imgInputEl.current;
    lutInput = lutInputEl.current;
    imgInput.addEventListener("change", uploadFile, false);
    lutInput.addEventListener("change", uploadLut, false);
  });

  function uploadFile(e) {
    const files = e.srcElement.files;
    handleFiles(files);
  }

  function uploadLut(e) {
    const files = e.srcElement.files;
    handleLutFiles(files);
  }

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
    handleFiles(files);
  }

  function lutdrop(e) {
    e.stopPropagation();
    e.preventDefault();
    const dt = e.dataTransfer;
    const files = dt.files;
    handleLutFiles(files);
  }

  function handleFiles(files) {
    //console.log("handleFiles");
    const blobUrl = window.URL.createObjectURL(files[0]);
    //console.log("filename:", files[0].name);
    var filename = files[0].name;
    dropmsg.innerText = filename;

    localStorage.setItem("srclist", files[0]);
    console.log("saved file :", localStorage.getItem("srclist"));
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

    LutReducer(dropFile);
  }

  function openLut() {
    lutImage.src = imgManagerSt.lut; //LUT URL
    lutImage.crossOrigin = "Anonymous";
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
  }

  function processImage() {
    c.width = c2.width = sourceImage.width;
    c.height = c2.height = sourceImage.height;

    lutCanvas.width = lutImage.width;
    lutCanvas.height = lutImage.height;
    if (lutCanvas.width === 0) {
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

    lutCanvasContext.drawImage(lutImage, 0, 0);
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
    //console.log(lutOpacity);

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
    //console.log("processing Done!");
    errMSG.innerText = "Processing Completed!";
    errMSG.style.backgroundColor = "grey";
    canvasResizer();

    // 결과물 출력 단계 (id 추가, 삭제하는 방법 고려)
    let originalImg = new Image();
    let resultImg = new Image();
    originalImg = convertCanvasToImage(c);
    resultImg = convertCanvasToImage(c2);
    originalImg.style.width = "50%";
    resultImg.style.width = "50%";

    let lutTitle = document.createTextNode(
      imgManagerSt.srcname.concat(
        " / LUT : ",
        imgManagerSt.lutname,
        " (",
        opacity,
        "%",
        ") ",
        " >>> ❌[DEL]"
      )
    );
    let resultBox = document.createElement("div");
    let divEl = document.createElement("div");
    let lutBtn = document.createElement("button");

    let resultId = Date.now();
    resultBox.id = resultId;
    lutBtn.id = resultId;

    lutBtn.appendChild(lutTitle);
    //console.log("firstChild", resultArea.firstChild);
    let firstResult = resultArea.firstChild;

    if (firstResult !== null) {
      resultArea.insertBefore(resultBox, resultArea.firstChild);
      //console.log("Inserted!");
    } else {
      resultArea.appendChild(resultBox);
    }

    //    resultArea.appendChild(resultBox);
    resultBox.appendChild(lutBtn);

    resultBox.appendChild(divEl);
    resultBox.appendChild(originalImg);
    resultBox.appendChild(resultImg);

    lutBtn.addEventListener("click", removeResult);
    lutBtn.className = "btn btn-2 btn-2d";

    //console.log("createad butn", lutBtn);
  }

  function removeResult(e) {
    //console.log("click!");
    let targetId = e.target.id;
    let targetEl = document.getElementById(targetId);
    //console.log(e.target.id);

    targetEl.parentNode.removeChild(targetEl);
  }

  function canvasResizer() {
    //console.log("resized!");
    c.style.width = c2.style.width = "50%";
    //c.style.height = c2.style.height = "600px";
    //console.log(c.style.width);
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
      <div id="dropbox" ref={dropboxEl}>
        <h2>
          <div id="dropmsg" ref={dropmsgEl}>
            🏞 Drag and drop / or upload a photo.
          </div>
        </h2>
        <form className="controls-stacked">
          <label className="file">
            <input
              ref={imgInputEl}
              id="file"
              name="imgInput"
              type="file"
              accept="image/png, image/jpeg"
            />
            <span className="file-custom file-source"></span>
          </label>
        </form>
      </div>
      <div id="lutbox" ref={lutboxEl}>
        <h2>
          <div id="lutmsg" ref={lutmsgEl}>
            🎨 Drag and drop / or upload a LUT file.
          </div>
        </h2>
        <form className="controls-stacked">
          <label className="file">
            <input
              ref={lutInputEl}
              id="file"
              name="lutinput"
              type="file"
              accept="image/png, image/jpeg"
            />
            <span className="file-custom file-lut"></span>
          </label>
        </form>
      </div>
      <div>
        <div className="selector selector--src">
          <label className="label label--selector" htmlFor="imgs">
            🏞Select a image
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
            🎨Select a LUT file
          </label>
          <Select options={lutList} id="luts" onChange={onLutChange} />
        </div>
      </div>
      <div>
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
      </div>
      <div className="controlBtnArea">
        {/* <button className="btn btn-2 btn-2d" onClick={onClick}>
          APPLY LUT{" "}
        </button> */}

        <Button className={classes.root} onClick={onClick}>
          Apply LUT
        </Button>
      </div>
      <div ref={errMsgEl} id="errMSG">
        Ready...
      </div>

      <div ref={canvasAreaEl} id="canvasArea" className="canvas fixedcanvas">
        <canvas ref={srcCanvasEl} id="srcCanvas" className="workCanvas" />
        <canvas ref={resultCanvasEl} id="resultCanvas" className="workCanvas" />
        <canvas ref={lutCanvasEl} id="lutCanvas" className="workCanvas" />
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
