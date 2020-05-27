import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import { connect } from "react-redux";
import "./Home.css";
import {
  selectSrc,
  selectLut,
  updateSrcList,
  updateLutList,
  selectProfile,
  selectQuality,
} from "../store";
import InputRange from "react-input-range";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import axios from "axios";
import config from "../components/cloudinary_config";
import { clearState } from "../localStorage";
import qs from "qs"; // Axios 중복제거용 querysting parsing & stringifying library
import SampleImages from "../components/SampleImages";
import LutImages from "../components/LutImages";
//import { RadioGroup, RadioButton } from "react-radio-buttons";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
//import FormLabel from "@material-ui/core/FormLabel";
//import Canvas from "context-blender";

//https://github.com/Phrogz/context-blender

const {
  cloudName,
  cloud_default_url,
  cloud_1024_download_url,
  cloud_2048_download_url,
} = config;

const themeColors = {
  ready_green: "#00A780",
  ready_teal: "#006b54",
  dropbox_default: "#fa7268",
  lutbox_default: "#004680",
  progress_default: "#ff5533",
  processing_yellow: "#FFCD00",
};

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
  profile_button: {
    background: "linear-gradient(90deg, #FF8E99 30%, #FF6B8B 90%)",
    border: 0,
    borderRadius: 10,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: "white",
    minWidth: "100px",
    height: 45,
    padding: "15px",
  },
});

export function selectMapper(obj) {
  let rObj = {};
  //console.log("obj error: ", obj);
  rObj.value = obj.url;
  rObj.label = obj.name;
  return rObj;
}

export function saveMapper(obj) {
  let rrObj = {};
  rrObj.url = obj.value;
  rrObj.name = obj.label;
  return rrObj;
}

// imgMananerSt : 이미지 관리 스테이트 , SrcReducer / LutReducer > 스토어 리듀서로 보내는 연결 함수
function Home({
  imgManagerSt,
  SrcReducer,
  LutReducer,
  SrcListReducer,
  LutListReducer,
  ProfileReducer,
  QualityReducer,
}) {
  const errMsgEl = useRef();
  const resultAreaEl = useRef();
  //const imgSelectEl = useRef();
  const canvasAreaEl = useRef();
  const srcCanvasEl = useRef();
  const resultCanvasEl = useRef();
  const lutCanvasEl = useRef();
  const textureCanvasEl = useRef();
  const dropboxEl = useRef();
  const lutboxEl = useRef();
  const dropmsgEl = useRef();
  const lutmsgEl = useRef();
  const imgInputEl = useRef();
  const lutInputEl = useRef();

  const classes = useStyles();

  const onChange = (event) => {
    dropmsg.innerText = event.label;
    dropbox.style.backgroundColor = themeColors.ready_green;
    SrcReducer(event); // 소스 파일 업데이트
    //console.log("Select Event:", event);
  };
  const onLutChange = (event) => {
    lutmsg.innerText = event.label;
    LutReducer(event);
    lutbox.style.backgroundColor = themeColors.ready_green;
  };

  const onProfileChange = (event) => {
    //console.log(event);
    setProfile(event.target.value);
    ProfileReducer(event.target.value);
  };

  const onQualityChange = (event) => {
    //console.log(event);
    let selectedQuality = null;
    if (event.target.value === "1024") {
      selectedQuality = {
        url: cloud_1024_download_url,
        name: event.target.value,
      };
      setQuality(selectedQuality);
      QualityReducer(selectedQuality);
    } else if (event.target.value === "2048") {
      selectedQuality = {
        url: cloud_2048_download_url,
        name: event.target.value,
      };
      setQuality(selectedQuality);
      QualityReducer(selectedQuality);
    } else {
      selectedQuality = { url: cloud_default_url, name: "Full" };
      setQuality(selectedQuality);
      QualityReducer(selectedQuality);
    }
    console.log(event.target.value);
  };

  const handleTexture = (event) => {
    setIsTextureOn(event.target.checked);
  };

  const handleVig = (event) => {
    setIsVigOn(event.target.checked);
  };

  const [opacity, setOpacity] = useState(70); // InputRange Initial Value
  const [profile, setProfile] = useState(imgManagerSt.profile);
  const [quality, setQuality] = useState({
    url: cloud_1024_download_url,
    name: "1024",
  });
  const [isTextureOn, setIsTextureOn] = useState(false);
  const [isVigOn, setIsVigOn] = useState(false);

  let sourceImage = document.createElement("img");
  let lutImage = document.createElement("img");
  let textureImage = document.createElement("img");
  let vigImage = document.createElement("img");

  let imageDataWrapper = null;
  let imageData = null;
  let imageDataWrapper3 = null;
  let imageData3 = null;

  let imageDataWrapper4 = null;
  let imageData4 = null;

  // 캔버스 초기화
  let c = null;
  let ctx = null;
  let c2 = null;
  let ctx2 = null;
  let lutCanvas = null;
  let lutCanvasContext = null;
  let textureCanvas = null;
  let textureCanvasContext = null;

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
    textureCanvas = textureCanvasEl.current;
    if (textureCanvas) {
      textureCanvasContext = textureCanvas.getContext("2d");
    }
    errMSG = errMsgEl.current;
    errMSG.style.backgroundColor = themeColors.ready_teal;
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

    if (imgManagerSt !== null) {
      setProfile(imgManagerSt.profile);
    }
    // 마지막 저장한 아이템 선택
    // console.log(
    //   "last item:",
    //   imgManagerSt.srclist[imgManagerSt.srclist.length - 1]
    // );
    // if (imgManagerSt === null || imgManagerSt.srclist.length !== 0) {
    //   SrcReducer(imgManagerSt.srclist[imgManagerSt.srclist.length - 1]);
    // }
  });

  function uploadFile(e) {
    const files = e.srcElement.files;
    //cloudUploadFile(files[0]);
    cloudPostFile(files[0]);
    //postAndGetURL(files[0]);
  }

  function uploadLut(e) {
    const files = e.srcElement.files;
    //cloudUploadLutFile(files[0]);
    cloudPostLutFile(files[0]);
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
    cloudPostFile(files[0]);
  }

  function lutdrop(e) {
    e.stopPropagation();
    e.preventDefault();
    const dt = e.dataTransfer;
    const files = dt.files;
    cloudPostLutFile(files[0]);
  }

  function openLut() {
    lutImage.src = imgManagerSt.lut; //LUT URL
    lutImage.crossOrigin = "Anonymous";
    lutImage.onload = openSource();
    lutImage.onerror = () => {
      errMSG.innerText = "Error occured loading LUT";
      errMSG.style.backgroundColor = "red";
      return;
    };
  }

  function openSource() {
    sourceImage.src = imgManagerSt.src; // IMAGE URL
    sourceImage.crossOrigin = "Anonymous";
    sourceImage.onload = openTexture;
    sourceImage.onerror = () => {
      errMSG.innerText = "Error occured loading image";
      errMSG.style.backgroundColor = "red";
      return;
    };
  }

  function openTexture() {
    let srcWidth = sourceImage.width;
    let srcHeight = sourceImage.height;
    let alpha = 100; // 그레인 알파값 - 현재는 비정상적으로 동작함 (context-blender 알고리즘 이슈)

    let textureURL = `https://res.cloudinary.com/joshandnancy/w_${srcWidth},h_${srcHeight},o_${alpha}/TEXTURES/GRAIN_50.jpg`;
    //console.log("texture URL", textureURL);
    textureImage.src = textureURL;
    textureImage.crossOrigin = "Anonymous";
    textureImage.onload = openVig;
    textureImage.onerror = () => {
      errMSG.innerText = "Error occured loading texture";
      errMSG.style.backgroundColor = "red";
    };
  }
  function openVig() {
    let srcWidth = sourceImage.width;
    let srcHeight = sourceImage.height;
    let alpha = 50; //비네팅 알파값

    let vigURL = `https://res.cloudinary.com/joshandnancy/w_${srcWidth},h_${srcHeight},o_${alpha}/TEXTURES/VIGNETTE.jpg`;
    //console.log("texture URL", vigURL);
    vigImage.src = vigURL;
    vigImage.crossOrigin = "Anonymous";
    vigImage.onload = processImage;
    vigImage.onerror = () => {
      errMSG.innerText = "Error occured loading vignette";
      errMSG.style.backgroundColor = "red";
      return;
    };
  }
  // LUT 연산 부분
  function processImage() {
    c.width = c2.width = textureCanvas.width = sourceImage.width;
    c.height = c2.height = textureCanvas.height = sourceImage.height;

    if (c.width === 0) {
      errMSG.innerText = "Image is not loaded! Try again!";
      errMSG.style.backgroundColor = "red";
      return;
    }

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
      console.log("ctx.getImageData error :", err);
      errMSG.innerText = err;
      errMSG.style.backgroundColor = "red";
      return;
    }
    try {
      imageData = imageDataWrapper.data;
    } catch (err) {
      console.log("ImageDataWrapper error :", err);
      errMSG.innerText = err;
      errMSG.style.backgroundColor = "red";
      return;
    }

    lutCanvasContext.drawImage(lutImage, 0, 0);
    try {
      imageDataWrapper3 = lutCanvasContext.getImageData(
        0,
        0,
        lutCanvas.width,
        lutCanvas.height
      );
    } catch (err) {
      console.log("lutCanvas ImageData wapper error :", err);
      errMSG.innerText = err;
      errMSG.style.backgroundColor = "red";
      return;
    }
    try {
      imageData3 = imageDataWrapper3.data;
    } catch (err) {
      console.log("imageDataWrapper3 to imageData3 error :", err);
      errMSG.innerText = err;
      errMSG.style.backgroundColor = "red";
      return;
    }
    let lutOpacity = opacity / 100;
    //console.log(lutOpacity);
    if (imageData === null) {
      errMSG.innerText = "Image is not loaded!";
      errMSG.style.backgroundColor = "red";
      return;
    }

    try {
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
    } catch (err) {
      console.log(err);
      errMSG.innerText = err;
      errMSG.style.backgroundColor = "red";
      return;
    }
    //complete and refresh UI

    if (isTextureOn) {
      textureCanvasContext.drawImage(textureImage, 0, 0);
      try {
        imageDataWrapper4 = textureCanvasContext.getImageData(
          0,
          0,
          textureCanvas.width,
          textureCanvas.height
        );
      } catch (err) {
        console.log(err);
        errMSG.innerText = err;
        errMSG.style.backgroundColor = "red";
        return;
      }
      try {
        imageData4 = imageDataWrapper4.data;
      } catch (err) {
        console.log(err);
        errMSG.innerText = err;
        errMSG.style.backgroundColor = "red";
        return;
      }
      //overlay algorithm here // from https://github.com/Phrogz/context-blender
      function Foverlay(a, b) {
        return a < 128
          ? (a * b) >> 7 // (2*a*b)>>8 :
          : 255 - (((255 - b) * (255 - a)) >> 7);
      }

      try {
        for (var i = 0; i < imageData.length; i += 4) {
          //console.log("rendering...");
          var r = imageData[i],
            g = imageData[i + 1],
            b = imageData[i + 2];

          var r2 = imageData4[i],
            g2 = imageData4[i + 1],
            b2 = imageData4[i + 2];

          let sA = imageData4[i + 3] / 255,
            dA = imageData[i + 3] / 255;

          var f1 = dA * sA,
            f2 = dA - f1,
            f3 = sA - f1;

          imageData[i] = f1 * Foverlay(r, r2) + f2 * r + f3 * r2;
          imageData[i + 1] = f1 * Foverlay(g, g2) + f2 * g + f3 * g2;
          imageData[i + 2] = f1 * Foverlay(b, b2) + f2 * b + f3 * b2;
        }
      } catch (err) {
        console.log(err);
        errMSG.innerText = err;
        errMSG.style.backgroundColor = "red";
        return;
      }

      //ctx2.putImageData(imageDataWrapper, 0, 0);
    }

    if (isVigOn) {
      textureCanvasContext.drawImage(vigImage, 0, 0);
      try {
        imageDataWrapper4 = textureCanvasContext.getImageData(
          0,
          0,
          textureCanvas.width,
          textureCanvas.height
        );
      } catch (err) {
        console.log(err);
        errMSG.innerText = err;
        errMSG.style.backgroundColor = "red";
        return;
      }
      try {
        imageData4 = imageDataWrapper4.data;
      } catch (err) {
        console.log(err);
        errMSG.innerText = err;
        errMSG.style.backgroundColor = "red";
        return;
      }
      //multiply algorithm here // from https://github.com/Phrogz/context-blender
      try {
        for (var i = 0; i < imageData.length; i += 4) {
          //console.log("rendering...");
          var r = imageData[i];
          var g = imageData[i + 1];
          var b = imageData[i + 2];

          var r2 = imageData4[i];
          var g2 = imageData4[i + 1];
          var b2 = imageData4[i + 2];

          let sA = imageData[i + 3] / 255;
          let dA = imageData4[i + 3] / 255; // 알파값

          let dA2 = sA + dA - sA * dA;
          let sRA = (r2 / 255) * sA;
          let dRA = (r / 255) * dA;
          let sGA = (g2 / 255) * sA;
          let dGA = (g / 255) * dA;
          let sBA = (b2 / 255) * sA;
          let dBA = (b / 255) * dA;

          let demultiply = 255 / dA2;

          let vigOpac = 1;

          imageData[i] =
            (sRA * (dRA * vigOpac) + sRA * (1 - dA) + dRA * (1 - sA)) *
            demultiply;
          imageData[i + 1] =
            (sGA * (dGA * vigOpac) + sGA * (1 - dA) + dGA * (1 - sA)) *
            demultiply;
          imageData[i + 2] =
            (sBA * (dBA * vigOpac) + sBA * (1 - dA) + dBA * (1 - sA)) *
            demultiply;

          // imageData[i] = (r * r2) / 255;
          // imageData[i + 1] = (g * g2) / 255;
          // imageData[i + 2] = (b * b2) / 255;
          // let sRA = r2/255;
          // let dRA = r1/255;
          // let sA = 1;
          // let dA = 1;
          // let demultiply = 255;

          // // muliply here
          // dst[px  ] = (sRA*dRA) * 255;
          // 					dst[px+1] = (sGA*dGA + sGA*(1-1) + dGA*(1-1)) * demultiply;
          // 					dst[px+2] = (sBA*dBA + sBA*(1-1) + dBA*(1-1)) * demultiply;
        }
      } catch (err) {
        console.log(err);
        errMSG.innerText = err;
        errMSG.style.backgroundColor = "red";
        return;
      }

      //ctx2.putImageData(imageDataWrapper, 0, 0);
    }

    ctx2.putImageData(imageDataWrapper, 0, 0);
    // blending process

    //console.log("processing Done!");

    errMSG.innerText = "Processing Completed!";
    errMSG.style.backgroundColor = "grey";
    canvasResizer();

    let originalImg = new Image();
    let resultImg = new Image();

    originalImg = convertCanvasToImage(c);
    resultImg = convertCanvasToImage(c2);

    // textureCanvasContext.globalCompositeOpeartion = "overlay";
    // textureCanvasContext.drawImage(c, 0, 0);
    // textureCanvasContext.drawImage(c2, 0, 0);

    //textureAppliedImage = convertCanvasToImage(textureCanvas);
    originalImg.style.width = "50%";
    resultImg.style.width = "50%";
    //textureAppliedImage.style.width = "50%";
    let textureMsg = " ";
    let vignetteMsg = " ";
    if (isTextureOn) {
      textureMsg = "Grain☑️ ";
    }
    if (isVigOn) {
      vignetteMsg = "Vig☑️";
    }

    let lutTitle = document.createTextNode(
      imgManagerSt.srcname.concat(
        " / LUT : ",
        imgManagerSt.lutname,
        " (",
        opacity,
        "%",
        ") ",
        textureMsg,
        vignetteMsg,
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
    let firstResult = resultArea.firstChild;
    // 리스트의 첫번째에 결과물 넣기
    if (firstResult !== null) {
      resultArea.insertBefore(resultBox, resultArea.firstChild);
    } else {
      resultArea.appendChild(resultBox);
    }
    //css blend
    //originalImg.className = "blend1";
    //originalImg.width = "300";

    resultBox.appendChild(lutBtn);
    resultBox.appendChild(divEl);
    resultBox.appendChild(originalImg);
    resultBox.appendChild(resultImg);
    //resultBox.appendChild(textureAppliedImage);
    lutBtn.addEventListener("click", removeResult);
    lutBtn.className = "btn btn-2 btn-2d";
  }

  function removeResult(e) {
    let targetId = e.target.id;
    let targetEl = document.getElementById(targetId);
    targetEl.parentNode.removeChild(targetEl);
  }

  function canvasResizer() {
    c.style.width = c2.style.width = "50%";
  }

  function convertCanvasToImage(canvas) {
    var image = new Image();
    image.src = canvas.toDataURL("image/jpeg");
    return image;
  }

  function onClick() {
    errMSG.innerText = "Processing...";
    errMSG.style.backgroundColor = themeColors.processing_yellow;

    openLut();
  }
  // 소스 이미지와 LUT 이미지 목록을 셀렉터에 추가하기

  let imgList = null;
  let lutList = null;

  if (imgManagerSt === undefined) {
    console.log("undefined imgManagerSt");
    imgList = SampleImages.map((obj) => selectMapper(obj));
    lutList = LutImages.map((obj) => selectMapper(obj));
  } else {
    //console.log("init error? :", imgManagerSt);
    imgList = imgManagerSt.srclist.map((obj) => selectMapper(obj));
    lutList = imgManagerSt.lutlist.map((obj) => selectMapper(obj));
  }

  //console.log("imgeList:", imgList);

  const profileList = [
    { value: "merlin", label: "준원" },
    { value: "noori", label: "누리" },
    { value: "seryeong", label: "세령" },
  ];

  /// Axios 중복 막기용

  // Cancel Token 추가해서 중복 막기
  //const CancelToken = axios.CancelToken;
  //let cancel;

  //Declare a map to store the identity and cancellation functions for each request
  const pending = new Map();

  /**
   *Add request
   * param {Object} config;
   */
  const addPending = (config) => {
    const url = [
      config.method,
      config.url,
      qs.stringify(config.params),
      qs.stringify(config.data),
    ].join("&");
    config.cancelToken =
      config.cancelToken ||
      new axios.CancelToken((cancel) => {
        if (!pending.has(url)) {
          pending.set(url, cancel);
          // if the current request does not exist in pending, add it
        } else {
        }
      });
  };

  const removePending = (config) => {
    const url = [
      config.method,
      config.url,
      qs.stringify(config.params),
      qs.stringify(config.data),
    ].join("&");

    if (pending.has(url)) {
      console.log("removed duplicated request and assign a new request!");
      // if the current request ID exists in pending, you need to cancel the current request and remove it
      const cancel = pending.get(url);
      cancel(url);
      pending.delete(url);
      pending.set(url, cancel); // 중복이 있을 경우 지우고 새로 등록 ( pending 은 Map 오브젝트로, 같은 키 정보를 재등록하면 덮어쓰기됨. 따라서 이전 중복 모두 삭제 후 최신 것으로 재등록)
    }
  };

  /**
   *Clear requests in pending (called on route jump)
   */
  const clearPending = () => {
    for (const [url, cancel] of pending) {
      cancel(url);
    }
    pending.clear();
  };

  async function cloudPostFile(file) {
    var url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    var fd = new FormData();

    let return_url = null;
    let filename = file.name;
    dropmsg.innerText = filename;

    fd.append("upload_preset", "merlin_samples");
    fd.append("tags", `${imgManagerSt.profile}_src`); // Optional - add tag for image admin in Cloudinary
    fd.append("file", file);

    console.log(`${profile}_src : tagged`);

    document.getElementById("progress").style.width = 0;
    errMSG.innerText = "Uploading an image...";
    errMSG.style.backgroundColor = themeColors.processing_yellow;

    axios.interceptors.request.use(
      (config) => {
        removePending(config); // check and cancel the previous request before the request starts
        addPending(config); // add the current request to pending
        // other code before request
        return config;
      },
      (error) => {
        console.log("request error:", error);
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => {
        removePending(response); // after the request, remove the request
        return response;
      },
      (error) => {
        if (axios.isCancel(error)) {
          console.log("repeated request: " + error.message);
          errMSG.innerText = "Clearing Network, Please wait! 😅";
          errMSG.style.backgroundColor = themeColors.processing_yellow;
        } else {
          errMSG.innerText = `Network error: ${error}😅`;
          errMSG.style.backgroundColor = "red";
        }
        return Promise.reject(error);
      }
    );
    await axios
      .post(url, fd, {
        onUploadProgress: (e) => {
          var progress = Math.round((e.loaded * 100.0) / e.total);
          document.getElementById("progress").style.width = progress + "%";
          errMSG.innerText = `Uploading : ${progress} %`;
          errMSG.style.backgroundColor = themeColors.processing_yellow;
          console.log(`fileuploadprogress data.loaded: ${e.loaded},
    data.total: ${e.total}`);
          if (e.loaded == e.total) {
            console.log("Upload Complete!");
          }
        },
      })
      .then((response) => {
        console.log("response : ", response);
        return_url = response.data.secure_url;
        console.log("return_url", return_url);
        let dropFile = {
          label: filename,
          value: return_url,
        };
        let uploadedFile = saveMapper(dropFile);
        SrcReducer(dropFile);
        console.log("FileUpload dropFile:", dropFile);
        SrcListReducer(uploadedFile);
        dropbox.style.backgroundColor = themeColors.ready_green;

        errMSG.innerText = "Upload completed!";
        errMSG.style.backgroundColor = themeColors.ready_teal;
        file = null;

        return;
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function cloudPostLutFile(file) {
    var url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    var fd = new FormData();

    let return_url = null;
    let filename = file.name;
    lutmsg.innerText = filename;

    fd.append("upload_preset", "merlin_luts");
    fd.append("tags", `${imgManagerSt.profile}_lut`); // Optional - add tag for image admin in Cloudinary
    fd.append("file", file);

    console.log(`${profile}_lut : tagged`);

    document.getElementById("progress").style.width = 0;
    errMSG.innerText = "Uploading a LUT...";
    errMSG.style.backgroundColor = themeColors.processing_yellow;

    axios.interceptors.request.use(
      (config) => {
        removePending(config); // check and cancel the previous request before the request starts
        addPending(config); // add the current request to pending
        // other code before request
        return config;
      },
      (error) => {
        console.log("request error:", error);
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => {
        removePending(response); // after the request, remove the request
        return response;
      },
      (error) => {
        if (axios.isCancel(error)) {
          console.log("repeated request: " + error.message);
          errMSG.innerText = "Clearing Network, Please wait! 😅";
          errMSG.style.backgroundColor = themeColors.processing_yellow;
        } else {
          errMSG.innerText = `Network error: ${error}😅`;
          errMSG.style.backgroundColor = "red";
        }
        return Promise.reject(error);
      }
    );
    await axios
      .post(url, fd, {
        onUploadProgress: (e) => {
          var progress = Math.round((e.loaded * 100.0) / e.total);
          document.getElementById("progress").style.width = progress + "%";
          errMSG.innerText = `Uploading LUT file : ${progress} %`;
          errMSG.style.backgroundColor = themeColors.processing_yellow;
        },
      })
      .then((response) => {
        console.log("response : ", response);
        return_url = response.data.secure_url;
        console.log("return_url", return_url);
        let droplutFile = {
          label: filename,
          value: return_url,
        };
        let uploadedlutFile = saveMapper(droplutFile);
        LutReducer(droplutFile);
        lutbox.style.backgroundColor = themeColors.ready_green;
        LutListReducer(uploadedlutFile);
        errMSG.innerText = "Upload completed!";
        errMSG.style.backgroundColor = themeColors.ready_teal;
        file = null;

        return;
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const getSamples = async () => {
    const sampleSource = `https://res.cloudinary.com/joshandnancy/image/list/${profile}_src.json`;

    const {
      data: { resources },
    } = await axios.get(sampleSource);
    console.log("get urls:", resources);
    errMSG.innerText = "Image list updated!";
    errMSG.style.backgroundColor = themeColors.ready_teal;

    const sample_url_lists = resources.map(
      (x) => quality.url.concat(x.public_id, ".jpg") // cloud quality
    );

    console.log("sample_url_lists: ", sample_url_lists);

    let sliceLength = 52;

    if (quality.name !== "Full") {
      sliceLength = 59;
    }
    const convert_push_urls = sample_url_lists.map((url_item) => ({
      name: url_item.slice(sliceLength),
      url: url_item,
    }));

    convert_push_urls.map((item) => SrcListReducer(item));
  };

  const getLUTs = async () => {
    const sampleSource = `https://res.cloudinary.com/joshandnancy/image/list/${profile}_lut.json`;

    const {
      data: { resources },
    } = await axios.get(sampleSource);
    console.log("get urls:", resources);
    errMSG.innerText = "LUT list updated!";
    errMSG.style.backgroundColor = themeColors.ready_teal;

    const sample_url_lists = resources.map((x) =>
      cloud_default_url.concat(x.public_id)
    );

    const convert_push_urls = sample_url_lists.map((url_item) => ({
      name: url_item.slice(52),
      url: url_item,
    }));

    //console.log("convert_push_urls", convert_push_urls);
    convert_push_urls.map((item) => LutListReducer(item));
  };

  function onLoadSample() {
    errMSG.innerText = "Updating image list!";
    errMSG.style.backgroundColor = themeColors.processing_yellow;
    getSamples();
  }

  function onLoadLUTs() {
    errMSG.innerText = "Updating LUT list!";
    errMSG.style.backgroundColor = themeColors.processing_yellow;
    getLUTs();
  }

  function clearAndRefresh() {
    clearState();
    window.location.reload(false);
    clearPending();
  }

  return (
    <>
      <div className="title">3D LUT React App</div>
      <div className="progress-bar" id="progress-bar">
        <div className="progress" id="progress"></div>
      </div>
      <div className="profile--container">
        <div className="profile--label">
          <label>Profile</label>
        </div>
        <div className="profile--selector">
          <FormControl component="fieldset">
            <RadioGroup
              row
              aria-label="profile"
              name="profile1"
              value={profile}
              onChange={onProfileChange}
            >
              <FormControlLabel
                value="merlin"
                control={<Radio />}
                label="Merlin"
                labelPlacement="top"
              />
              <FormControlLabel
                value="noori"
                control={<Radio />}
                label="Noori"
                labelPlacement="top"
              />
              <FormControlLabel
                value="seryeong"
                control={<Radio />}
                label="Seryeong"
                labelPlacement="top"
              />
            </RadioGroup>
          </FormControl>
        </div>
      </div>
      <div className="profile--container">
        <div className="profile--label">
          <label>Quality</label>
        </div>
        <div className="profile--selector">
          <FormControl component="fieldset">
            <RadioGroup
              row
              aria-label="quality"
              name="quality"
              value={quality.name}
              onChange={onQualityChange}
            >
              <FormControlLabel
                value="1024"
                control={<Radio />}
                label="1024"
                labelPlacement="top"
              />
              <FormControlLabel
                value="2048"
                control={<Radio />}
                label="2048"
                labelPlacement="top"
              />
              <FormControlLabel
                value="Full"
                control={<Radio />}
                label="Full"
                labelPlacement="top"
              />
            </RadioGroup>
          </FormControl>
        </div>
      </div>
      <div className="controlBtnArea">
        <button className="btn btn-2 btn-2d" onClick={clearAndRefresh}>
          Reset
        </button>
      </div>
      <div className="loadBtnArea"></div>
      <div id="dropbox" ref={dropboxEl}>
        <h2>
          <button className="btn btn-2 btn-2d" onClick={onLoadSample}>
            Load {profile} Imgs
          </button>
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
              accept="image/png, image/jpeg, image/heic"
            />
            <span className="file-custom file-source"></span>
          </label>
        </form>
      </div>
      <div id="lutbox" ref={lutboxEl}>
        <h2>
          <button className="btn btn-2 btn-2d" onClick={onLoadLUTs}>
            Load {profile} LUTs
          </button>
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
          <Select options={imgList} onChange={onChange} id="imgs" />
        </div>
        <div className="selector selector--lut">
          <label className="label label--selector" htmlFor="luts">
            🎨Select a LUT file
          </label>
          <Select options={lutList} onChange={onLutChange} id="luts" />
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
        <FormControlLabel
          control={
            <Checkbox
              checked={isTextureOn}
              onChange={handleTexture}
              name="checkedB"
              color="primary"
            />
          }
          label="Grain"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isVigOn}
              onChange={handleVig}
              name="checkedB"
              color="primary"
            />
          }
          label="Vignette"
        />

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
        <canvas
          ref={textureCanvasEl}
          id="textureCanvas"
          className="workCanvas"
        />
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
    SrcListReducer: (value) => dispatch(updateSrcList(value, ownProps)),
    LutListReducer: (value) => dispatch(updateLutList(value, ownProps)),
    ProfileReducer: (value) => dispatch(selectProfile(value, ownProps)),
    QualityReducer: (value) => dispatch(selectQuality(value, ownProps)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
