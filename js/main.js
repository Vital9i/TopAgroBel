/**
 * Навигация, аккордеон FAQ, формы и интерактив главной (этапы, Swiper).
 */
(() => {
  function wireMobileNav(nav, toggle) {
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => {
      const open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", String(!open));
      toggle.setAttribute("aria-expanded", String(!open));
    });
  }

  wireMobileNav(
    document.querySelector(".home-main-nav"),
    document.querySelector(".home-nav-toggle"),
  );

  function wireAutoHideHeader() {
    const header = document.querySelector(".home-header");
    if (!header) return;

    const root = document.documentElement;
    root.classList.add("has-fixed-header");

    const nav = document.querySelector(".home-main-nav");
    const toggle = document.querySelector(".home-nav-toggle");

    const syncHeaderHeight = () => {
      root.style.setProperty("--home-header-h", `${header.offsetHeight}px`);
    };

    syncHeaderHeight();
    window.addEventListener("resize", syncHeaderHeight, { passive: true });

    let lastY = window.scrollY;
    let ticking = false;
    const topZone = 64;
    const minDelta = 6;

    const closeMobileNav = () => {
      if (!nav || nav.getAttribute("data-open") !== "true") return;
      nav.setAttribute("data-open", "false");
      toggle?.setAttribute("aria-expanded", "false");
    };

    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const y = window.scrollY;

          if (y <= topZone) {
            header.classList.remove("home-header--hidden");
          } else if (y > lastY + minDelta) {
            header.classList.add("home-header--hidden");
            closeMobileNav();
          } else if (y < lastY - minDelta) {
            header.classList.remove("home-header--hidden");
          }

          lastY = y;
          ticking = false;
        });
      },
      { passive: true },
    );
  }

  wireAutoHideHeader();

  document.querySelectorAll(".faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-q");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const isOpen = item.getAttribute("data-open") === "true";
      item.setAttribute("data-open", String(!isOpen));
      btn.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  document.querySelectorAll("[data-contact-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const consent = form.querySelector('input[name="consent"]');
      if (consent && !consent.checked) {
        window.alert("Подтвердите согласие на обработку персональных данных.");
        consent.focus();
        return;
      }
      window.alert(
        "Заявка принята (демо): подключите форму к почте, CRM или бэкенду.",
      );
      form.reset();
    });
  });

  function wirePhoneMask() {
    document.querySelectorAll('input[name="phone"]').forEach((input) => {
      input.addEventListener("input", () => {
        let digits = input.value.replace(/\D/g, "");
        if (digits.startsWith("375")) digits = digits.slice(3);
        else if (digits.startsWith("80")) digits = digits.slice(2);
        digits = digits.slice(0, 9);
        let formatted = "+375";
        if (digits.length > 0) formatted += ` (${digits.slice(0, 2)}`;
        if (digits.length >= 2) formatted += `) ${digits.slice(2, 5)}`;
        if (digits.length >= 5) formatted += `-${digits.slice(5, 7)}`;
        if (digits.length >= 7) formatted += `-${digits.slice(7, 9)}`;
        input.value = formatted;
      });
    });
  }

  wirePhoneMask();

  function wireScrollSpy() {
    const anchors = [...document.querySelectorAll("[data-nav-anchor]")];
    if (!anchors.length) return;

    const sections = anchors
      .map((a) => {
        const id = a.getAttribute("href")?.slice(1);
        const el = id ? document.getElementById(id) : null;
        return el ? { link: a, el } : null;
      })
      .filter(Boolean);

    if (!sections.length) return;

    const setActive = (id) => {
      anchors.forEach((a) => {
        a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`);
        a.removeAttribute("aria-current");
      });
      const active = anchors.find((a) => a.getAttribute("href") === `#${id}`);
      active?.setAttribute("aria-current", "page");
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (visible?.target?.id) setActive(visible.target.id);
        },
        { rootMargin: "-40% 0px -45% 0px", threshold: [0, 0.25, 0.5] },
      );
      sections.forEach(({ el }) => observer.observe(el));
    }
  }

  wireScrollSpy();

  function wireStickyCta() {
    const sticky = document.getElementById("home-sticky-cta");
    const formSection = document.getElementById("zakaz-consult");
    if (!sticky || !formSection) return;

    const show = () => sticky.removeAttribute("hidden");
    const hide = () => sticky.setAttribute("hidden", "");

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) hide();
            else if (window.scrollY > 400) show();
          });
        },
        { threshold: 0.1 },
      );
      observer.observe(formSection);
    } else {
      show();
    }
  }

  wireStickyCta();

  document.addEventListener("click", (event) => {
    const el = event.target.closest("[data-scroll-target]");
    if (!el) return;
    const sel = el.getAttribute("data-scroll-target");
    if (!sel) return;
    const target = document.querySelector(sel);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  /**
   * @param {HTMLElement | null} root
   * @param {{ jsonId: string; sidebarSelector: string; panelsSelector: string; buttonClass: string; numSpanClass: string; panelIdPrefix: string; tabIdPrefix: string }} cfg
   */
  function wireTabStages(root, cfg) {
    const jsonEl = document.getElementById(cfg.jsonId);
    if (!root || !jsonEl) return;
    let stages = [];
    try {
      stages = JSON.parse(jsonEl.textContent || "[]");
    } catch {
      stages = [];
    }
    const defaultIdRaw =
      root.dataset.stageDefault ??
      stages[Math.min(4, Math.max(0, stages.length - 1))]?.id ??
      stages[0]?.id;
    const sidebar = root.querySelector(cfg.sidebarSelector);
    const panelsWrap = root.querySelector(cfg.panelsSelector);
    if (!sidebar || !panelsWrap || !stages.length) return;

    const buttonsById = new Map();

    stages.forEach((s, i) => {
      const bid = String(s.id).padStart(2, "0");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = cfg.buttonClass;
      btn.setAttribute("role", "tab");
      btn.dataset.stageId = bid;
      const panelDomId = `${cfg.panelIdPrefix}-${bid}`;
      const tabDomId = `${cfg.tabIdPrefix}-${bid}`;
      btn.setAttribute("aria-controls", panelDomId);
      btn.id = tabDomId;
      btn.innerHTML = `
          <span class="${cfg.numSpanClass}">${bid}</span>
          <span>${s.title ?? ""}</span>`;
      sidebar.append(btn);
      buttonsById.set(bid, btn);

      const art = document.createElement("article");
      art.id = panelDomId;
      art.dataset.stageBid = bid;
      art.setAttribute("role", "tabpanel");
      art.setAttribute("aria-labelledby", tabDomId);
      art.innerHTML = `
          <h3>${s.title ?? ""}</h3>
          <p>${s.text ?? ""}</p>`;
      panelsWrap.append(art);

      btn.addEventListener("click", () => {
        const activeId = bid;
        buttonsById.forEach((b, id) => {
          b.setAttribute("aria-current", id === activeId ? "true" : "false");
        });
        panelsWrap.querySelectorAll("article").forEach((a) => {
          a.dataset.visible = a.dataset.stageBid === bid ? "true" : "false";
        });
      });

      btn.addEventListener("keydown", (ev) => {
        if (ev.key !== "ArrowDown" && ev.key !== "ArrowUp") return;
        ev.preventDefault();
        const next = ev.key === "ArrowDown" ? i + 1 : i - 1;
        const bounded = Math.max(0, Math.min(stages.length - 1, next));
        const nid = String(stages[bounded].id).padStart(2, "0");
        buttonsById.get(nid)?.focus();
      });
    });

    const defaultBid = String(defaultIdRaw).padStart(2, "0");
    buttonsById.get(defaultBid)?.click();
  }

  /**
   * @param {{ id: number; title?: string; text?: string; image?: string; alt?: string }} stage
   * @param {string} bid
   * @param {string} tabDomId
   * @param {string} panelDomId
   */
  function renderHomeStagePanel(stage, bid, tabDomId, panelDomId, stageIndex, totalStages) {
    const img = stage.image ?? "";
    const alt = stage.alt ?? stage.title ?? "";
    const prevDisabled = stageIndex <= 0 ? "disabled" : "";
    const nextDisabled = stageIndex >= totalStages - 1 ? "disabled" : "";
    return `
      <article
        class="home-stage-panel"
        id="${panelDomId}"
        data-stage-bid="${bid}"
        role="tabpanel"
        aria-labelledby="${tabDomId}"
        data-visible="false"
      >
        <div class="home-stage-panel__visual">
          <img src="${img}" alt="${alt}" width="960" height="540" loading="lazy" decoding="async">
        </div>
        <div class="home-stage-panel__slant" aria-hidden="true"></div>
        <div class="home-stage-panel__content">
          <p class="home-stage-panel__num">${bid}</p>
          <h3 class="home-stage-panel__title">${stage.title ?? ""}</h3>
          <p class="home-stage-panel__text">${stage.text ?? ""}</p>
          <div class="home-stage-panel__nav">
            <button type="button" class="home-stage-panel__nav-btn" data-stage-prev ${prevDisabled} aria-label="Предыдущий этап">← Назад</button>
            <button type="button" class="home-stage-panel__nav-btn" data-stage-next ${nextDisabled} aria-label="Следующий этап">Далее →</button>
          </div>
          <a class="home-btn-solid home-btn-scroll home-stage-panel__cta" href="#zakaz-consult" data-scroll-target="#zakaz-consult">Получить расчёт</a>
        </div>
      </article>`;
  }

  function wireHomeConstructionStages(root) {
    const jsonEl = document.getElementById("home-stages-json");
    if (!root || !jsonEl) return;

    let stages = [];
    try {
      stages = JSON.parse(jsonEl.textContent || "[]");
    } catch {
      stages = [];
    }

    const sidebar = root.querySelector(".home-stages-sidebar");
    const panelsWrap = root.querySelector(".home-stage-panels");
    const mobileWrap = root.querySelector(".home-stages__mobile");
    if (!sidebar || !panelsWrap || !mobileWrap || !stages.length) return;

    const defaultIdRaw = root.dataset.stageDefault ?? stages[0]?.id;
    const buttonsById = new Map();
    let lastPhase = "";

    const activateStage = (bid) => {
      buttonsById.forEach((b, id) => {
        b.setAttribute("aria-selected", id === bid ? "true" : "false");
      });
      panelsWrap.querySelectorAll(".home-stage-panel").forEach((panel) => {
        panel.dataset.visible = panel.dataset.stageBid === bid ? "true" : "false";
      });
    };

    stages.forEach((stage, i) => {
      const bid = String(stage.id).padStart(2, "0");
      const panelDomId = `stage-panel-${bid}`;
      const tabDomId = `stage-tab-${bid}`;

      if (stage.phase && stage.phase !== lastPhase) {
        lastPhase = stage.phase;
        const phaseEl = document.createElement("p");
        phaseEl.className = "home-stages-phase";
        phaseEl.textContent = stage.phase;
        sidebar.append(phaseEl);
      }

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "home-stage-btn";
      btn.setAttribute("role", "tab");
      btn.dataset.stageId = bid;
      btn.id = tabDomId;
      btn.setAttribute("aria-controls", panelDomId);
      btn.innerHTML = `<span class="home-stage-num">${bid}</span><span class="home-stage-label">${stage.title ?? ""}</span>`;
      sidebar.append(btn);
      buttonsById.set(bid, btn);

      panelsWrap.insertAdjacentHTML(
        "beforeend",
        renderHomeStagePanel(stage, bid, tabDomId, panelDomId, i, stages.length),
      );

      const accItem = document.createElement("div");
      accItem.className = "home-stages-acc-item";
      accItem.dataset.open = "false";
      accItem.innerHTML = `
        <button type="button" class="home-stages-acc-btn" aria-expanded="false" aria-controls="${panelDomId}-mobile">
          <span class="home-stage-num">${bid}</span>
          <span class="home-stage-label">${stage.title ?? ""}</span>
          <span class="home-stages-acc-icon" aria-hidden="true"></span>
        </button>
        <div class="home-stages-acc-panel" id="${panelDomId}-mobile">
          ${renderHomeStagePanel(stage, bid, tabDomId, `${panelDomId}-mobile-inner`, i, stages.length)}
        </div>`;
      mobileWrap.append(accItem);

      btn.addEventListener("click", () => activateStage(bid));

      btn.addEventListener("keydown", (ev) => {
        if (ev.key !== "ArrowDown" && ev.key !== "ArrowUp") return;
        ev.preventDefault();
        const next = ev.key === "ArrowDown" ? i + 1 : i - 1;
        const bounded = Math.max(0, Math.min(stages.length - 1, next));
        const nid = String(stages[bounded].id).padStart(2, "0");
        buttonsById.get(nid)?.focus();
        activateStage(nid);
      });

      const accBtn = accItem.querySelector(".home-stages-acc-btn");
      accBtn?.addEventListener("click", () => {
        const isOpen = accItem.getAttribute("data-open") === "true";
        mobileWrap.querySelectorAll(".home-stages-acc-item").forEach((item) => {
          item.setAttribute("data-open", "false");
          item.querySelector(".home-stages-acc-btn")?.setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          accItem.setAttribute("data-open", "true");
          accBtn.setAttribute("aria-expanded", "true");
        }
      });
    });

    root.addEventListener("click", (event) => {
      const prevBtn = event.target.closest("[data-stage-prev]");
      const nextBtn = event.target.closest("[data-stage-next]");
      if (!prevBtn && !nextBtn) return;
      const panel = event.target.closest(".home-stage-panel");
      if (!panel) return;
      const currentBid = panel.dataset.stageBid;
      const currentIndex = stages.findIndex((s) => String(s.id).padStart(2, "0") === currentBid);
      const targetIndex = prevBtn ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= stages.length) return;
      const targetBid = String(stages[targetIndex].id).padStart(2, "0");
      activateStage(targetBid);
      buttonsById.get(targetBid)?.focus();
    });

    const defaultBid = String(defaultIdRaw).padStart(2, "0");
    activateStage(defaultBid);
    const defaultIndex = stages.findIndex(
      (s) => String(s.id).padStart(2, "0") === defaultBid,
    );
    const defaultAccItem = mobileWrap.children[defaultIndex] ?? mobileWrap.firstElementChild;
    if (defaultAccItem instanceof HTMLElement) {
      defaultAccItem.setAttribute("data-open", "true");
      defaultAccItem.querySelector(".home-stages-acc-btn")?.setAttribute("aria-expanded", "true");
    }
  }

  wireHomeConstructionStages(document.querySelector("[data-home-stages]"));

  function wireHomeEquipment() {
    const gallery = document.querySelector(".home-equipment__gallery");
    if (!gallery) return;

    const panels = gallery.querySelectorAll(".home-equipment__panel");
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    panels.forEach((panel) => {
      panel.addEventListener("click", () => {
        if (canHover) return;
        const isActive = panel.classList.contains("is-active");
        panels.forEach((p) => p.classList.remove("is-active"));
        if (!isActive) panel.classList.add("is-active");
      });
    });
  }

  wireHomeEquipment();

  function wireYandexProjectsMap() {
    const mapEl = document.getElementById("home-yandex-map");
    const section = document.getElementById("home-portfolio");
    if (!mapEl || !section) return;

    let mapInstance = null;
    let mapInitialized = false;

    const mapPinSvg =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjYiIHZpZXdCb3g9IjAgMCAyMCAyNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAsMSBDNS41LDEgMiw0LjUgMiw5IEMyLDE0IDEwLDI1IDEwLDI1IFMxOCwxNCAxOCw5IEMxOCw0LjUgMTQuNSwxIDEwLDEgWiIgZmlsbD0iI2Y0YmUwMCIgc3Ryb2tlPSIjMTExIiBzdHJva2Utd2lkdGg9IjEiLz48Y2lyY2xlIGN4PSIxMCIgY3k9IjgiIHI9IjMiIGZpbGw9IiMxMTEiLz48L3N2Zz4=";

    const officePinSvg =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjYiIHZpZXdCb3g9IjAgMCAyMCAyNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAsMSBDNS41LDEgMiw0LjUgMiw5IEMyLDE0IDEwLDI1IDEwLDI1IFMxOCwxNCAxOCw5IEMxOCw0LjUgMTQuNSwxIDEwLDEgWiIgZmlsbD0iIzRhOTBlMiIgc3Ryb2tlPSIjMTExIiBzdHJva2Utd2lkdGg9IjEiLz48Y2lyY2xlIGN4PSIxMCIgY3k9IjgiIHI9IjMiIGZpbGw9IiNmZmYiLz48L3N2Zz4=";

    const office = {
      coords: [53.9, 27.56],
      title: "Офис ТопАгроБел",
      description: "Офис компании",
      address: "г. Минск (уточните адрес в разделе контактов)",
    };

    const objects = [
      {
        coords: [53.864331, 27.535735],
        title: "Ресторан Ettal",
        description: "Ремонт ресторана",
        address: "г. Минск, ул. Белградская, 14",
        photos: ["assets/images/map/ettal.webp"],
      },
      {
        coords: [53.470762, 25.41766],
        title: "Производственное здание",
        description: "Строительство административного здания",
        address: "г. Дятлово, ул. Новогрудская, 6",
        photos: ["assets/images/map/novogrydskaya.webp"],
      },
      {
        coords: [53.476572, 25.416394],
        title: "Производственное здание",
        description: "Строительство производственного здания",
        address: "г. Дятлово, ул. Советская, 106б",
        photos: ["assets/images/map/sovetskaya.webp"],
      },
      {
        coords: [53.898496, 27.584738],
        title: "Модернизация крыши",
        description: "Модернизация крыши",
        address: "г. Минск, ул. Соломенная, 13",
        photos: ["assets/images/map/solomennaya.webp"],
      },
      {
        coords: [54.719328, 25.745758],
        title: "Реконструкция ГИС",
        description: "Реконструкция ГИС",
        address: "д. Котловка",
        photos: ["assets/images/map/kotlovka.webp"],
      },
      {
        coords: [53.814017, 27.686167],
        title: "Модернизация производственного сооружения",
        description: "Модернизация производственного сооружения",
        address: "г. Минск, ул. Селицкого, 17а",
        photos: ["assets/images/map/selickogo.webp"],
      },
      {
        coords: [53.839702, 27.542311],
        title: "Производственное здание",
        description: "Строительство производственного здания",
        address: "г. Минск, ул. Асаналиева, 84к2",
        photos: ["assets/images/map/asanalieva.webp"],
      },
      {
        coords: [53.887979, 27.608202],
        title: "Ремонт квартиры",
        description: "Ремонт квартиры",
        address: "г. Минск, Стахановская ул., 17",
      },
    ];

    window.closeMapBalloon = () => {
      mapInstance?.balloon.close();
    };

    function buildBalloon(obj) {
      let photosHTML = "";
      if (obj.photos?.length) {
        photosHTML =
          '<div style="display:flex;gap:8px;overflow-x:auto;padding:10px 0 0;margin-top:12px;border-top:1px solid rgba(255,255,255,0.12);">';
        obj.photos.forEach((photo) => {
          photosHTML += `<div style="flex-shrink:0;width:180px;height:140px;border-radius:8px;overflow:hidden;border:2px solid rgba(244,190,0,0.35);"><img src="${photo}" alt="${obj.title}" style="width:100%;height:100%;object-fit:cover;" loading="lazy"></div>`;
        });
        photosHTML += "</div>";
      }

      return `
        <div style="background:linear-gradient(135deg,#111 0%,#1e2430 100%);border-radius:14px;overflow:hidden;min-width:280px;max-width:350px;box-shadow:0 10px 40px rgba(0,0,0,0.45);">
          <div style="background:linear-gradient(135deg,rgba(244,190,0,0.22) 0%,rgba(244,190,0,0.05) 100%);padding:14px 44px 14px 18px;border-bottom:1px solid rgba(244,190,0,0.2);position:relative;">
            <h3 style="margin:0;font-size:1.05rem;font-weight:800;color:#f4be00;">${obj.title}</h3>
            <button type="button" onclick="closeMapBalloon()" aria-label="Закрыть" style="position:absolute;top:50%;right:12px;transform:translateY(-50%);background:transparent;border:none;color:#f4be00;font-size:1.4rem;line-height:1;cursor:pointer;width:28px;height:28px;">×</button>
          </div>
          <div style="padding:14px 18px 16px;">
            <div style="color:rgba(255,255,255,0.92);font-size:0.95rem;font-weight:600;margin-bottom:8px;">${obj.description}</div>
            <div style="color:rgba(255,255,255,0.65);font-size:0.85rem;display:flex;align-items:flex-start;gap:6px;">
              <span style="color:#f4be00;flex-shrink:0;">⌖</span>
              <span>${obj.address}</span>
            </div>
            ${photosHTML}
          </div>
        </div>
      `;
    }

    function initMap() {
      if (mapInitialized || typeof ymaps === "undefined") return;
      mapInitialized = true;

      ymaps.ready(() => {
        mapInstance = new ymaps.Map(mapEl, {
          center: [53.7098, 27.9534],
          zoom: 7,
          controls: ["zoomControl"],
        });

        mapInstance.events.add("click", () => {
          if (mapInstance.balloon.isOpen()) mapInstance.balloon.close();
        });

        ["geolocationControl", "searchControl", "trafficControl", "typeSelector", "fullscreenControl", "rulerControl"].forEach(
          (control) => mapInstance.controls.remove(control),
        );

        objects.forEach((obj) => {
          const placemark = new ymaps.Placemark(
            obj.coords,
            {
              balloonContent: buildBalloon(obj),
              hintContent: obj.title,
            },
            {
              iconLayout: "default#image",
              iconImageHref: mapPinSvg,
              iconImageSize: [20, 26],
              iconImageOffset: [-10, -26],
            },
          );
          mapInstance.geoObjects.add(placemark);
        });

        const officeMark = new ymaps.Placemark(
          office.coords,
          {
            balloonContent: buildBalloon(office),
            hintContent: office.title,
          },
          {
            iconLayout: "default#image",
            iconImageHref: officePinSvg,
            iconImageSize: [20, 26],
            iconImageOffset: [-10, -26],
          },
        );
        mapInstance.geoObjects.add(officeMark);
      });
    }

    function tryInit() {
      if (typeof ymaps !== "undefined") initMap();
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              tryInit();
              observer.unobserve(section);
            }
          });
        },
        { rootMargin: "200px" },
      );
      observer.observe(section);

      const poll = setInterval(() => {
        if (mapInitialized) {
          clearInterval(poll);
          return;
        }
        if (typeof ymaps !== "undefined" && section.getBoundingClientRect().top < window.innerHeight + 200) {
          tryInit();
          clearInterval(poll);
        }
      }, 100);
    } else {
      tryInit();
    }
  }

  wireYandexProjectsMap();

  document.querySelectorAll("[data-service-stages]").forEach((stageRoot) => {
    const slug = stageRoot.getAttribute("data-service-stages") || "";
    wireTabStages(stageRoot, {
      jsonId: `service-stages-json-${slug}`,
      sidebarSelector: ".srv-stages-sidebar",
      panelsSelector: ".srv-stage-panels",
      buttonClass: "srv-stage-btn",
      numSpanClass: "srv-stage-num",
      panelIdPrefix: "srv-stage-panel",
      tabIdPrefix: "srv-stage-tab",
    });
  });

  document.querySelectorAll("[data-service-calc]").forEach((calcRoot) => {
    const tabs = [...calcRoot.querySelectorAll(".srv-calc-tab")];
    const panels = [...calcRoot.querySelectorAll(".srv-calc-panel")];
    if (!tabs.length || !panels.length) return;

    const show = (idx) => {
      tabs.forEach((tab, i) => tab.setAttribute("aria-selected", String(i === idx)));
      panels.forEach((panel, i) => {
        panel.toggleAttribute("hidden", i !== idx);
      });
    };

    tabs.forEach((tab, idx) =>
      tab.addEventListener("click", () => {
        show(idx);
      }),
    );

    show(0);
  });

  if (typeof Swiper !== "undefined") {
    const swiperEl = document.querySelector(".home-news-swiper");
    if (swiperEl) {
      new Swiper(swiperEl, {
        slidesPerView: 1.05,
        spaceBetween: 16,
        breakpoints: {
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1380: { slidesPerView: 4 },
        },
        pagination: {
          clickable: true,
          el: ".home-news-pagination",
        },
        navigation: {
          nextEl: ".home-swiper-next",
          prevEl: ".home-swiper-prev",
        },
      });
    }
  }
})();
