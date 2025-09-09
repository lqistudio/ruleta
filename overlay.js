const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

let options = [];
let settings = { bgColor: "#000000", transparent: true, solidColors: true };

let startAngle = 0;
let spinning = false;
let spinVel = 0;

// --- Ajustar canvas a la ventana ---
function resizeCanvas(){
  canvas.width = Math.min(window.innerWidth, 400);
  canvas.height = canvas.width; // cuadrado
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// --- Dibujar la ruleta ---
function drawWheel(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  if(!settings.transparent){
    ctx.fillStyle = settings.bgColor;
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }

  if(options.length === 0) return;

  const arc = (2 * Math.PI) / options.length;
  options.forEach((opt, i) => {
    const angle = startAngle + i*arc;
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, canvas.height/2);
    ctx.arc(canvas.width/2, canvas.height/2, canvas.width/2, angle, angle + arc);
    ctx.closePath();
    ctx.fillStyle = settings.solidColors ? opt.color : "rgba(0,0,0,0)";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Texto
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.rotate(angle + arc/2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px Arial";
    ctx.fillText(opt.text, canvas.width/2 - 30, 10);
    ctx.restore();
  });

  // Flecha superior
  ctx.beginPath();
  ctx.moveTo(canvas.width/2, 0);
  ctx.lineTo(canvas.width/2 - 10, 20);
  ctx.lineTo(canvas.width/2 + 10, 20);
  ctx.closePath();
  ctx.fillStyle = "#fff";
  ctx.fill();
}

// --- Girar ruleta ---
function rotateWheel(){
  if(!spinning) return;
  startAngle += spinVel;
  spinVel *= 0.985;
  if(spinVel < 0.002) spinning = false;
  drawWheel();
  if(spinning) requestAnimationFrame(rotateWheel);
}

// --- Cargar datos iniciales desde localStorage ---
function loadInitialData(){
  const storedOptions = JSON.parse(localStorage.getItem("wheelOptions")) || [];
  const storedSettings = JSON.parse(localStorage.getItem("wheelSettings")) || null;
  if(storedOptions.length) options = storedOptions;
  if(storedSettings) settings = storedSettings;
}
loadInitialData();
drawWheel();

// --- Escuchar mensajes del panel ---
window.addEventListener("message", (event) => {
  const data = event.data;
  if(!data) return;
  if(data.action === "update"){
    options = data.options || [];
    settings = data.settings || { bgColor:"#000000", transparent:true, solidColors:true };
    drawWheel();
  }
  if(data.action === "spin" && !spinning){
    spinVel = Math.random()*0.3 + 0.25;
    spinning = true;
    rotateWheel();
  }
});
