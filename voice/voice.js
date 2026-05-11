import { CalculatorCore } from "../core/calculator-core.js";
import { createSecretEngine } from "/core/sercret-engine.js";
import { StorageEngine } from "/core/storage-engine.js";

const displayMain = document.getElementById("display-main");
const displaySecondary = document.getElementById("display-secondary");

const voicePanel = document.getElementById("voice-panel");
const voiceClose = document.getElementById("voice-close");
const voiceBody = document.getElementById("voice-body");

let recorder = null;
let chunks = [];
let isRecording = false;

let recordings = StorageEngine.load("voice-calculator") || [];

function toggleRecording() {
  if (!isRecording) {
    startRecording();
  } else {
    stopRecording();
  }
}

function startRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    recorder = new MediaRecorder(stream);
    chunks = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);

      recordings.push({
        url,
        timestamp: Date.now()
      });

      StorageEngine.save("voice-calculator", recordings);
    };

    recorder.start();
    isRecording = true;
    displayMain.textContent = "● REC";
  });
}

function stopRecording() {
  if (recorder) recorder.stop();
  isRecording = false;
  displayMain.textContent = "0";
}

function openVault() {
  voicePanel.classList.add("active");
  voiceBody.innerHTML = "";

  recordings.forEach((r) => {
    const row = document.createElement("div");
    row.className = "contact-row";

    const audio = document.createElement("audio");
    audio.controls = true;
    audio.src = r.url;

    row.appendChild(audio);
    voiceBody.appendChild(row);
  });
}

voiceClose.addEventListener("click", () => {
  voicePanel.classList.remove("active");
});

const secretHandler = createSecretEngine({
  onToggleRecording: toggleRecording,
  onOpenVoiceVault: openVault
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
    btn.addEventListener("click", () => core.handleDigit(digit));
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
