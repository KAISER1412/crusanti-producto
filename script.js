(() => {
  "use strict";
  const number = "5210000000000";
  const messages = {
    interest: "Hola, me interesa la Grúa Hidráulica Industrial CR-10, modelo CR-10. Vi el producto en la página de demostración de Crusanti México y quisiera recibir información.",
    information: "Hola, quisiera obtener más información sobre la Grúa Hidráulica Industrial CR-10 de Crusanti México."
  };
  const main = document.querySelector("#main-image");
  const thumbs = [...document.querySelectorAll(".thumb")];
  const counter = document.querySelector("#counter");
  thumbs.forEach((button, index) => button.addEventListener("click", () => {
    thumbs.forEach(item => { item.classList.remove("selected"); item.setAttribute("aria-pressed", "false"); });
    button.classList.add("selected");
    button.setAttribute("aria-pressed", "true");
    main.classList.add("fade");
    window.setTimeout(() => {
      main.src = button.dataset.src;
      main.alt = button.dataset.alt || "Imagen ilustrativa de maquinaria industrial";
      main.classList.remove("fade");
    }, 110);
    counter.textContent = String(index + 1).padStart(2, "0") + " / " + String(thumbs.length).padStart(2, "0");
  }));
  document.querySelectorAll(".whatsapp").forEach(link => {
    const message = messages[link.dataset.message] || messages.information;
    link.href = "https://wa.me/" + number + "?text=" + encodeURIComponent(message);
  });
  const menu = document.querySelector(".menu");
  const nav = document.querySelector("#nav");
  const closeMenu = () => { menu.setAttribute("aria-expanded", "false"); menu.setAttribute("aria-label", "Abrir menú"); nav.classList.remove("open"); };
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    nav.classList.toggle("open", open);
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => { if (event.key === "Escape") { closeMenu(); menu.focus(); } });
  document.querySelector("#year").textContent = String(new Date().getFullYear());
})();
