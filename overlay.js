const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

// Cargar opciones y settings desde localStorage
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
let spinning = false;
let spinVel = 0;

function drawWheel(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

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

// Girar ruleta
function rotateWheel(){
  if(!spinning) return;
  startAngle += spinVel;
  spinVel *= 0.985;
  if(spinVel<0.002) spinning=false;
  drawWheel();
  if(spinning) requestAnimationFrame(rotateWheel);
}

// Escuchar mensaje desde panel
window.addEventListener("message", (event)=>{
  if(event.data.action === "spin" && !spinning){
    spinVel = Math.random()*0.3+0.25;
    spinning = true;
    rotateWheel();
  }
});

// Inicializar overlay
drawWheel();
