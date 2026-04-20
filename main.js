import { jsPDF } from "jspdf";
import emailjs from "emailjs-com";

/* CONFIGURATION - replace these with real values for EmailJS */
const EMAILJS_USER_ID = "user_xxx";         // <-- replace with your EmailJS user ID
const EMAILJS_SERVICE_ID = "service_xxx";   // <-- replace with your service id
const EMAILJS_TEMPLATE_ID = "template_xxx"; // <-- replace with your template id
const SEND_TO_EMAIL = "joseluiscuenca89@gmail.com"; // required recipient (used in template)

/* NAV: scroll to contact when clicking book button */
document.getElementById("bookBtn").addEventListener("click", () => {
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
});

/* Mobile menu toggle (hamburger) */
const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileMenu = document.getElementById("mobileMenu");
const mobileBookBtn = document.getElementById("mobileBookBtn");

/* Modal Tarifario */
const tarifarioModal = document.getElementById("tarifarioModal");
const closeTarifarioBtn = document.getElementById("closeTarifarioBtn");

function openTarifarioModal() {
  if (!tarifarioModal) return;
  tarifarioModal.classList.add("open");
  tarifarioModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeTarifarioModal() {
  if (!tarifarioModal) return;
  tarifarioModal.classList.remove("open");
  tarifarioModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

if (closeTarifarioBtn) {
  closeTarifarioBtn.addEventListener("click", () => {
    closeTarifarioModal();
  });
}

if (tarifarioModal) {
  tarifarioModal.addEventListener("click", (e) => {
    if (e.target === tarifarioModal) {
      closeTarifarioModal();
    }
  });
}

function closeMobileMenu() {
  if (!hamburgerBtn) return;
  hamburgerBtn.setAttribute("aria-expanded", "false");
  hamburgerBtn.setAttribute("aria-label", "Abrir menú");
  mobileMenu.classList.remove("open");
  mobileMenu.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function openMobileMenu() {
  if (!hamburgerBtn) return;
  hamburgerBtn.setAttribute("aria-expanded", "true");
  hamburgerBtn.setAttribute("aria-label", "Cerrar menú");
  mobileMenu.classList.add("open");
  mobileMenu.setAttribute("aria-hidden", "false");
  // prevent body scroll while menu open on small devices
  document.body.style.overflow = "hidden";
}

if (hamburgerBtn && mobileMenu) {
  hamburgerBtn.addEventListener("click", () => {
    const expanded = hamburgerBtn.getAttribute("aria-expanded") === "true";
    if (expanded) closeMobileMenu(); else openMobileMenu();
  });

  // close when clicking a link inside mobile menu
  mobileMenu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", (ev) => {
      ev.preventDefault();
      const id = a.getAttribute("href").slice(1);
      closeMobileMenu();
      if (id === "tarifario") {
        openTarifarioModal();
      } else {
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

  // mobile book button scrolls and closes menu
  if (mobileBookBtn) {
    mobileBookBtn.addEventListener("click", () => {
      closeMobileMenu();
      document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
    });
  }

  // close on escape key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMobileMenu();
      closeTarifarioModal();
    }
  });
}

/* HERO VIDEO behavior:
   - Siempre se reproduce automáticamente, en loop, sin sonido.
   - En móvil/tablet usa taxiaero-vertical.mp4; en escritorio usa taxiaero.mp4.
*/
const video = document.getElementById("heroVideo");
const isMobileOrTablet = ("ontouchstart" in window) || window.innerWidth <= 900;

async function initHeroVideo() {
  if (!video) return;

  const source = document.createElement("source");
  source.type = "video/mp4";
  // Usa taxiaero.mp4 para escritorio y taxiaero-vertical.mp4 para móvil/tablet
  source.src = isMobileOrTablet ? "taxiaero-vertical.mp4" : "taxiaero.mp4";
  video.appendChild(source);

  video.muted = true;
  video.loop = true;
  video.playsInline = true;

  try {
    await video.play();
  } catch (e) {
    // Ignorar errores de autoplay (navegador puede requerir interacción)
  }
}

initHeroVideo();

/* TIMELINE section */
const timelineList = document.getElementById("timelineList");
const timelineImage = document.getElementById("timelineImage").querySelector("img");
const timelineSection = document.querySelector(".section-timeline");
const timelineItems = [
  "Traslados aeropuerto",
  "Traslados empresariales",
  "Servicios nocturnos",
  "Traslados turísticos",
  "Vehículos ejecutivos",
  "Traslados grupales",
  "Mensajería y paquetería",
  "Servicios VIP",
  "Transporte a eventos",
  "Reservas recurrentes"
];

// mismas rutas para escritorio y móvil; el layout hace que en móvil la imagen ocupe el alto completo
const timelineImagesDesktop = [
  "img1.png",
  "https://source.unsplash.com/800x800/?business,taxi",
  "https://source.unsplash.com/800x800/?night,taxi",
  "https://source.unsplash.com/800x800/?tourism,taxi",
  "https://source.unsplash.com/800x800/?executive,car",
  "https://source.unsplash.com/800x800/?group,van",
  "https://source.unsplash.com/800x800/?parcel,delivery",
  "https://source.unsplash.com/800x800/?vip,car",
  "https://source.unsplash.com/800x800/?event,transport",
  "https://source.unsplash.com/800x800/?calendar,reservation"
];

const timelineImagesMobile = [
  "img1-vertical.png",
  "https://source.unsplash.com/800x800/?business,taxi",
  "https://source.unsplash.com/800x800/?night,taxi",
  "https://source.unsplash.com/800x800/?tourism,taxi",
  "https://source.unsplash.com/800x800/?executive,car",
  "https://source.unsplash.com/800x800/?group,van",
  "https://source.unsplash.com/800x800/?parcel,delivery",
  "https://source.unsplash.com/800x800/?vip,car",
  "https://source.unsplash.com/800x800/?event,transport",
  "https://source.unsplash.com/800x800/?calendar,reservation"
];

const isMobileTimeline = isMobileOrTablet;

timelineItems.forEach((label, i) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.innerText = label;
  btn.id = `tl-${i}`;
  btn.addEventListener("click", () => {
    // set active class
    Array.from(timelineList.children).forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    const images = isMobileTimeline ? timelineImagesMobile : timelineImagesDesktop;
    timelineImage.src = images[i];
    timelineImage.alt = label;
  });
  if (i === 0) btn.classList.add("active");
  timelineList.appendChild(btn);
});
/* set initial image */
const initialImages = isMobileTimeline ? timelineImagesMobile : timelineImagesDesktop;
timelineImage.src = initialImages[0];
timelineImage.alt = timelineItems[0];

/* CONTACT FORM: validations, captcha (suma), PDF generation and email sending (via EmailJS)
   NOTE: For EmailJS to work replace configuration constants above with your account/service/template data.
*/
const form = document.getElementById("reservationForm");
const formMessage = document.getElementById("formMessage");

// CAPTCHA generation (simple sum)
let captchaA = 0, captchaB = 0;
function genCaptcha() {
  captchaA = Math.floor(Math.random() * 9) + 1;
  captchaB = Math.floor(Math.random() * 9) + 1;
  document.getElementById("captchaLabel").innerText = `¿Cuánto es ${captchaA} + ${captchaB}?`;
}
genCaptcha();

 // helper validate
function validateFormData(fd) {
  const errors = [];
  const addError = (field, message) => errors.push({ field, message });

  if (!fd.get("codigo_vuelo")?.trim()) addError("codigo_vuelo", "Código de vuelo es requerido");
  if (!fd.get("hora_llegada")) addError("hora_llegada", "Hora de llegada es requerida");

  const fecha = (fd.get("fecha_llegada") || "").trim();
  const fechaRegex = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/;
  if (!fecha) {
    addError("fecha_llegada", "Fecha de llegada es requerida");
  } else if (!fechaRegex.test(fecha)) {
    addError("fecha_llegada", "Fecha de llegada inválida (use formato dd/mm/aaaa)");
  }

  if (!fd.get("lugar_destino")?.trim()) addError("lugar_destino", "Lugar de destino es requerido");
  if (!fd.get("num_personas") || Number(fd.get("num_personas")) < 1) addError("num_personas", "Número de personas inválido");
  if (!fd.get("nombre")?.trim()) addError("nombre", "Nombre requerido");
  if (!fd.get("apellido")?.trim()) addError("apellido", "Apellido requerido");
  if (!fd.get("identificacion")?.trim()) addError("identificacion", "Cédula o pasaporte requerido");

  const email = fd.get("email") || "";
  if (!/^\S+@\S+\.\S+$/.test(email)) addError("email", "Correo inválido");

  const telefono = fd.get("telefono") || "";
  if (!/^[0-9()+\s-]{6,}$/.test(telefono)) addError("telefono", "Teléfono inválido");

  const captcha = Number(document.getElementById("captchaInput").value || "");
  if (captcha !== (captchaA + captchaB)) addError("captcha", "Verificación CAPTCHA incorrecta");

  return errors;
}

// create PDF from form fields
function createPdf(formData) {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Reserva de Unidad - Cooperativa Taxi", 14, 20);
  doc.setFontSize(11);
  let y = 34;
  formData.forEach((value, key) => {
    doc.text(`${key}: ${String(value)}`, 14, y);
    y += 8;
    if (y > 270) { doc.addPage(); y = 20; }
  });
  return doc.output("datauristring"); // returns dataURI (base64) string
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // limpiar estados previos
  form.querySelectorAll("input").forEach((input) => input.classList.remove("error"));
  formMessage.textContent = "";
  formMessage.className = "form-message";

  const fd = new FormData(form);
  const errors = validateFormData(fd);
  if (errors.length) {
    formMessage.textContent = errors.map(e => e.message).join("; ");
    formMessage.classList.add("error");
    errors.forEach((err) => {
      const fieldEl = err.field === "captcha"
        ? document.getElementById("captchaInput")
        : form.querySelector(`[name="${err.field}"]`);
      if (fieldEl) fieldEl.classList.add("error");
    });
    return;
  }
  // Prepare object for PDF and email
  const obj = {};
  fd.forEach((v, k) => obj[k] = v);
  obj.to = SEND_TO_EMAIL;
  // generate PDF dataURI
  const pdfDataUri = createPdf(fd);

  // Prepare EmailJS (client)
  // EmailJS template should be configured to accept 'to_email' and 'attachment' (base64) fields.
  emailjs.init(EMAILJS_USER_ID);

  const base64 = pdfDataUri.split(";base64,")[1];
  // template params adapt to your EmailJS template
  const templateParams = {
    to_email: SEND_TO_EMAIL,
    subject: `Reserva - ${obj.nombre} ${obj.apellido}`,
    message: "Adjunto PDF con información de la reserva.",
    reservation_json: JSON.stringify(obj, null, 2),
    attachment: base64 // ensure your EmailJS template accepts this and you have enabled attachments
  };

  formMessage.textContent = "Enviando reserva...";
  formMessage.classList.remove("error");
  formMessage.classList.remove("success");

  try {
    const resp = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    formMessage.textContent = "Reserva Correcta. En minutos nos pondremos en contacto. Gracias por preferirnos.";
    formMessage.classList.add("success");
    form.reset();
    genCaptcha();
  } catch (err) {
    console.error(err);
    formMessage.textContent = "Error enviando la reserva. Intenta nuevamente.";
    formMessage.classList.add("error");
  }
});

/* Accessibility: allow nav links to scroll to sections smoothly and open Tarifario modal */
document.querySelectorAll(".nav-right a").forEach(a => {
  a.addEventListener("click", (ev) => {
    ev.preventDefault();
    const id = a.getAttribute("href").slice(1);
    if (id === "tarifario") {
      openTarifarioModal();
      return;
    }
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});



/* NAV background transparency on scroll: from 0.9 to 0.65 */
const headerNav = document.querySelector(".nav");
if (headerNav) {
  const updateNavTransparency = () => {
    if (window.scrollY > 0) {
      headerNav.classList.add("scrolled");
    } else {
      headerNav.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", updateNavTransparency, { passive: true });
  updateNavTransparency();
}

/* Contadores sección info */
function initInfoCounters() {
  const counters = document.querySelectorAll(".stat-number");
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = Number(el.dataset.target || "0");
    const duration = 2000;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = value.toLocaleString("es-ES");
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const onIntersect = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.dataset.done === "true") return;
        el.dataset.done = "true";
        animateCounter(el);
        observer.unobserve(el);
      }
    });
  };

  const observer = new IntersectionObserver(onIntersect, {
    threshold: 0.3
  });

  counters.forEach((el) => observer.observe(el));
}

initInfoCounters();

/* Scroll reveal effect for text elements */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    ".section-info .info-text, .section-about .about-card, .info-stats .stat, .section-contact h2, .section-contact label, .section-title, .timeline-list button"
  );
  if (!revealElements.length) return;

  revealElements.forEach((el) => {
    el.classList.add("reveal");
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

initScrollReveal();