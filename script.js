const openBtn = document.getElementById("openBtn");
const intro = document.getElementById("intro");
const invitation = document.getElementById("invitation");
const music = document.getElementById("music");
const shareBtn = document.getElementById("shareBtn");
const shareMessage = document.getElementById("shareMessage");
const countdown = document.getElementById("countdown");
const dayMessage = document.getElementById("dayMessage");

const cinematicOverlay = document.getElementById("cinematicOverlay");
const ringStage = document.getElementById("ringStage");
const backPreview = document.getElementById("backPreview");

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

  document.getElementById("days").textContent =
    Math.floor(distance / 86400000);

  document.getElementById("hours").textContent =
    String(Math.floor((distance % 86400000) / 3600000)).padStart(2, "0");

  document.getElementById("minutes").textContent =
    String(Math.floor((distance % 3600000) / 60000)).padStart(2, "0");

  document.getElementById("seconds").textContent =
    String(Math.floor((distance % 60000) / 1000)).padStart(2, "0");
}

function createGoldDust() {
  const container = document.getElementById("goldDust");
  if (!container) return;

  for (let i = 0; i < 42; i += 1) {
    const dust = document.createElement("span");
    dust.className = "dust";
    dust.style.left = `${Math.random() * 100}%`;
    dust.style.top = `${Math.random() * 100}%`;
    dust.style.setProperty("--drift", `${-28 + Math.random() * 56}px`);
    dust.style.setProperty("--duration", `${8 + Math.random() * 12}s`);
    dust.style.setProperty("--delay", `${Math.random() * -14}s`);
    container.appendChild(dust);
  }
}

function createPetals() {
  const container = document.getElementById("petals");
  if (!container) return;

  for (let i = 0; i < 6; i += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.setProperty("--size", `${15 + Math.random() * 12}px`);
    petal.style.setProperty("--drift", `${-90 + Math.random() * 180}px`);
    petal.style.setProperty("--duration", `${19 + Math.random() * 14}s`);
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

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

openBtn.addEventListener("click", async () => {
  openBtn.disabled = true;

  try {
    await music.play();
    fadeInMusic();
  } catch (error) {
    console.warn("No se pudo iniciar la música:", error);
  }

  /* 1) Fade away the intro */
  intro.classList.add("is-leaving");
  await sleep(550);
  intro.style.display = "none";

  /* 2) Wedding-ring effect */
  cinematicOverlay.classList.add("active");
  cinematicOverlay.setAttribute("aria-hidden", "false");
  ringStage.classList.add("show");
  await sleep(1850);

  /* 3) BACK SIDE ONLY — exactly 5 seconds */
  ringStage.classList.remove("show");
  backPreview.classList.add("show");
  await sleep(5000);

  /* 4) End preview and open the normal invitation at the FRONT */
  backPreview.classList.remove("show");
  await sleep(550);

  cinematicOverlay.classList.remove("active");
  cinematicOverlay.setAttribute("aria-hidden", "true");

  invitation.classList.add("is-visible");
  invitation.setAttribute("aria-hidden", "false");
  document.body.classList.add("invitation-open");

  requestAnimationFrame(() => {
    invitation.classList.add("is-revealed");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
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
    shareMessage.textContent =
      "Copia el enlace desde la barra del navegador.";
  }
});

updateCountdown();
setInterval(updateCountdown, 1000);
createGoldDust();
createPetals();
