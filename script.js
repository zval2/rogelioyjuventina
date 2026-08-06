const openBtn = document.getElementById("openBtn");
const intro = document.getElementById("intro");
const invitation = document.getElementById("invitation");
const music = document.getElementById("music");
const shareBtn = document.getElementById("shareBtn");
const shareMessage = document.getElementById("shareMessage");

const weddingDate = new Date("2026-09-19T15:00:00-07:00").getTime();

function updateCountdown() {
  const distance = Math.max(0, weddingDate - Date.now());
  document.getElementById("days").textContent = Math.floor(distance / 86400000);
  document.getElementById("hours").textContent = String(Math.floor((distance % 86400000) / 3600000)).padStart(2, "0");
  document.getElementById("minutes").textContent = String(Math.floor((distance % 3600000) / 60000)).padStart(2, "0");
  document.getElementById("seconds").textContent = String(Math.floor((distance % 60000) / 1000)).padStart(2, "0");
}

function createSparkles() {
  const container = document.getElementById("sparkles");
  for (let i = 0; i < 52; i += 1) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.setProperty("--duration", `${4 + Math.random() * 7}s`);
    sparkle.style.setProperty("--delay", `${Math.random() * -8}s`);
    container.appendChild(sparkle);
  }
}

function createPetals() {
  const container = document.getElementById("petals");
  for (let i = 0; i < 13; i += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.setProperty("--size", `${8 + Math.random() * 9}px`);
    petal.style.setProperty("--drift", `${-70 + Math.random() * 140}px`);
    petal.style.setProperty("--duration", `${11 + Math.random() * 11}s`);
    petal.style.setProperty("--delay", `${Math.random() * -18}s`);
    container.appendChild(petal);
  }
}

openBtn.addEventListener("click", async () => {
  openBtn.disabled = true;

  try {
    music.volume = 0.82;
    await music.play();
  } catch (error) {
    console.warn("No se pudo iniciar la música:", error);
  }

  intro.classList.add("is-leaving");

  setTimeout(() => {
    intro.style.display = "none";
    invitation.classList.add("is-visible");
    invitation.setAttribute("aria-hidden", "false");

    requestAnimationFrame(() => {
      invitation.classList.add("is-revealed");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, 1000);
});

shareBtn.addEventListener("click", async () => {
  const shareData = {
    title: "Nuestra Boda | Rogelio y Juventina",
    text: "Acompáñanos a celebrar nuestra boda el 19 de septiembre de 2026.",
    url: window.location.href
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
    await navigator.clipboard.writeText(window.location.href);
    shareMessage.textContent = "Enlace copiado.";
  } catch (error) {
    shareMessage.textContent = "Copia el enlace desde la barra del navegador.";
  }
});

updateCountdown();
setInterval(updateCountdown, 1000);
createSparkles();
createPetals();
