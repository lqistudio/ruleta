const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spin");
const resultDiv = document.getElementById("result");

const optionsDiv = document.getElementById("options");
const addOptionBtn = document.getElementById("addOption");
const bgColorInput = document.getElementById("bgColor");
const transparentBgCheck = document.getElementById("transparentBg");
const solidColorsCheck = document.getElementById("solidColors");

let options = JSON.parse(localStorage.getItem("wheelOptions")) || [
  { text: "Premio 1", color: "#e74c3c" },
  { text: "Premio 2", color: "#3498db" },
  { text: "Premio 3", color: "#2ecc71" }
];

let settings = JSON.parse(localStorage.getItem("wheelSettings")) || {
  bgColor: "#000000",
  transparent: true,
  solidColors: true
};

// Configurar inputs solo si existen
if (bgColorInput) bgColorInput.value = settings.bgColor;
if (transparentBgCheck) transparentBgCheck.checked = settings.transparent;
if (solidColorsCheck) solidColorsCheck.checked = settings.solidColors;

function saveOptions() {
  localStorage.setItem("wheelOptions", JSON.stringify(options));
  drawWheel();
}

function saveSettings() {
  if (!bgColorInput || !transparentBgCheck || !solidColorsCheck) return;

  settings = {
    bgColor: bgColorInput.value,
    transparent: transparentBgCheck.checked,
    solidColors: solidColorsCheck.checked
  };
  localStorage.setItem("wheelSettings", JSON.stringify(settings));
  drawWheel();
}

function renderOptions() {
  if (!optionsDiv) return;
  optionsDiv.innerHTML = "";
  options.forEach((opt, i) => {
    const div = document.createElement("div");
    div.className = "option";
    div.innerHTML = `
      <input type="color" value="${opt.color}" onchange="updateColor(${i}, this.value)">
      <input type="text" value="${opt.text}" onchange="updateText(${i}, this.value)">
      <button class="remove" onclick="removeOption(${i})">✖</button>
    `;
    optionsDiv.appendChild(div);
  });
}

window.updateText = (i, value) => {
  options[i].text = value;
  saveOptions();
};

window.updateColor = (i, value) => {
  options[i].color = value;
  saveOptions();
};

window.removeOption = (i) => {
  options.splice(i, 1);
  saveOptions();
  renderOptions();
};

// Agregar opción solo si el botón existe
if (addOptionBtn) {
  addOptionBtn.addEventListener("click", () => {
    options.push({ text: "Nuevo", color: "#ffffff" });
    saveOptions();
    renderOptions();
  });
}

// Escuchar cambios de settings solo si existen
if (bgColorInput) bgColorInput.addEventListener("change", saveSettings);
if (transparentBgCheck) transparentBgCheck.addEventListener("change", saveSettings);
if (solidColorsCheck) solidColorsCheck.addEventListener("change", saveSettings);

let startAngle = 0;
function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fondo configurable o transparente
  if (!settings.transparent) {
    ctx.fillStyle = settings.bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const arc = (2 * Math.PI) / options.length;
  options.forEach((opt, i) => {
    const angle = startAngle + i * arc;
    ctx.beginPath();
    ctx.fillStyle = settings.solidColors ? opt.color : "rgba(0,0,0,0)";
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.moveTo(200, 200);
    ctx.arc(200, 200, 200, angle, angle + arc);
    ctx.lineTo(200, 200);
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.fillStyle = "#fff";
    ctx.translate(200, 200);
    ctx.rotate(angle + arc / 2);
    ctx.textAlign = "right";
    ctx.font = "bold 16px Arial";
    ctx.fillText(opt.text, 170, 10);
    ctx.restore();
  });

  // Flecha superior
  ctx.beginPath();
  ctx.fillStyle = "#fff";
  ctx.moveTo(200, 0);
  ctx.lineTo(190, 20);
  ctx.lineTo(210, 20);
  ctx.closePath();
  ctx.fill();
}

let spinAngle = 0;
let spinVel = 0;
let spinning = false;

function rotateWheel() {
  if (!spinning) return;
  spinAngle += spinVel;
  spinVel *= 0.985;
  if (spinVel < 0.002) {
    spinning = false;
    const arc = (2 * Math.PI) / options.length;
    let index = Math.floor(((2 * Math.PI) - (spinAngle % (2 * Math.PI))) / arc) % options.length;
    if (resultDiv) resultDiv.textContent = "Ganaste: " + options[index].text;
  }
  startAngle = spinAngle;
  drawWheel();
  requestAnimationFrame(rotateWheel);
}

if (spinBtn) {
  spinBtn.addEventListener("click", () => {
    if (spinning || options.length === 0) return;
    spinVel = Math.random() * 0.3 + 0.25;
    spinning = true;
    rotateWheel();
    if (resultDiv) resultDiv.textContent = "";
  });
}

// Render inicial
renderOptions();
drawWheel();
