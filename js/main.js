/* =========================================================
   DeliPop — configuración
   Cambiá estos datos y se actualizan en todo el sitio.
   ========================================================= */
const CONFIG = {
  // Número de WhatsApp en formato internacional, sin "+", espacios ni guiones.
  // Ej. Uruguay, celular 099 123 456 -> "59899123456"
  whatsapp: "59897852637",
  // Correo de DeliPop. Si se deja vacío, los links de correo no se muestran.
  email: "delipopuruguay@gmail.com",
  instagram: "delipopuyoficial", // usuario sin "@"
  // Mensaje precargado en los botones de WhatsApp
  waMessage: "¡Hola DeliPop! Quiero consultar por pop para mi evento.",
  // Mensaje precargado en "No sé, necesito asesoramiento"
  adviceMessage: "¡Hola DeliPop! Necesito asesoramiento: quiero pop para mi evento pero no sé qué servicio me conviene.",
};

const SERVICES = {
  evento: "Pop en tu evento",
  granel: "Pop a granel",
  individual: "Pops individuales",
};

const waLink = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
const mailLink = (subject, body = "") =>
  `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ""}`;

document.documentElement.classList.add("js");

/* ---------- Links de contacto ---------- */
const links = {
  whatsapp: waLink(CONFIG.waMessage),
  advice: waLink(CONFIG.adviceMessage),
  email: CONFIG.email && mailLink("Consulta por pop para mi evento"),
  instagram: `https://www.instagram.com/${CONFIG.instagram}/`,
};
if (!CONFIG.email) document.querySelectorAll('[data-needs="email"]').forEach((el) => el.remove());
document.querySelectorAll("[data-link]").forEach((el) => {
  const href = links[el.dataset.link];
  if (href) el.href = href;
});
document.querySelectorAll('[data-text="email"]').forEach((el) => (el.textContent = CONFIG.email));
document.querySelectorAll('[data-text="instagram"]').forEach((el) => (el.textContent = `@${CONFIG.instagram}`));

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

/* ---------- Header y menú móvil ---------- */
const header = document.querySelector(".header");
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

if (burger && nav) {
  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  };
  burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));
}

/* ---------- Scroll: borde del header y botón flotante ---------- */
const fab = document.querySelector(".fab");
const order = document.getElementById("pedido");
let orderVisible = false;

const onScroll = () => {
  const y = window.scrollY;
  header?.classList.toggle("is-scrolled", y > 8);
  fab?.classList.toggle("is-visible", y > window.innerHeight * 0.6 && !orderVisible);
};
if (fab && order) {
  new IntersectionObserver(([entry]) => {
    orderVisible = entry.isIntersecting;
    onScroll();
  }, { threshold: 0.15 }).observe(order);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Animaciones de entrada ---------- */
const revealer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-in");
    revealer.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".reveal").forEach((el) => {
  // pequeño escalonado entre hermanos
  const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
  el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 70}ms`;
  revealer.observe(el);
});

/* ---------- Tocá para hacer "pop" (hero y panel del pedido) ---------- */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll("[data-pop]").forEach((stage) => stage.addEventListener("pointerdown", (e) => {
  if (reduceMotion) return;
  const rect = stage.getBoundingClientRect();
  for (let i = 0; i < 3; i++) {
    const k = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    k.classList.add("pop");
    k.innerHTML = `<use href="#kernel-${Math.random() > 0.5 ? "a" : "b"}"/>`;
    const size = 40 + Math.random() * 40;
    k.style.width = k.style.height = `${size}px`;
    k.style.left = `${e.clientX - rect.left}px`;
    k.style.top = `${e.clientY - rect.top}px`;
    k.style.setProperty("--dx", `${(Math.random() - 0.5) * 220}px`);
    k.style.setProperty("--r", `${(Math.random() - 0.5) * 540}deg`);
    k.style.animationDelay = `${i * 60}ms`;
    stage.appendChild(k);
    k.addEventListener("animationend", () => k.remove());
  }
}));

/* ---------- Galería de fotos ---------- */
const gallery = document.getElementById("gallery");
if (gallery) {
  const galleryBtns = document.querySelectorAll(".gallery__btn");

  const updateGalleryBtns = () => {
    const max = gallery.scrollWidth - gallery.clientWidth - 2;
    galleryBtns.forEach((btn) => {
      btn.disabled = btn.dataset.dir === "-1" ? gallery.scrollLeft <= 2 : gallery.scrollLeft >= max;
    });
  };
  galleryBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      const step = gallery.querySelector(".gallery__item").offsetHeight * 0.75 + 16;
      gallery.scrollBy({ left: Number(btn.dataset.dir) * step * 2, behavior: reduceMotion ? "auto" : "smooth" });
    })
  );
  gallery.addEventListener("scroll", updateGalleryBtns, { passive: true });
  window.addEventListener("resize", updateGalleryBtns);
  updateGalleryBtns();

  // El video solo se reproduce mientras se ve (y nunca si el usuario pidió menos movimiento)
  const video = gallery.querySelector("video");
  if (reduceMotion) {
    video.controls = true;
  } else {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => (video.controls = true));
      else video.pause();
    }, { threshold: 0.5 }).observe(video);
  }
}

/* =========================================================
   Formulario de pedido
   ========================================================= */
const form = document.getElementById("quote");
const thanks = document.getElementById("thanks");
const opts = form.querySelector(".opts");
const conditionals = form.querySelectorAll("[data-show-for]");

// Muestra u oculta los campos que dependen del servicio (ej. la duración solo aplica al carrito)
const updateConditionals = () => {
  const service = form.elements.servicio.value;
  conditionals.forEach((el) => {
    const show = !service || el.dataset.showFor.split(" ").includes(service);
    el.hidden = !show;
    el.querySelectorAll("input").forEach((input) => (input.disabled = !show));
  });
};

const selectService = (service, flash = true) => {
  const radio = form.querySelector(`input[name="servicio"][value="${service}"]`);
  if (!radio) return;
  radio.checked = true;
  showError("servicio", false);
  updateConditionals();
  if (flash) {
    opts.classList.remove("is-flash");
    void opts.offsetWidth; // reinicia la animación
    opts.classList.add("is-flash");
  }
};

// Botones del hero y de "Qué hacemos": marcan el servicio y llevan al formulario
document.querySelectorAll("[data-service]").forEach((el) =>
  el.addEventListener("click", () => {
    if (!thanks.hidden) resetForm();
    selectService(el.dataset.service);
  })
);
// "¿Querés que tenga el sello de tu empresa?" → marca "Sí" en personalizar
document.querySelectorAll("[data-personalize]").forEach((el) =>
  el.addEventListener("click", () => {
    if (!thanks.hidden) resetForm();
    form.querySelector('input[name="personalizar"][value="Sí"]').checked = true;
  })
);
form.addEventListener("change", (e) => {
  if (e.target.name === "servicio") {
    showError("servicio", false);
    updateConditionals();
  }
});


/* ---------- Validación ---------- */
const showError = (name, visible) => {
  form.querySelector(`[data-error-for="${name}"]`)?.classList.toggle("is-visible", visible);
  const input = form.querySelector(`input[name="${name}"]:not([type="radio"])`);
  input?.classList.toggle("is-invalid", visible);
};

const rules = {
  servicio: () => form.elements.servicio.value !== "",
  empresa: () => form.elements.empresa.value.trim() !== "",
  encargado: () => form.elements.encargado.value.trim() !== "",
};

const validate = () => {
  let firstInvalid = null;
  Object.entries(rules).forEach(([name, check]) => {
    const ok = check();
    showError(name, !ok);
    if (!ok && !firstInvalid) firstInvalid = name;
  });
  if (firstInvalid) {
    const target = firstInvalid === "servicio" ? document.getElementById("servicio-field") : form.elements[firstInvalid];
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    if (firstInvalid !== "servicio") target.focus({ preventScroll: true });
  }
  return !firstInvalid;
};

["empresa", "encargado"].forEach((name) =>
  form.elements[name].addEventListener("input", () => rules[name]() && showError(name, false))
);

/* ---------- Mensaje y envío ---------- */
const formatDate = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

const getOrder = () => {
  const data = Object.fromEntries(new FormData(form)); // los campos deshabilitados no se incluyen
  return [
    ["Servicio", SERVICES[data.servicio]],
    ["Empresa", data.empresa],
    ["Persona encargada", data.encargado],
    ["Fecha tentativa", formatDate(data.fecha)],
    ["Lugar", data.lugar],
    ["Cantidad de personas", data.personas],
    ["Duración estimada", data.duracion],
    ["Personalizar la experiencia", data.personalizar],
    ["Otros", data.otros],
  ].filter(([, value]) => value && value.trim());
};

const buildMessage = () =>
  ["¡Hola DeliPop! Quiero pedir un presupuesto.", "", ...getOrder().map(([k, v]) => `• ${k}: ${v.trim()}`)].join("\n");

const orderSubject = () =>
  `Pedido web: ${SERVICES[form.elements.servicio.value]} – ${form.elements.empresa.value.trim()}`;

const CHANNELS = {
  whatsapp: {
    url: () => waLink(buildMessage()),
    thanks: "Se abrió WhatsApp con tu pedido escrito: solo tocá enviar. Si no se abrió, usá el botón de abajo.",
    retry: '<svg class="i"><use href="#ico-wa"/></svg> Abrir WhatsApp de nuevo',
  },
  email: {
    url: () => mailLink(orderSubject(), buildMessage()),
    thanks: "Se abrió tu correo con el pedido escrito: solo tocá enviar. Si no se abrió, usá el botón de abajo.",
    retry: '<svg class="i"><use href="#ico-mail"/></svg> Abrir el correo de nuevo',
  },
};

const showThanks = (channel) => {
  const retry = document.getElementById("thanks-retry");
  document.getElementById("thanks-text").textContent = CHANNELS[channel].thanks;
  retry.href = CHANNELS[channel].url();
  retry.innerHTML = CHANNELS[channel].retry;
  retry.target = channel === "whatsapp" ? "_blank" : "_self";
  form.hidden = true;
  thanks.hidden = false;
  thanks.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
  thanks.focus({ preventScroll: true });
};

const resetForm = () => {
  form.reset();
  updateConditionals();
  thanks.hidden = true;
  form.hidden = false;
};
document.getElementById("thanks-reset").addEventListener("click", () => {
  resetForm();
  document.getElementById("pedido").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
});

const send = (channel) => {
  const url = CHANNELS[channel].url();
  if (channel === "email") {
    window.location.href = url; // abre la app de correo
    return;
  }
  const win = window.open(url, "_blank", "noopener");
  if (!win) window.location.href = url; // si el navegador bloquea la pestaña nueva
};

// Dos botones de envío: WhatsApp (principal) o mail
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validate()) return;
  const channel = e.submitter?.dataset.channel || "whatsapp";
  send(channel);
  showThanks(channel);
});

// Links con el servicio ya elegido, ej. para la bio de Instagram: tu-sitio/?servicio=granel#pedido
const urlService = new URLSearchParams(location.search).get("servicio");
if (urlService) selectService(urlService, false);
updateConditionals();
