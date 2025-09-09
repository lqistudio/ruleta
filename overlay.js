const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

let options = [];
let settings = { bgColor:"#000000", transparent:true, solidColors:true };
let startAngle = 0;
let spinning = false;
let spinVel = 0;

// Ajustar canvas al tamaño disponible
function resizeCanvas() {
  canvas.width = Math.min(window.innerWidth, 400);
  canvas.height = canvas.width; // mantener cuadrado
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Dibujar la ruleta
function drawWheel() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  if(!settings.transparent){
    ctx.fillStyle = settings.bgColor;
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }

  if(options.length === 0) return;

  const arc = (2*Math.PI)/options.length;
  options.forEach((opt,i)=>{
    const angle = startAngle + i*arc;
    ctx.beginPath();
    ctx.fillStyle = settings.solidColors ? opt.color : "rgba(0,0,0,0)";
    ctx.strokeStyle="#fff";
    ctx.lineWidth=2;
    ctx.moveTo(canvas.width/2, canvas.height/2);
    ctx.arc(canvas.width/2, canvas.height/2, canvas.width/2, angle, angle+arc);
    ctx.lineTo(canvas.width/2, canvas.height/2);
    ctx.fill();
    ctx.stroke();

    // Texto
    ctx.save();
    ctx.fillStyle="#fff";
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.rotate(angle + arc/2);
    ctx.textAlign="right";
    ctx.font = "bold 16px Arial";
    ctx.fillText(opt.text, canvas.width/2 - 30, 10);
    ctx.restore();
  });

  // Flecha superior
  ctx.beginPath();
  ctx.fillStyle="#fff";
  ctx.moveTo(canvas.width/2,0);
  ctx.lineTo(canvas.width/2 - 10, 20);
  ctx.lineTo(canvas.width/2 + 10, 20);
  ctx.closePath();
  ctx.fill();
}

// Girar ruleta
function rotateWheel() {
  if(!spinning) return;
  startAngle += spinVel;
  spinVel *= 0.985;
  if(spinVel < 0.002) spinning = false;
  drawWheel();
  if(spinning) requestAnimationFrame(rotateWheel);
}

// Cargar datos iniciales desde localStorage (funciona sin panel)
function loadFromLocalStorage() {
  options = JSON.parse(localStorage.getItem("wheelOptions")) || [];
  settings = JSON.parse(localStorage.getItem("wheelSettings")) || { bgColor:"#000000", transparent:true, solidColors:true };
  drawWheel();
}
loadFromLocalStorage();

// Escuchar mensajes desde panel
window.addEventListener("message", event => {
  const data = event.data;
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

// Dibujar continuamente al cargar (opcional)
drawWheel();
