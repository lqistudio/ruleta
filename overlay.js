const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

// Cargar opciones y settings desde localStorage o usar defaults
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

let startAngle = 0;

// Dibujar ruleta
function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // fondo
  if(!settings.transparent){
    ctx.fillStyle = settings.bgColor;
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }

  const arc = (2*Math.PI)/options.length;
  options.forEach((opt,i)=>{
    const angle = startAngle + i*arc;
    ctx.beginPath();
    ctx.fillStyle = settings.solidColors? opt.color : "rgba(0,0,0,0)";
    ctx.strokeStyle="#fff";
    ctx.lineWidth=2;
    ctx.moveTo(200,200);
    ctx.arc(200,200,200,angle,angle+arc);
    ctx.lineTo(200,200);
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.fillStyle="#fff";
    ctx.translate(200,200);
    ctx.rotate(angle+arc/2);
    ctx.textAlign="right";
    ctx.font="bold 16px Arial";
    ctx.fillText(opt.text,170,10);
    ctx.restore();
  });

  // flecha
  ctx.beginPath();
  ctx.fillStyle="#fff";
  ctx.moveTo(200,0);
  ctx.lineTo(190,20);
  ctx.lineTo(210,20);
  ctx.closePath();
  ctx.fill();
}

// --- Animación de giro (opcional) ---
let spinAngle = 0;
let spinVel = Math.random()*0.3+0.25; // giro inicial automático

function rotateWheel(){
  spinAngle += spinVel;
  spinVel *= 0.985; // frena lentamente
  if(spinVel < 0.002) spinVel = 0; // detener
  startAngle = spinAngle;
  drawWheel();
  requestAnimationFrame(rotateWheel);
}

// iniciar animación
drawWheel();
rotateWheel();
