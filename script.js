const openBtn = document.getElementById("openBtn");
const intro = document.getElementById("intro");
const invitation = document.getElementById("invitation");
const music = document.getElementById("music");
const shareBtn = document.getElementById("shareBtn");
const shareMessage = document.getElementById("shareMessage");
const transitionCurtain = document.getElementById("transitionCurtain");
const countdown = document.getElementById("countdown");
const dayMessage = document.getElementById("dayMessage");

const weddingStart = new Date("2026-09-19T00:00:00-07:00").getTime();
const weddingEnd = new Date("2026-09-20T00:00:00-07:00").getTime();

function updateCountdown() {
  const now = Date.now();

  if (now >= weddingStart && now < weddingEnd) {
    countdown.hidden = true;
    dayMessage.hidden = false;
    dayMessage.textContent = "¡Hoy es nuestro gran día!";
    return;
  }

  if (now >= weddingEnd) {
    countdown.hidden = true;
    dayMessage.hidden = false;
    dayMessage.textContent = "¡Gracias por acompañarnos!";
    return;
  }

  countdown.hidden = false;
  dayMessage.hidden = true;

  const distance = weddingStart - now;
  document.getElementById("days").textContent = Math.floor(distance / 86400000);
  document.getElementById("hours").textContent = String(Math.floor((distance % 86400000) / 3600000)).padStart(2, "0");
  document.getElementById("minutes").textContent = String(Math.floor((distance % 3600000) / 60000)).padStart(2, "0");
  document.getElementById("seconds").textContent = String(Math.floor((distance % 60000) / 1000)).padStart(2, "0");
}

function createSparkles() {
  const container = document.getElementById("sparkles");
  for (let i = 0; i < 30; i += 1) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.setProperty("--duration", `${7 + Math.random() * 10}s`);
    sparkle.style.setProperty("--delay", `${Math.random() * -12}s`);
    container.appendChild(sparkle);
  }
}

function createPetals() {
  const container = document.getElementById("petals");
  for (let i = 0; i < 7; i += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.setProperty("--size", `${15 + Math.random() * 12}px`);
    petal.style.setProperty("--drift", `${-90 + Math.random() * 180}px`);
    petal.style.setProperty("--duration", `${18 + Math.random() * 13}s`);
    petal.style.setProperty("--delay", `${Math.random() * -26}s`);
    container.appendChild(petal);
  }
}

function fadeInMusic() {
  music.volume = 0;
  const target = 0.82;
  const duration = 2200;
  const started = performance.now();

  function step(now) {
    const progress = Math.min(1, (now - started) / duration);
    music.volume = target * progress;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

openBtn.addEventListener("click", async () => {
  openBtn.disabled = true;

  try {
    await music.play();
    fadeInMusic();
  } catch (error) {
    console.warn("No se pudo iniciar la música:", error);
  }

  intro.classList.add("is-leaving");
  transitionCurtain.classList.add("is-active");

  setTimeout(() => {
    intro.style.display = "none";
    invitation.classList.add("is-visible");
    invitation.setAttribute("aria-hidden", "false");
  }, 650);

  setTimeout(() => {
    invitation.classList.add("is-revealed");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 1080);

  setTimeout(() => transitionCurtain.classList.remove("is-active"), 1700);
});

shareBtn.addEventListener("click", async () => {
  const shareData = {
    title: "Nuestra Boda | Rogelio y Juventina",
    text: "Acompáñanos a celebrar nuestra boda el 19 de Septiembre 2026.",
    url: "https://zval2.github.io/rogelioyjuventina/"
  };

  shareMessage.textContent = "";

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }

  try {
    await navigator.clipboard.writeText(shareData.url);
    shareMessage.textContent = "Enlace copiado.";
  } catch {
    shareMessage.textContent = "Copia el enlace desde la barra del navegador.";
  }
});

updateCountdown();
setInterval(updateCountdown, 1000);
createSparkles();
createPetals();
