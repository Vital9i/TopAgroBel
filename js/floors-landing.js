/**
 * ТопАгроБел — лендинг «Промышленные бетонные полы»
 * Ads landing: menu, video modal, forms, UTM, cases, FAQ, scroll UX
 */

document.addEventListener("DOMContentLoaded", () => {
  captureMarketingParams();
  initStickyHeader();
  initMobileMenu();
  initMessengerLinks();
  initSmoothScroll();
  initHeroMedia();
  initBrokenMedia();
  initVideoModal();
  initFloorCalc();
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

function getSiteHeader() {
  return document.querySelector("[data-site-header], .site-header, .home-header");
}

function initStickyHeader() {
  const header = getSiteHeader();
  if (!header) return;

  const root = document.documentElement;
  root.classList.add("has-fixed-header");

  const syncHeaderHeight = () => {
    root.style.setProperty("--home-header-h", `${header.offsetHeight}px`);
  };

  syncHeaderHeight();
  window.addEventListener("resize", syncHeaderHeight, { passive: true });

  let lastY = window.scrollY;
  let ticking = false;
  const topZone = 64;
  const minDelta = 6;

  const update = () => {
    const y = window.scrollY;
    header.classList.toggle("site-header--scrolled", y > 12);

    if (document.body.classList.contains("is-menu-open") || document.body.classList.contains("is-modal-open")) {
      header.classList.remove("site-header--hidden");
    } else if (y <= topZone) {
      header.classList.remove("site-header--hidden");
    } else if (y > lastY + minDelta) {
      header.classList.add("site-header--hidden");
    } else if (y < lastY - minDelta) {
      header.classList.remove("site-header--hidden");
    }

    lastY = y;
    ticking = false;
  };

  update();
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true }
  );
}

/* -------------------------------------------------------------------------- */
/* Mobile menu                                                                 */
/* -------------------------------------------------------------------------- */

function initMobileMenu() {
  const burger = document.querySelector("[data-burger]");
  const menu = document.querySelector("[data-mobile-menu]");
  if (!burger || !menu) return;

  const open = () => {
    getSiteHeader()?.classList.remove("site-header--hidden");
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    burger.setAttribute("aria-expanded", "true");
    document.body.classList.add("is-menu-open");
    burger.classList.add("is-active");
  };

  const close = () => {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    burger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("is-menu-open");
    burger.classList.remove("is-active");
  };

  burger.addEventListener("click", () => {
    if (menu.classList.contains("is-open")) close();
    else open();
  });

  menu.querySelectorAll("[data-close-mobile-menu]").forEach((el) => {
    el.addEventListener("click", close);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("is-open")) {
      close();
      burger.focus();
    }
  });
}

/* -------------------------------------------------------------------------- */
/* Messenger links                                                             */
/* -------------------------------------------------------------------------- */

function initMessengerLinks() {
  if (typeof CONTACT === "undefined") return;

  document.querySelectorAll("[data-messenger-links]").forEach((container) => {
    container.innerHTML = buildMessengerLinksHtml(container);
  });
}

function buildMessengerLinksHtml(container) {
  const compact = container.hasAttribute("data-messenger-compact");
  const inline = container.hasAttribute("data-messenger-inline");
  const nav = container.hasAttribute("data-messenger-nav");
  const classes = ["messenger-links"];
  if (compact) classes.push("messenger-links--compact");
  if (inline) classes.push("messenger-links--inline");
  if (nav) classes.push("messenger-links--nav");

  return `
    <div class="${classes.join(" ")}" role="group" aria-label="Написать Олегу">
      <a href="${CONTACT.whatsappUrl}" class="messenger-link messenger-link--whatsapp" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
      <a href="${CONTACT.telegramUrl}" class="messenger-link messenger-link--telegram" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
      </a>
      <a href="${CONTACT.viberUrl}" class="messenger-link messenger-link--viber" target="_blank" rel="noopener noreferrer" aria-label="Viber">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.398.002C9.473.028 5.331.344 3.014 2.467 1.294 4.177.693 6.698.623 9.82c-.06 2.724-.13 7.837 4.777 9.203h.004l-.004 2.315s-.037.98.588 1.177c.75.233 1.2-.484 1.912-1.254.395-.43.944-1.054 1.356-1.536 3.736.323 6.598-.414 6.92-.525.752-.247 5.026-.793 5.726-6.504.744-6.037-.358-9.868-2.317-11.52C19.586.442 15.669.016 11.398.002zm.093 1.947c3.883.015 7.244.39 8.858 1.689 1.533 1.227 2.402 4.597 1.767 9.718-.566 4.578-3.814 4.988-4.527 5.213-.276.09-2.778.724-5.932.412 0 0-2.348 2.826-3.078 3.552-.115.117-.247.163-.338.152-.117-.015-.15-.168-.148-.375l.021-3.676c-3.923-1.036-3.686-5.338-3.634-7.605.055-2.468.523-4.654 1.93-6.017C6.9 2.367 10.385 1.964 11.491 1.949zM12.062 5.5c-.094 0-.184.013-.27.037-.456.126-.718.588-.582 1.044.135.456.588.718 1.044.582.456-.135.718-.588.582-1.044a.832.832 0 0 0-.774-.619zm-2.562 1.01a.832.832 0 0 0-.619 1.394c1.877 1.877 1.877 4.926 0 6.803a.832.832 0 1 0 1.177 1.177c2.512-2.512 2.512-6.645 0-9.157a.828.828 0 0 0-.558-.217zm5.124 0c-.2 0-.401.076-.558.217-2.512 2.512-2.512 6.645 0 9.157a.832.832 0 1 0 1.177-1.177c-1.877-1.877-1.877-4.926 0-6.803a.832.832 0 0 0-.619-1.394zm-2.562 1.562c-.094 0-.184.013-.27.037-.456.126-.718.588-.582 1.044.338 1.138.338 2.366 0 3.504-.135.456.126.909.582 1.044.456.135.909-.126 1.044-.582a5.18 5.18 0 0 0 0-5.468.832.832 0 0 0-.774-.579z"/></svg>
      </a>
    </div>
  `;
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
    const header = getSiteHeader();
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
  const video = modal.querySelector("[data-video-player]") || modal.querySelector("video");
  const youtubeBox = modal.querySelector("[data-youtube-player]");
  const titleEl = modal.querySelector("[data-video-title]");
  const metaEl = modal.querySelector("[data-video-meta]");
  const closes = modal.querySelectorAll("[data-modal-close]");
  let lastFocus = null;

  function getYoutubeId(url) {
    if (window.YoutubePlayer?.parseId) return window.YoutubePlayer.parseId(url);
    if (!url) return "";
    const match = String(url).match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{6,})/,
    );
    return match ? match[1] : "";
  }

  function clearYoutube() {
    if (youtubeBox) {
      youtubeBox.innerHTML = "";
      youtubeBox.hidden = true;
    }
  }

  function clearVideo() {
    if (!video) return;
    video.pause();
    video.removeAttribute("src");
    video.removeAttribute("poster");
    video.load();
    video.hidden = true;
  }

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

    const youtubeId = getYoutubeId(src);
    clearVideo();
    clearYoutube();

    if (youtubeId && youtubeBox) {
      const iframe = window.YoutubePlayer?.createIframe
        ? window.YoutubePlayer.createIframe(youtubeId, title, true)
        : (() => {
            const el = document.createElement("iframe");
            el.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
            el.title = title || "YouTube video";
            el.allow =
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
            el.allowFullscreen = true;
            return el;
          })();
      iframe.className = "modal__youtube-frame";
      youtubeBox.appendChild(iframe);
      youtubeBox.hidden = false;
      if (video) video.hidden = true;
    } else if (video && src) {
      video.hidden = false;
      if (poster) video.setAttribute("poster", poster);
      video.src = src;
      video.load();
      const play = () => {
        video.play().catch(() => {});
      };
      video.addEventListener("loadeddata", play, { once: true });
    }

    modal.hidden = false;
    document.body.classList.add("is-modal-open");
    dialog?.focus();
  };

  const close = () => {
    clearVideo();
    clearYoutube();
    if (metaEl) {
      metaEl.innerHTML = "";
      metaEl.hidden = true;
    }
    modal.hidden = true;
    document.body.classList.remove("is-modal-open");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  };

  window.openSiteVideo = open;

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-video-open]");
    if (!trigger || trigger.closest("[data-youtube]")) return;
    e.preventDefault();
    e.stopPropagation();
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
}

/* -------------------------------------------------------------------------- */
/* Floor price calculator                                                      */
/* -------------------------------------------------------------------------- */

function formatMoney(value) {
  return new Intl.NumberFormat("ru-RU").format(Math.round(value));
}

function openModal(modal) {
  if (!modal) return;
  modal.hidden = false;
  document.body.classList.add("is-modal-open");
  modal.querySelector("input:not([type='hidden']), button")?.focus();
}

function closeModal(modal) {
  if (!modal) return;
  modal.hidden = true;
  if (!document.querySelector(".modal:not([hidden])")) {
    document.body.classList.remove("is-modal-open");
  }
}

function bindModalChrome(modal) {
  if (!modal) return;
  modal.querySelectorAll("[data-modal-close]").forEach((btn) => {
    btn.addEventListener("click", () => closeModal(modal));
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal(modal);
  });
}

function syncFloorOptionCards(scope) {
  const root = scope || document;
  root.querySelectorAll(".floor-option").forEach((option) => {
    const radio = option.querySelector(".floor-option__radio");
    const selectLabel = option.querySelector(".floor-option__select");
    const isSelected = radio?.checked === true;

    option.classList.toggle("floor-option--selected", isSelected);

    if (selectLabel) {
      selectLabel.textContent = isSelected ? "Выбрано" : "Выбрать";
    }
  });
}

function initFloorCalc() {
  const root = document.querySelector("[data-floor-calc]");
  if (!root) return;

  const areaInput = root.querySelector("[data-calc-area]");
  const areaError = root.querySelector("[data-calc-area-error]");
  const resultPanel = root.querySelector("[data-calc-result]");
  const totalEl = root.querySelector("[data-calc-total]");
  const metaEl = root.querySelector("[data-calc-meta]");
  const imageEl = root.querySelector("[data-calc-image]");
  const previewTitle = root.querySelector("[data-calc-preview-title]");
  const previewThickness = root.querySelector("[data-calc-preview-thickness]");
  const previewUse = root.querySelector("[data-calc-preview-use]");
  const previewObjects = root.querySelector("[data-calc-preview-objects]");
  const previewLayers = root.querySelector("[data-calc-preview-layers]");
  const typeInputs = root.querySelectorAll('input[name="floor_type"]');
  const calculateBtn = root.querySelector("[data-calc-calculate]");
  const resetBtn = root.querySelector("[data-calc-reset]");
  const orderBtn = root.querySelector("[data-calc-order]");
  const orderModal = document.querySelector("[data-calc-order-modal]");
  const orderForm = orderModal?.querySelector("[data-calc-order-form]");
  const orderSummary = orderModal?.querySelector("[data-calc-order-summary]");

  let current = {
    floorType: "Стандарт",
    price: 57,
    thickness: "12",
    area: 0,
    total: null,
    isConsult: false,
  };
  let hasCalculated = false;

  function getSelectedType() {
    return root.querySelector('input[name="floor_type"]:checked');
  }

  function setPostCalcVisible(visible) {
    if (resultPanel) resultPanel.hidden = !visible;
    if (resetBtn) resetBtn.hidden = !visible;
    if (orderBtn) orderBtn.hidden = !visible;
  }

  function syncPreview() {
    const selected = getSelectedType();
    if (!selected) return;

    const isConsult = selected.dataset.consult === "1" || selected.value === "Нужна консультация";

    if (imageEl && selected.dataset.image) {
      if (imageEl.getAttribute("src") !== selected.dataset.image) {
        imageEl.setAttribute("src", selected.dataset.image);
      }
      imageEl.setAttribute("alt", selected.dataset.imageAlt || `Разрез пола ${selected.value}`);
      imageEl.classList.toggle("calc-preview__image--portrait", isConsult);
    }
    if (previewTitle) previewTitle.textContent = selected.value;
    if (previewUse) previewUse.textContent = selected.dataset.use || "";
    if (previewObjects) previewObjects.textContent = selected.dataset.objects || "";
    if (previewLayers) previewLayers.textContent = selected.dataset.layers || "";
    if (previewThickness) {
      const thickness = selected.dataset.thickness || "";
      previewThickness.textContent = isConsult
        ? "Конструкция индивидуально"
        : `Толщина до ${thickness} см`;
    }

    syncFloorOptionCards(root);
  }

  function update() {
    const selected = getSelectedType();
    if (!selected || !areaInput) return;

    const isConsult = selected.dataset.consult === "1" || selected.value === "Нужна консультация";
    const priceRaw = selected.dataset.price;
    const price = priceRaw === "" || priceRaw == null ? null : Number(priceRaw) || 0;
    const thickness = selected.dataset.thickness || "";
    const area = Math.max(0, Number(areaInput.value) || 0);
    const total = price != null ? area * price : null;
    const currencyEl = root.querySelector("[data-calc-currency]");

    current = {
      floorType: selected.value,
      price,
      thickness,
      area,
      total: total == null ? null : Math.round(total),
      isConsult,
    };

    if (isConsult || price == null) {
      if (totalEl) totalEl.textContent = "по запросу";
      if (currencyEl) currencyEl.hidden = true;
      if (metaEl) {
        const areaPart = area ? ` · ${area} м²` : "";
        metaEl.textContent = `${selected.value}${areaPart} · подберём конструкцию`;
      }
    } else {
      if (totalEl) totalEl.textContent = formatMoney(total);
      if (currencyEl) currencyEl.hidden = false;
      if (metaEl) {
        metaEl.textContent = `${selected.value} · от ${price} BYN/м² · до ${thickness} см · ${area || "—"} м²`;
      }
    }

    syncPreview();

    const typeError = root.querySelector("[data-floor-type-error]");
    if (typeError) typeError.textContent = "";
  }

  function validateArea() {
    const selected = getSelectedType();
    const isConsult = selected?.dataset.consult === "1" || selected?.value === "Нужна консультация";
    if (isConsult) {
      if (areaError) areaError.textContent = "";
      return true;
    }
    const minArea = Number(areaInput?.min) || 100;
    const area = Number(areaInput?.value);
    if (!(area >= minArea)) {
      if (areaError) areaError.textContent = `Минимум ${minArea} м²`;
      areaInput?.focus();
      return false;
    }
    if (areaError) areaError.textContent = "";
    return true;
  }

  function syncOrderForm() {
    if (!orderForm) return;
    const setVal = (sel, value) => {
      const el = orderForm.querySelector(sel);
      if (el) el.value = value == null ? "" : String(value);
    };
    setVal("[data-order-floor-type]", current.floorType);
    setVal("[data-order-area]", current.area || "");
    setVal("[data-order-price]", current.price);
    setVal("[data-order-total]", current.total);
    const serviceInput = orderForm.querySelector('input[name="selected_service"]');
    if (serviceInput) {
      serviceInput.value = `Промышленный бетонный пол — ${current.floorType}`;
    }
    if (orderSummary) {
      if (current.isConsult || current.price == null) {
        const areaPart = current.area ? ` · ${current.area} м²` : "";
        orderSummary.textContent = `${current.floorType}${areaPart} · стоимость по запросу`;
      } else {
        orderSummary.textContent = `${current.floorType} · ${current.area} м² · от ${current.price} BYN/м² · ${formatMoney(current.total)} BYN`;
      }
    }
  }

  function calculate() {
    if (!validateArea()) {
      setPostCalcVisible(false);
      hasCalculated = false;
      return false;
    }
    update();
    hasCalculated = true;
    setPostCalcVisible(true);
    return true;
  }

  function resetCalc() {
    hasCalculated = false;
    setPostCalcVisible(false);
    if (areaInput) areaInput.value = "";
    if (areaError) areaError.textContent = "";
    const firstType = root.querySelector('input[name="floor_type"]');
    if (firstType) {
      firstType.checked = true;
      syncPreview();
    }
    areaInput?.focus();
  }

  areaInput?.addEventListener("focus", () => {
    if (areaInput.value === "0") areaInput.value = "";
  });

  areaInput?.addEventListener("input", () => {
    if (areaError) areaError.textContent = "";
    if (hasCalculated) {
      setPostCalcVisible(false);
      hasCalculated = false;
    }
  });

  typeInputs.forEach((input) =>
    input.addEventListener("change", () => {
      syncPreview();
      if (hasCalculated) calculate();
    }),
  );

  // Mobile picks point to radios up in the cards — block default focus scroll jump.
  root.querySelectorAll(".floor-type-pick").forEach((label) => {
    label.addEventListener("click", (e) => {
      const id = label.getAttribute("for");
      const radio = id ? document.getElementById(id) : null;
      if (!radio) return;

      e.preventDefault();
      if (!radio.checked) {
        radio.checked = true;
        radio.dispatchEvent(new Event("change", { bubbles: true }));
      }
      radio.focus({ preventScroll: true });
    });
  });

  calculateBtn?.addEventListener("click", () => {
    calculate();
  });

  resetBtn?.addEventListener("click", () => {
    resetCalc();
  });

  areaInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      calculate();
    }
  });

  orderBtn?.addEventListener("click", () => {
    if (!hasCalculated && !calculate()) return;
    if (!validateArea()) return;
    update();
    syncOrderForm();
    clearFormErrors(orderForm);
    openModal(orderModal);
  });

  bindModalChrome(orderModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && orderModal && !orderModal.hidden) closeModal(orderModal);
  });

  setPostCalcVisible(false);
  syncFloorOptionCards(root);
  syncPreview();
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

        redirectToThankYou({
          name: String(formData.get("name") || "").trim(),
          phone: String(formData.get("phone") || "").trim(),
          formId: form.id || (form.hasAttribute("data-calc-order-form") ? "calc-order" : "lead-form"),
          source: `Бетонные полы · ${String(formData.get("selected_service") || "Заявка")}`,
        });
        return;

        showFormSuccess(form);
        const calcOrderModal = form.closest("[data-calc-order-modal]");
        const orderModal = form.closest("[data-order-modal]");
        form.querySelectorAll(".field--error").forEach((el) => el.classList.remove("field--error"));
        form.querySelectorAll(".field__error").forEach((el) => {
          el.textContent = "";
        });
        const fileName = form.querySelector("[data-file-name]");
        if (fileName) fileName.textContent = "Файл не выбран";
        if (calcOrderModal || orderModal) {
          window.setTimeout(() => {
            form.reset();
            const phoneInput = form.querySelector('input[name="phone"]');
            if (phoneInput) phoneInput.value = "+375";
            closeModal(calcOrderModal || orderModal);
            clearFormErrors(form);
          }, 1400);
        } else {
          form.reset();
          const phoneInput = form.querySelector('input[name="phone"]');
          if (phoneInput) phoneInput.value = "+375";
        }
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
    bindModalChrome(orderModal);
    document.querySelectorAll("[data-open-order]").forEach((btn) => {
      btn.addEventListener("click", () => openModal(orderModal));
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !orderModal.hidden) closeModal(orderModal);
    });
  }
}

function validateLeadForm(form) {
  clearFormErrors(form);
  let ok = true;
  const isCalcOrder = form.hasAttribute("data-calc-order-form");

  const required = ["phone"];
  if (!isCalcOrder) {
    if (form.querySelector('input[name="floor_type"][type="radio"], select[name="floor_type"]')) {
      required.unshift("floor_type");
    } else if (form.elements.object_type) {
      required.unshift("object_type");
    }
    if (form.elements.area && form.elements.area.type !== "hidden") {
      required.unshift("area");
    }
  }

  required.forEach((name) => {
    const field = form.elements[name];
    if (!field) return;
    if (name === "floor_type") {
      const radios = form.querySelectorAll('input[name="floor_type"][type="radio"]');
      if (radios.length) {
        const checked = form.querySelector('input[name="floor_type"][type="radio"]:checked');
        if (!checked) {
          const err = form.querySelector("[data-floor-type-error]");
          if (err) err.textContent = "Выберите тип пола";
          ok = false;
        }
        return;
      }
      const value = String(field.value || "").trim();
      if (!value) {
        setFieldError(field, "Выберите тип пола");
        ok = false;
      }
      return;
    }
    const value = String(field.value || "").trim();
    if (!value || value === "+375") {
      setFieldError(field, "Заполните поле");
      ok = false;
    }
  });

  const area = form.elements.area;
  if (area && area.value && area.type !== "hidden") {
    const num = Number(area.value);
    const minArea = Number(area.min) || 100;
    if (!(num >= minArea)) {
      setFieldError(area, `Минимальная площадь — ${minArea} м²`);
      ok = false;
    }
  }

  const phone = form.elements.phone;
  if (phone) {
    const digits = String(phone.value || "").replace(/\D/g, "");
    if (digits.length < 12) {
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
 * Отправка заявки в Telegram (как на сайте аренды техники).
 */
async function submitLeadForm(formData) {
  if (typeof sendLeadToTelegram !== "function") {
    throw new Error("Telegram module is not loaded");
  }

  await sendLeadToTelegram({
    name: formData.name || "",
    phone: formData.phone || "",
    page: "Бетонные полы",
    form_label: formData.selected_service || formData.source || "",
    floor_type: formData.floor_type || "",
    area: formData.floor_area || formData.area || "",
    price_per_m2: formData.floor_base_price || formData.price_per_m2 || "",
    estimated_total: formData.floor_estimated_total || formData.estimated_total || "",
    selected_service: formData.selected_service || "",
    source: formData.selected_service || formData.source || "",
  });

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
      const calc = document.querySelector("#floor-calculator") || document.querySelector("#calculator");
      if (calc) {
        const header = getSiteHeader();
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
    if (e.target.closest('[href="#floor-calculator"], [href="#calculator"], [data-open-order]')) {
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
        const header = getSiteHeader();
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
