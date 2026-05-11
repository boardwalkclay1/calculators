import { CalculatorCore } from "core/calculator-core.js";
import { createSecretEngine } from "core/secret-engine.js";
import { StorageEngine } from "core/storage-engine.js";

const displayMain = document.getElementById("display-main");
const displaySecondary = document.getElementById("display-secondary");
const displayArea = document.getElementById("display-area");

const galleryPanel = document.getElementById("gallery-panel");
const galleryClose = document.getElementById("gallery-close");
const galleryBody = document.getElementById("gallery-body");

let stream = null;
let zoom = 1;
let pictures = StorageEngine.load("pictures-calculator") || [];

function openCamera() {
  displayArea.innerHTML = `<video id="cam" autoplay playsinline style="width:100%;border-radius:14px;"></video>`;
  navigator.mediaDevices.getUserMedia({ video: true }).then((s) => {
    stream = s;
    const cam = document.getElementById("cam");
    cam.srcObject = s;
  });
}

function capturePhoto() {
  const cam = document.getElementById("cam");
  if (!cam) return;

  const canvas = document.createElement("canvas");
  canvas.width = cam.videoWidth;
  canvas.height = cam.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(cam, 0, 0);

  const data = canvas.toDataURL("image/png");

  pictures.push({
    image: data,
    timestamp: Date.now()
  });

  StorageEngine.save("pictures-calculator", pictures);
}

function zoomIn() {
  zoom += 0.1;
  const cam = document.getElementById("cam");
  if (cam) cam.style.transform = `scale(${zoom})`;
}

function zoomOut() {
  zoom = Math.max(1, zoom - 0.1);
  const cam = document.getElementById("cam");
  if (cam) cam.style.transform = `scale(${zoom})`;
}

function openGallery() {
  galleryPanel.classList.add("active");
  galleryBody.innerHTML = "";

  pictures.forEach((p) => {
    const img = document.createElement("img");
    img.src = p.image;
    img.style.width = "100%";
    img.style.borderRadius = "12px";
    img.style.marginBottom = "10px";
    galleryBody.appendChild(img);
  });
}

galleryClose.addEventListener("click", () => {
  galleryPanel.classList.remove("active");
});

const secretHandler = createSecretEngine({
  onOpenCameraMode: openCamera,
  onOpenPicturesVault: openGallery
});

const core = new CalculatorCore({
  displayMain,
  displaySecondary,
  onSecretSequence: secretHandler
});

document.querySelectorAll(".calc-btn").forEach((btn) => {
  const digit = btn.dataset.digit;
  const op = btn.dataset.op;
  const action = btn.dataset.action;

  if (digit !== undefined) {
    btn.addEventListener("click", () => {
      core.handleDigit(digit);

      if (digit === "8") capturePhoto();
      if (digit === "5") zoomIn();
      if (digit === "0") zoomOut();
    });
  } else if (op) {
    btn.addEventListener("click", () => core.handleOperator(op));
  } else if (action) {
    btn.addEventListener("click", () => {
      switch (action) {
        case "ac":
          core.handleClear(true);
          break;
        case "sign":
          core.handleSign();
          break;
        case "percent":
          core.handlePercent();
          break;
        case "dot":
          core.handleDot();
          break;
        case "equals":
          core.handleEquals();
          break;
      }
    });
  }
});
