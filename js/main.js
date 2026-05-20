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
      window.alert(
        "Заявка принята (демо): подключите форму к почте, CRM или бэкенду.",
      );
    });
  });

  document.querySelectorAll("[data-scroll-target]").forEach((el) => {
    el.addEventListener("click", (event) => {
      const sel = el.getAttribute("data-scroll-target");
      if (!sel) return;
      const target = document.querySelector(sel);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
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

  wireTabStages(document.querySelector("[data-home-stages]"), {
    jsonId: "home-stages-json",
    sidebarSelector: ".home-stages-sidebar",
    panelsSelector: ".home-stage-panels",
    buttonClass: "home-stage-btn",
    numSpanClass: "home-stage-num",
    panelIdPrefix: "stage-panel",
    tabIdPrefix: "stage-tab",
  });

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
