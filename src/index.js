import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";
import { saveState } from "./localStorage";

store.subscribe(() => {
  saveState(store.getState());
  console.log("store updated: ", store.getState());
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

const resultArea = document.getElementById("jsResult");
const canvasArea = document.getElementById("jsCanvas");

let dropmsg = document.getElementById("dropmsg");
let lutmsg = document.getElementById("lutmsg");
let lutName = "default";
let dropbox;

dropbox = document.getElementById("dropbox");
dropbox.addEventListener("dragenter", dragenter, false);
dropbox.addEventListener("dragover", dragover, false);
dropbox.addEventListener("drop", drop, false);

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

function handleFiles(files) {
  console.log("handleFiles");
  const blobUrl = window.URL.createObjectURL(files[0]);
  console.log(typeof files[0].name);
  var filename = files[0].name;
  dropmsg.innerText = filename;
  //let inputFile = files[0].name;
  source.src = blobUrl;
}

let lutbox;

lutbox = document.getElementById("lutbox");
lutbox.addEventListener("dragenter", dragenter, false);
lutbox.addEventListener("dragover", dragover, false);
lutbox.addEventListener("drop", lutdrop, false);

function lutdrop(e) {
  e.stopPropagation();
  e.preventDefault();

  const dt = e.dataTransfer;
  const files = dt.files;
  console.log(files);
  handleLutFiles(files);
}

function handleLutFiles(files) {
  console.log("handleLUTFiles");
  const blobUrl = window.URL.createObjectURL(files[0]);
  var filename = files[0].name;
  lutmsg.innerText = filename;
  source.lut = blobUrl;
  lutName = filename; // !!error (이벤트 실행 시 재실행되어야 함)
  //lutmsg.innerText = files[0].name;
}

let lutOpacity = 0.7;
const rangeOpacity = document.getElementById("jsRange");
const rangeText = document.getElementById("rangeText");
rangeOpacity.addEventListener("input", handleRangeInput);
function handleRangeInput(event) {
  const opacityChange = event.target.value;
  console.log(opacityChange);
  lutOpacity = opacityChange;
  rangeText.innerText = lutOpacity;
}

// var imgSourceURL = "https://i.imgur.com/O69N3Ef.jpg";
// var imgSourceURL2 = "https://i.imgur.com/cxNplWF.jpeg";
// var imgSourceURL3 = "https://i.imgur.com/EdVe2Qp.jpeg";
// var imgSourceURL4 = "https://i.imgur.com/SqczR2o.jpeg";

// var lutSourceURL = "https://i.imgur.com/ncnPiqq.jpg";
// var lutSourceURL2 =
//   "https://drive.google.com/uc?export=view&id=13BlVKyqpf8Z7nP4J0BwTOmk3YpYV9yL-"; // 구글 드라이브 링크 변경 http://www.somanet.xyz/2017/06/blog-post_21.html

const imgSources = {
  test1: "https://i.imgur.com/O69N3Ef.jpg",
  night1:
    "http://drive.google.com/uc?export=view&id=11vhz8udKE0VXkufLK9o1NjMIKPrLtkpb",

  day1:
    "http://drive.google.com/uc?export=view&id=1CQAQAb9fW9DaZtt8AWqLmg4XhlTiLV8B",
};

const lutSources = {
  test1: "https://i.imgur.com/ncnPiqq.jpg",
  joyful1:
    "https://drive.google.com/uc?export=view&id=1Iw1gRnInNBNc-qsWIefZFPQ2DWepVWZV",
  joyful2:
    "https://drive.google.com/uc?export=view&id=1vUSyMblGqxjMALYXVNJjddAJGfWqIs0f",
  joyful3:
    "https://drive.google.com/uc?export=view&id=1-nyJ_PBgsnkx5l4Mj8XXraQE8l0PLl0C",
  joyful4:
    "https://drive.google.com/uc?export=view&id=1WNB3G9INvdpVuCnhy-Y_uIapC4HhQ5UC",
  joyful5:
    "https://drive.google.com/uc?export=view&id=16Ox7dNMbAUAbrKG05jWHKOsfQ7k2_PXY",
  metro1:
    "http://drive.google.com/uc?export=view&id=1B5TBN7UwixjRaEUZCT1XjHOJ0s66fGro",
  metro2:
    "http://drive.google.com/uc?export=view&id=1vQTpkfMLwm57UHZczy54l-kIyL_nwVR5",
  neon1:
    "http://drive.google.com/uc?export=view&id=1x4Fgv0JZt1crzgbjPURRkL0tMi5nCAlx",
  neon2:
    "http://drive.google.com/uc?export=view&id=1bdoV586oRkEUZA3ZFjOHNIOFJUwRFtma",
  neon3:
    "http://drive.google.com/uc?export=view&id=1fuoG6Io4pPyB1ZdlDxGHd_kR9SEZ4QPl",
  neon4:
    "http://drive.google.com/uc?export=view&id=1LkgT4kVqowcphC_ZrKoWbhjNaicbUQIT",
  neon5:
    "http://drive.google.com/uc?export=view&id=1VgTxvfdwy1UVxXEZcGvJ28oyvmpUkUK7",
  neon6:
    "http://drive.google.com/uc?export=view&id=1VgTxvfdwy1UVxXEZcGvJ28oyvmpUkUK7",
};

var sourceImage = document.createElement("img");
var lutImage = document.createElement("img");

//var LUT1 = null;
var imageDataWrapper = null;
var imageData = null;
//var imageData32 = null;
//var imageDataWrapper2 = null;
//var imageData2 = null;
//var imageData322 = null;
var imageDataWrapper3 = null;
var imageData3 = null;
//var imageData323 = null;

var c = document.createElement("canvas");
var ctx = c.getContext("2d");
canvasArea.appendChild(c);

var c2 = document.createElement("canvas");
var ctx2 = c2.getContext("2d");
canvasArea.appendChild(c2);

var lutCanvas = document.createElement("canvas");
lutCanvas.id = "lut_vas";
var lutCanvasContext = lutCanvas.getContext("2d");
canvasArea.appendChild(lutCanvas);

function openLut(props) {
  //clearLutCanvas(); // clear Canvas to LUT error fix
  //console.log("LUT Canvas CLEARED!");
  lutImage.crossOrigin = "Anonymous";
  lutImage.src = props.lut; //LUT URL
  lutImage.onload = openSource(props);
  lutImage.onerror = () => {
    errMSG.innerText = "Error occured loading LUT";
    errMSG.style.backgroundColor = "red";
  };
  //console.log("props lut:", props.lut);

  //console.log(lutImage);
  console.log("LUT loaded!");
}

// async function openSource(props) {
//   sourceImage.crossOrigin = "Anonymous";
//   const loadedSourceImg = await fetch(prop.src);
//   sourceImage.onload = processImage;
//   sourceImage.src = props.src; // IMAGE URL
//   console.log("Source loaded!");
// }

function openSource(props) {
  sourceImage.crossOrigin = "Anonymous";

  sourceImage.onload = processImage;
  sourceImage.onerror = () => {
    errMSG.innerText = "Error occured loading image";
    errMSG.style.backgroundColor = "red";
  };
  sourceImage.src = props.src; // IMAGE URL
  console.log("Source loaded!");
}

const errMSG = document.getElementById("jsError");

function processImage() {
  c.width = c2.width = sourceImage.width;
  c.height = c2.height = sourceImage.height;
  // ctx2.clearRect(0, 0, c2.width, c2.height);
  // console.log("canvas 2 Cleared!");

  lutCanvas.width = lutImage.width;
  lutCanvas.height = lutImage.height;
  if (lutCanvas.width == 0) {
    console.log("lut loading error");
    errMSG.innerText = "LUT is not loaded! Try again!";
    errMSG.style.backgroundColor = "red";
    return;
  }

  ctx.drawImage(sourceImage, 0, 0);

  imageDataWrapper = ctx.getImageData(0, 0, c.width, c.height);
  imageData = imageDataWrapper.data;
  console.log(imageData.length / 4);
  //imageData32 = new Uint32Array(imageData.buffer);
  //imageDataWrapper2 = ctx2.getImageData(0, 0, c2.width, c2.height);
  //imageData2 = imageDataWrapper2.data;
  //imageData322 = new Uint32Array(imageData2.buffer);

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
  //LUT1 = new Uint32Array(imageData.buffer);
  console.log("Processing Start!");
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
  errMSG.innerText = "Processing Completed!";
  errMSG.style.backgroundColor = "grey";
  canvasResizer();
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

  resultArea.appendChild(lutBtn);
  resultArea.appendChild(divEl);
  resultArea.appendChild(originalImg);
  resultArea.appendChild(resultImg);
}

function clearLutCanvas() {
  lutCanvasContext.clearRect(0, 0, lutCanvas.width, lutCanvas.height);
}

function canvasResizer() {
  console.log("resized!");
  c.style.width = c2.style.width = "50%";
  //c.style.height = c2.style.height = "600px";
  console.log(c.style.width);
}

var source = {
  src: imgSources.day1,
  lut: lutSources.joyful1,
};

function imgHandler(event) {}
function lutHandler(event) {}

const imgSelector = document.getElementById("img-select");
const lutSelector = document.getElementById("lut-select");
const lutBtn = document.getElementById("lutApply");
const lutUndoBtn = document.getElementById("lutUndo");

imgSelector.addEventListener("change", onImgSelect);
lutSelector.addEventListener("change", onLutSelect);
lutBtn.addEventListener("click", onClick);
lutUndoBtn.addEventListener("click", onUndo);

function onImgSelect(event) {
  //console.log(event.target.value);
  var eValue = event.target.value;
  source.src = imgSources[eValue];

  console.log(source.src);
}

function onLutSelect(event) {
  //console.log(event.target.value);
  var eValue = event.target.value;
  source.lut = lutSources[eValue];
  //console.log(typeof eValue);
  lutName = eValue;

  console.log(source.lut);
}

function onClick(event) {
  errMSG.innerText = "Processing...";
  errMSG.style.backgroundColor = "#006B54";
  //console.log(event);
  openLut(source);
}
function onUndo() {
  if (resultArea.lastChild) {
    resultArea.removeChild(resultArea.lastChild);
    resultArea.removeChild(resultArea.lastChild);
    resultArea.removeChild(resultArea.lastChild);
    resultArea.removeChild(resultArea.lastChild);
  } else {
    console.log("Nothing to Undo");
  }
}

function convertCanvasToImage(canvas) {
  var image = new Image();
  image.src = canvas.toDataURL("image/jpeg");
  return image;
}
