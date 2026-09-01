// ===================================================
// MOTOR DE ANIMACIÓN & NARRATIVA INTERACTIVA
// ===================================================

const scenesData = [
  {
    id: 1,
    title: "Escena 1/6: Quietud & El Retoño",
    text: "Esa fue la primera vez que me crucé con él. Guardado en su silencio, sus restos descansaban junto a la ventana. De una grieta en el marco nació un pequeño retoño amarillo Van Gogh...",
    eyeActive: false,
    colorScheme: "cold-yellow",
    interactive: false
  },
  {
    id: 2,
    title: "Escena 2/6: Crecimiento Interno",
    text: "No existía diagnóstico claro. Microfracturas y '¿Crecimiento interno de estructura vegetal?'. Algo crecía dentro de él, enroscándose como raíces entre sus huesos.",
    eyeActive: true,
    colorScheme: "xray-crimson",
    interactive: false
  },
  {
    id: 3,
    title: "Escena 3/6: La Traza Amarilla",
    text: "Le llevé un lienzo. Con manos temblorosas tomó el pincel y dio un gran trazo amarillo. Pero el dolor regresó violentamente y la planta se volvió inoperable.",
    eyeActive: false,
    colorScheme: "dramatic-paint",
    interactive: true
  },
  {
    id: 4,
    title: "Escena 4/6: Noches de Color",
    text: "Todas las noches iba a su habitación a regar el retoño y dejarle pinturas por el cuarto, llenándolo de a poco de color para evitar que se rindia.",
    eyeActive: false,
    colorScheme: "color-bloom",
    interactive: false
  },
  {
    id: 5,
    title: "Escena 5/6: La Verdadera Magnolia",
    text: "—'No sé vivir sin esto' —me dijo. Entendí que hablaba del amor de su vida: Magnolia. Al sanar su alma, brotes amarillos comenzaron a envolver el dolor pasional.",
    eyeActive: true,
    colorScheme: "healing-bloom",
    interactive: false
  },
  {
    id: 6,
    title: "Escena 6/6: El Obsequio",
    text: "Al darle el alta, me entregó un cuadro. Allí descansaba una mujer de rosadas mejillas acariciando los pétalos amarillos. 'Gracias por todo'.",
    eyeActive: false,
    colorScheme: "warm-ending",
    interactive: false
  }
];

// Estado Global
let currentSceneIndex = 0;
let isPlaying = true;
let animFrameId = null;
let time = 0;
let userBrushStrokes = [];

// Elementos del DOM
const canvas = document.getElementById("animCanvas");
const ctx = canvas.getContext("2d");
const irisCanvas = document.getElementById("irisCanvas");
const irisCtx = irisCanvas ? irisCanvas.getContext("2d") : null;

const storyText = document.getElementById("storyText");
const sceneTitle = document.getElementById("sceneTitle");
const progressBar = document.getElementById("progressBar");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const eyeOverlay = document.getElementById("eyeOverlay");
const paintingModal = document.getElementById("paintingModal");
const brushBtn = document.getElementById("interactiveBrushBtn");

// Ajustar Tamaño del Canvas
function resizeCanvas() {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Inicialización de Eventos
function initControls() {
  playPauseBtn.addEventListener("click", togglePlay);
  prevBtn.addEventListener("click", () => changeScene(currentSceneIndex - 1));
  nextBtn.addEventListener("click", () => changeScene(currentSceneIndex + 1));
  
  brushBtn.addEventListener("click", () => {
    // Generar trazos de pintura amarillos interactivos al hacer clic
    for (let i = 0; i < 5; i++) {
      userBrushStrokes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 40 + 20,
        alpha: 1.0
      });
    }
  });

  // Permitir dibujar directamente sobre el canvas en la escena 3
  canvas.addEventListener("mousemove", (e) => {
    if (scenesData[currentSceneIndex].interactive && e.buttons === 1) {
      const rect = canvas.getBoundingClientRect();
      userBrushStrokes.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        size: Math.random() * 25 + 15,
        alpha: 1.0
      });
    }
  });

  updateSceneUI();
  requestAnimationFrame(animationLoop);
}

function togglePlay() {
  isPlaying = !isPlaying;
  playPauseBtn.textContent = isPlaying ? "⏸" : "▶";
}

function changeScene(index) {
  if (index < 0 || index >= scenesData.length) return;
  currentSceneIndex = index;
  userBrushStrokes = [];
  updateSceneUI();
}

function updateSceneUI() {
  const current = scenesData[currentSceneIndex];
  storyText.textContent = current.text;
  sceneTitle.textContent = current.title;
  progressBar.style.width = `${((currentSceneIndex + 1) / scenesData.length) * 100}%`;

  // Toggle Ojo Overlay
  if (current.eyeActive) {
    eyeOverlay.classList.remove("hidden");
  } else {
    eyeOverlay.classList.add("hidden");
  }

  // Toggle Cuadro Modal Final
  if (current.id === 6) {
    paintingModal.classList.remove("hidden");
  } else {
    paintingModal.classList.add("hidden");
  }

  // Toggle Botón Interactivo
  if (current.interactive) {
    brushBtn.classList.remove("hidden");
  } else {
    brushBtn.classList.add("hidden");
  }
}

// ===================================================
// RENDERIZADO VISUAL & BUCLE PRINCIPAL (CANVAS 2D)
// ===================================================

function animationLoop() {
  if (isPlaying) {
    time += 0.02;
    renderScene();
    if (scenesData[currentSceneIndex].eyeActive) {
      renderIrisReflection();
    }
  }
  animFrameId = requestAnimationFrame(animationLoop);
}

function renderScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const scene = scenesData[currentSceneIndex];

  switch (scene.id) {
    case 1:
      drawHospitalWindowScene();
      break;
    case 2:
      drawXRayVegetalScene();
      break;
    case 3:
      drawBrushAndHeartScene();
      break;
    case 4:
      drawColorBloomNightScene();
      break;
    case 5:
      drawHealingRootsScene();
      break;
    case 6:
      drawFinalMemoryScene();
      break;
  }

  drawUserStrokes();
}

// ESCENA 1: Ventana de Hospital y Brote Van Gogh
function drawHospitalWindowScene() {
  // Fondo Frío
  ctx.fillStyle = "#0c1017";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Marco de la ventana
  const winWidth = canvas.width * 0.4;
  const winHeight = canvas.height * 0.7;
  const winX = canvas.width * 0.5 - winWidth / 2;
  const winY = canvas.height * 0.15;

  // Luz Dorada Ingresando
  const grad = ctx.createRadialGradient(winX + winWidth / 2, winY + 50, 10, winX + winWidth / 2, winY + 50, winWidth);
  grad.addColorStop(0, "rgba(253, 216, 53, 0.4)");
  grad.addColorStop(1, "rgba(12, 16, 23, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Estructura Ventana Madera
  ctx.strokeStyle = "#2d1f10";
  ctx.lineWidth = 12;
  ctx.strokeRect(winX, winY, winWidth, winHeight);

  // Pequeño Brote Amarillo (Animado con Viento)
  const sproutX = winX + winWidth - 10;
  const sproutY = winY + winHeight - 30;
  ctx.beginPath();
  ctx.moveTo(sproutX, sproutY);
  const sway = Math.sin(time * 2) * 8;
  ctx.quadraticCurveTo(sproutX + 15, sproutY - 20, sproutX + sway, sproutY - 40);
  ctx.strokeStyle = "#fdd835";
  ctx.lineWidth = 4;
  ctx.stroke();

  // Partículas Estilo Bokeh Van Gogh
  for (let i = 0; i < 25; i++) {
    const px = (Math.sin(i + time * 0.5) * 0.5 + 0.5) * canvas.width;
    const py = (Math.cos(i * 2 + time * 0.3) * 0.5 + 0.5) * canvas.height;
    ctx.beginPath();
    ctx.arc(px, py, Math.sin(time + i) * 3 + 4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(253, 216, 53, 0.35)";
    ctx.fill();
  }
}

// ESCENA 2: Radiografía / Raíces Carmesí en el Tórax
function drawXRayVegetalScene() {
  ctx.fillStyle = "#05070a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  // Silueta Humana Pálida
  ctx.beginPath();
  ctx.arc(cx, cy - 80, 50, 0, Math.PI * 2);
  ctx.rect(cx - 70, cy - 20, 140, 180);
  ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
  ctx.fill();

  // Raíces Carmesí Creciendo (Estilo Árbol / Pulmones)
  ctx.save();
  ctx.translate(cx, cy + 40);
  drawOrganicRoots(0, 0, -Math.PI / 2, 70, 6, "#ff1e56");
  ctx.restore();
}

// ESCENA 3: Pincelada Amarilla e Impacto del Corazón
function drawBrushAndHeartScene() {
  ctx.fillStyle = "#0a0a0d";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Lienzo Central
  const canvasW = 300;
  const canvasH = 200;
  const lx = canvas.width / 2 - canvasW / 2;
  const ly = canvas.height / 2 - canvasH / 2;

  ctx.fillStyle = "#fff";
  ctx.fillRect(lx, ly, canvasW, canvasH);

  // Gran Trazo Amarillo Dinámico
  ctx.beginPath();
  ctx.moveTo(lx + 20, ly + 40);
  ctx.bezierCurveTo(lx + 80, ly + 150, lx + 200, ly + 20, lx + canvasW - 20, ly + 160);
  ctx.strokeStyle = "#fdd835";
  ctx.lineWidth = 22;
  ctx.lineCap = "round";
  ctx.stroke();

  // Latido Carmesí (Crisis Dolorosa)
  const pulse = Math.abs(Math.sin(time * 4)) * 30;
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 80 + pulse, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 30, 86, 0.15)";
  ctx.fill();
}

// ESCENA 4: Noches de Acompañamiento y Flores Fluorescentes
function drawColorBloomNightScene() {
  ctx.fillStyle = "#080b12";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Ondas de acuarela expandiéndose
  for (let i = 0; i < 5; i++) {
    const radius = ((time * 40 + i * 80) % 300) + 20;
    const alpha = 1 - radius / 320;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(0, 229, 255, ${alpha * 0.5})`;
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}

// ESCENA 5: Sanación y Flores Amarillas Sobre las Raíces Secas
function drawHealingRootsScene() {
  ctx.fillStyle = "#0b131f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  ctx.save();
  ctx.translate(cx, cy + 50);
  // Raíces viejas secas (Marrón/Púrpura)
  drawOrganicRoots(0, 0, -Math.PI / 2, 65, 5, "#4a3b52");
  // Nuevos brotes amarillos entrelazados
  drawOrganicRoots(0, 0, -Math.PI / 2, 55, 4, "#fdd835");
  ctx.restore();
}

// ESCENA 6: Recuerdo Dorado Final
function drawFinalMemoryScene() {
  const grad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 50, canvas.width / 2, canvas.height / 2, canvas.width);
  grad.addColorStop(0, "#ffe082");
  grad.addColorStop(1, "#1a0e03");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Función Recursiva para Dibujar Raíces Orgánicas (Estilo Pincel Seco)
function drawOrganicRoots(x, y, angle, length, depth, color) {
  if (depth === 0) return;

  const xEnd = x + Math.cos(angle) * length;
  const yEnd = y + Math.sin(angle) * length;

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(xEnd, yEnd);
  ctx.strokeStyle = color;
  ctx.lineWidth = depth * 1.8;
  ctx.stroke();

  const swing = Math.sin(time + depth) * 0.08;
  drawOrganicRoots(xEnd, yEnd, angle - 0.35 + swing, length * 0.75, depth - 1, color);
  drawOrganicRoots(xEnd, yEnd, angle + 0.35 + swing, length * 0.75, depth - 1, color);
}

// Dibujar Trazos Interactivos del Usuario
function drawUserStrokes() {
  for (let i = userBrushStrokes.length - 1; i >= 0; i--) {
    const stroke = userBrushStrokes[i];
    ctx.beginPath();
    ctx.arc(stroke.x, stroke.y, stroke.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(253, 216, 53, ${stroke.alpha})`;
    ctx.fill();
    stroke.alpha -= 0.01;
    if (stroke.alpha <= 0) {
      userBrushStrokes.splice(i, 1);
    }
  }
}

// Renderizar Reflejo del Iris (Primer Plano de Ojos Estilo Skye Wei)
function renderIrisReflection() {
  if (!irisCtx) return;
  irisCtx.clearRect(0, 0, irisCanvas.width, irisCanvas.height);

  // Fondo del Iris Neón
  const grad = irisCtx.createRadialGradient(100, 100, 10, 100, 100, 90);
  grad.addColorStop(0, "#00e5ff");
  grad.addColorStop(0.6, "#8a2be2");
  grad.addColorStop(1, "#000000");
  irisCtx.fillStyle = grad;
  irisCtx.fillRect(0, 0, 200, 200);

  // Reflejo en Movimiento (Flor de Magnolia / Luz)
  irisCtx.beginPath();
  irisCtx.arc(100 + Math.sin(time * 2) * 15, 100 + Math.cos(time * 2) * 15, 20, 0, Math.PI * 2);
  irisCtx.fillStyle = "rgba(255, 30, 86, 0.7)";
  irisCtx.fill();
}

// Iniciar aplicación al cargar DOM
document.addEventListener("DOMContentLoaded", initControls);
