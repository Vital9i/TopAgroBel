/**
 * ТопАгроБел — лендинг «Промышленные бетонные полы»
 * Ads landing: menu, video modal, forms, UTM, cases, FAQ, scroll UX
 */

document.addEventListener("DOMContentLoaded", () => {
  captureMarketingParams();
  initSmoothScroll();
  initHeroMedia();
  initBrokenMedia();
  initVideoModal();
  initLeadForms();
  initServicePick();
  initFileInputs();
  initFaq();
  initScrollAnimations();
  initBackToTop();
  initFinalCtaProject();
  initClickAnalytics();
});

/* -------------------------------------------------------------------------- */
/* Marketing parameters                                                        */
/* -------------------------------------------------------------------------- */

function captureMarketingParams() {
  const keys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "gclid",
    "yclid",
  ];
  const params = new URLSearchParams(window.location.search);
  const stored = getStoredMarketingParams();
  keys.forEach((key) => {
    const value = params.get(key);
    if (value) stored[key] = value;
  });
  try {
    sessionStorage.setItem("tab_ads_params", JSON.stringify(stored));
  } catch (_) {
    /* sessionStorage может быть недоступен */
  }
}

function getStoredMarketingParams() {
  try {
    const raw = sessionStorage.getItem("tab_ads_params");
    return raw ? JSON.parse(raw) : {};
  } catch (_) {
    return {};
  }
}

/* -------------------------------------------------------------------------- */
/* Sticky header                                                               */
/* -------------------------------------------------------------------------- */

function initStickyHeader() {
  const header = document.querySelector(".home-header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("site-header--scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* -------------------------------------------------------------------------- */
/* Mobile menu                                                                 */
/* -------------------------------------------------------------------------- */

function initMobileMenu() {
  const burger = document.querySelector("[data-burger]");
  const menu = document.querySelector("[data-mobile-menu]");
  if (!burger || !menu) return;

  const open = () => {
    menu.hidden = false;
    burger.setAttribute("aria-expanded", "true");
    document.body.classList.add("is-menu-open");
    burger.classList.add("is-active");
  };

  const close = () => {
    menu.hidden = true;
    burger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("is-menu-open");
    burger.classList.remove("is-active");
  };

  burger.addEventListener("click", () => {
    const expanded = burger.getAttribute("aria-expanded") === "true";
    if (expanded) close();
    else open();
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", close);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") {
      close();
      burger.focus();
    }
  });
}

/* -------------------------------------------------------------------------- */
/* Smooth scroll                                                               */
/* -------------------------------------------------------------------------- */

function initSmoothScroll() {
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const header = document.querySelector(".home-header");
    const offset = header ? header.offsetHeight + 8 : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  });
}

/* -------------------------------------------------------------------------- */
/* Hero media (poster on mobile / reduced motion)                              */
/* -------------------------------------------------------------------------- */

function initHeroMedia() {
  const video = document.querySelector(".hero__media video");
  if (!video) return;
  const preferPoster =
    window.matchMedia("(max-width: 768px)").matches ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    navigator.connection?.saveData;
  if (preferPoster) {
    video.removeAttribute("autoplay");
    video.pause();
    video.removeAttribute("src");
    video.querySelectorAll("source").forEach((s) => s.remove());
    video.load();
    video.classList.add("is-poster-only");
  }
}

function initBrokenMedia() {
  document.addEventListener(
    "error",
    (e) => {
      if (e.target && e.target.tagName === "IMG") {
        e.target.style.display = "none";
      }
    },
    true,
  );
}

/* -------------------------------------------------------------------------- */
/* Video modal                                                                 */
/* -------------------------------------------------------------------------- */

function initVideoModal() {
  const modal = document.querySelector("[data-video-modal]");
  if (!modal) return;

  const dialog = modal.querySelector(".modal__dialog");
  const video = modal.querySelector("video");
  const titleEl = modal.querySelector("[data-video-title]");
  const metaEl = modal.querySelector("[data-video-meta]");
  const closes = modal.querySelectorAll("[data-modal-close]");
  let lastFocus = null;

  const open = ({ src, poster, title, metaHtml }) => {
    lastFocus = document.activeElement;
    if (titleEl) titleEl.textContent = title || "Видео";
    if (metaEl) {
      if (metaHtml) {
        metaEl.innerHTML = metaHtml;
        metaEl.hidden = false;
      } else {
        metaEl.innerHTML = "";
        metaEl.hidden = true;
      }
    }
    if (video) {
      video.pause();
      video.removeAttribute("src");
      if (poster) video.setAttribute("poster", poster);
      else video.removeAttribute("poster");
      if (src) {
        video.src = src;
        video.load();
        const play = () => {
          video.play().catch(() => {});
        };
        video.addEventListener("loadeddata", play, { once: true });
      }
    }
    modal.hidden = false;
    document.body.classList.add("is-modal-open");
    dialog?.focus();
  };

  const close = () => {
    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
    if (metaEl) {
      metaEl.innerHTML = "";
      metaEl.hidden = true;
    }
    modal.hidden = true;
    document.body.classList.remove("is-modal-open");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  };

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-video-open]");
    if (!trigger) return;
    e.preventDefault();
    open({
      src: trigger.getAttribute("data-video-src") || "",
      poster: trigger.getAttribute("data-video-poster") || "",
      title: trigger.getAttribute("data-video-title") || "Видео",
    });
  });

  closes.forEach((btn) => btn.addEventListener("click", close));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) close();
  });

  /* Inline company intro player (cover → play with controls) */
  const cover = document.querySelector("[data-inline-video]");
  if (cover) {
    const shell = cover.closest(".video-shell");
    const inlineVideo = shell?.querySelector("video");
    cover.addEventListener("click", () => {
      if (!inlineVideo) return;
      cover.hidden = true;
      inlineVideo.controls = true;
      inlineVideo.play().catch(() => {});
    });
  }
}

/* -------------------------------------------------------------------------- */
/* Lead forms                                                                  */
/* -------------------------------------------------------------------------- */

function initLeadForms() {
  document.querySelectorAll("[data-lead-form]").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validateLeadForm(form)) return;

      const submitBtn = form.querySelector('[type="submit"]');
      const defaultText = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Отправляем…";
      }

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      const marketing = getStoredMarketingParams();

      const lead = {
        ...payload,
        ...marketing,
        page_url: window.location.href,
        referrer: document.referrer || "",
        submitted_at: new Date().toISOString(),
        selected_service: formData.get("selected_service") || "",
        screen_width: window.innerWidth,
      };

      try {
        await submitLeadForm(lead);
        sendLeadAnalytics(lead);
        showFormSuccess(form);
        form.reset();
        clearFormErrors(form);
        const fileName = form.querySelector("[data-file-name]");
        if (fileName) fileName.textContent = "Файл не выбран";
      } catch (_) {
        showFormError(form, "Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = defaultText;
        }
      }
    });

    form.querySelectorAll("input, select, textarea").forEach((field) => {
      field.addEventListener("input", () => clearFieldError(field));
      field.addEventListener("change", () => clearFieldError(field));
    });
  });

  /* Quick request modal */
  const orderModal = document.querySelector("[data-order-modal]");
  if (orderModal) {
    document.querySelectorAll("[data-open-order]").forEach((btn) => {
      btn.addEventListener("click", () => {
        orderModal.hidden = false;
        document.body.classList.add("is-modal-open");
        orderModal.querySelector("input, button")?.focus();
      });
    });
    orderModal.querySelectorAll("[data-modal-close]").forEach((btn) => {
      btn.addEventListener("click", () => {
        orderModal.hidden = true;
        document.body.classList.remove("is-modal-open");
      });
    });
    orderModal.addEventListener("click", (e) => {
      if (e.target === orderModal) {
        orderModal.hidden = true;
        document.body.classList.remove("is-modal-open");
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !orderModal.hidden) {
        orderModal.hidden = true;
        document.body.classList.remove("is-modal-open");
      }
    });
  }
}

function validateLeadForm(form) {
  clearFormErrors(form);
  let ok = true;

  const required = ["object_type", "area", "phone", "consent"];
  required.forEach((name) => {
    const field = form.elements[name];
    if (!field) return;
    if (name === "consent") {
      if (!field.checked) {
        setFieldError(field, "Нужно согласие на обработку данных");
        ok = false;
      }
      return;
    }
    const value = String(field.value || "").trim();
    if (!value) {
      setFieldError(field, "Заполните поле");
      ok = false;
    }
  });

  const area = form.elements.area;
  if (area && area.value) {
    const num = Number(area.value);
    if (!(num > 0)) {
      setFieldError(area, "Площадь должна быть положительным числом");
      ok = false;
    }
  }

  const phone = form.elements.phone;
  if (phone && phone.value) {
    const digits = String(phone.value).replace(/\D/g, "");
    if (digits.length < 9) {
      setFieldError(phone, "Введите корректный номер телефона");
      ok = false;
    }
  }

  return ok;
}

function setFieldError(field, message) {
  const wrap = field.closest(".field") || field.parentElement;
  if (!wrap) return;
  wrap.classList.add("field--error");
  let err = wrap.querySelector(".field__error");
  if (!err) {
    err = document.createElement("p");
    err.className = "field__error";
    wrap.appendChild(err);
  }
  err.textContent = message;
}

function clearFieldError(field) {
  const wrap = field.closest(".field") || field.parentElement;
  if (!wrap) return;
  wrap.classList.remove("field--error");
  const err = wrap.querySelector(".field__error");
  if (err) err.textContent = "";
}

function clearFormErrors(form) {
  form.querySelectorAll(".field--error").forEach((el) => el.classList.remove("field--error"));
  form.querySelectorAll(".field__error").forEach((el) => {
    el.textContent = "";
  });
  form.querySelectorAll("[data-form-message]").forEach((el) => {
    el.hidden = true;
    el.textContent = "";
    el.classList.remove("form-message--error", "form-message--success");
  });
}

function showFormSuccess(form) {
  const msg = form.querySelector("[data-form-message]");
  if (!msg) return;
  msg.hidden = false;
  msg.classList.add("form-message--success");
  msg.textContent =
    "Спасибо! Заявка принята. Мы свяжемся с вами для уточнения параметров объекта.";
}

function showFormError(form, text) {
  const msg = form.querySelector("[data-form-message]");
  if (!msg) return;
  msg.hidden = false;
  msg.classList.add("form-message--error");
  msg.textContent = text;
}

/**
 * Здесь будет подключение CRM, Telegram, email или backend endpoint.
 * Сейчас — mock-задержка для демонстрации UX.
 */
async function submitLeadForm(formData) {
  await new Promise((resolve) => setTimeout(resolve, 900));
  // Пример будущей отправки:
  // await fetch("/api/lead", { method: "POST", body: JSON.stringify(formData) });
  console.info("Lead mock submitted", formData);
  return { ok: true };
}

function sendLeadAnalytics() {
  // Здесь будут события Google Ads, Google Analytics и Яндекс Метрики.
}

/* -------------------------------------------------------------------------- */
/* Service pick from solution cards                                            */
/* -------------------------------------------------------------------------- */

function initServicePick() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-pick-service]");
    if (!btn) return;
    const service = btn.getAttribute("data-pick-service") || "";
    document.querySelectorAll('input[name="selected_service"]').forEach((input) => {
      input.value = service;
    });
    const notice = document.querySelector("[data-service-notice]");
    if (notice) {
      notice.hidden = false;
      notice.textContent = `Выбрано: ${service}`;
    }
    if (btn.tagName === "BUTTON") {
      e.preventDefault();
      const calc = document.querySelector("#calculator");
      if (calc) {
        const header = document.querySelector(".home-header");
        const offset = header ? header.offsetHeight + 8 : 0;
        const top = calc.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  });
}

function initClickAnalytics() {
  document.addEventListener("click", (e) => {
    const phone = e.target.closest('a[href^="tel:"]');
    if (phone) {
      // Google Ads / Метрика: клик по телефону
      return;
    }
    if (e.target.closest("[data-video-open], [data-inline-video]")) {
      // Google Ads / Метрика: просмотр видео
      return;
    }
    if (e.target.closest('[href="#calculator"], [data-open-order]')) {
      // Google Ads / Метрика: интерес к форме
    }
  });
}

function initFinalCtaProject() {
  document.querySelectorAll("[data-focus-file]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const calc = document.querySelector("#calculator");
      const file = document.querySelector('#calculator input[type="file"]');
      if (calc) {
        const header = document.querySelector(".home-header");
        const offset = header ? header.offsetHeight + 8 : 0;
        const top = calc.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
      setTimeout(() => file?.focus(), 400);
    });
  });
}

/* -------------------------------------------------------------------------- */
/* File inputs                                                                 */
/* -------------------------------------------------------------------------- */

function initFileInputs() {
  document.querySelectorAll("[data-file-input]").forEach((input) => {
    const nameEl = input.closest(".field")?.querySelector("[data-file-name]");
    input.addEventListener("change", () => {
      const file = input.files && input.files[0];
      if (nameEl) nameEl.textContent = file ? file.name : "Файл не выбран";
    });
  });
}

/* -------------------------------------------------------------------------- */
/* FAQ                                                                         */
/* -------------------------------------------------------------------------- */

function initFaq() {
  const root = document.querySelector("[data-faq]");
  if (!root) return;

  root.addEventListener("click", (e) => {
    const btn = e.target.closest(".faq__q");
    if (!btn || !root.contains(btn)) return;
    const item = btn.closest(".faq__item");
    const open = btn.getAttribute("aria-expanded") === "true";

    root.querySelectorAll(".faq__q").forEach((q) => {
      q.setAttribute("aria-expanded", "false");
      q.closest(".faq__item")?.classList.remove("is-open");
    });

    if (!open && item) {
      btn.setAttribute("aria-expanded", "true");
      item.classList.add("is-open");
    }
  });
}

/* -------------------------------------------------------------------------- */
/* Scroll animations                                                           */
/* -------------------------------------------------------------------------- */

function initScrollAnimations() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;
  if (reduce) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );
  items.forEach((el) => io.observe(el));
}

/* -------------------------------------------------------------------------- */
/* Back to top                                                                 */
/* -------------------------------------------------------------------------- */

function initBackToTop() {
  const btn = document.querySelector("[data-back-top]");
  if (!btn) return;
  const toggle = () => {
    btn.hidden = window.scrollY < 480;
  };
  toggle();
  window.addEventListener("scroll", toggle, { passive: true });
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
