const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

// Opciones y configuración por defecto
let options = [
  { text: "Premio 1", color: "#e74c3c" },
  { text: "Premio 2", color: "#3498db" },
  { text: "Premio 3", color: "#2ecc71" }
];
let settings = { bgColor:"#000000", transparent:true, solidColors:true };

let startAngle = 0;
let spinning = false;
let spinVel = 0;

// Ajustar canvas al tamaño disponible
function resizeCanvas(){
  canvas.width = Math.min(window.innerWidth, 400);
  canvas.height = canvas.width;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Dibujar ruleta
function drawWheel(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Fondo
  if(!settings.transparent){
    ctx.fillStyle = settings.bgColor;
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }

  if(options.length === 0) return;

  const arc = (2*Math.PI)/options.length;
  options.forEach((opt,i)=>{
    const angle = startAngle + i*arc;

    // Sector
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, canvas.height/2);
    ctx.arc(canvas.width/2, canvas.height/2, canvas.width/2, angle, angle+arc);
    ctx.lineTo(canvas.width/2, canvas.height/2);
    ctx.fillStyle = settings.solidColors ? opt.color : "rgba(0,0,0,0)";
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.fill();
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

// Girar ruleta
function rotateWheel(){
  if(!spinning) return;
  startAngle += spinVel;
  spinVel *= 0.985;
  if(spinVel < 0.002){
    spinning = false;
  }
  drawWheel();
  if(spinning) requestAnimationFrame(rotateWheel);
}

// Escuchar mensajes desde el panel
window.addEventListener("message", event => {
  const data = event.data;
  if(data.action === "update"){
    options = data.options || options;
    settings = data.settings || settings;
    drawWheel();
  }
  if(data.action === "spin" && !spinning){
    spinVel = Math.random()*0.3 + 0.25;
    spinning = true;
    rotateWheel();
  }
});

// Inicializar ruleta
drawWheel();
