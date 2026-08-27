/**
 * Калькулятор промышленных бетонных полов
 */
(function () {
  const floorOptions = {
    standard: {
      title: "Стандарт",
      price: 57,
      thickness: "до 12 см",
    },
    reinforced: {
      title: "Усиленный",
      price: 70,
      thickness: "до 20 см",
    },
    industrial: {
      title: "Промышленный",
      price: 100,
      thickness: "до 30 см",
    },
    consultation: {
      title: "Нужна консультация",
      price: null,
      thickness: "подберём",
    },
  };

  let lastResult = null;

  function getRoot() {
    return document.querySelector("#floor-calculator");
  }

  function getSelectedRadio(root) {
    return root.querySelector('input[name="floor_type"]:checked');
  }

  function formatMoney(value) {
    return new Intl.NumberFormat("ru-RU").format(Math.round(value));
  }

  function selectFloorOption(type) {
    const root = getRoot();
    if (!root || !floorOptions[type]) return;

    const radio = root.querySelector(`input[name="floor_type"][value="${type}"]`);
    if (!radio) return;

    radio.checked = true;
    radio.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function syncFloorCards(root) {
    const selected = getSelectedRadio(root);
    const selectedType = selected ? selected.value : "";

    root.querySelectorAll(".floor-option").forEach((card) => {
      const type = card.getAttribute("data-floor-type");
      const isSelected = type === selectedType;
      const btn = card.querySelector(".floor-option__select");
      const option = floorOptions[type];

      card.classList.toggle("floor-option--selected", isSelected);

      if (btn && option) {
        btn.textContent = isSelected ? "Выбрано" : `Выбрать ${option.title}`;
        btn.setAttribute("aria-pressed", isSelected ? "true" : "false");
      }
    });

    const typeError = root.querySelector("[data-floor-type-error]");
    if (typeError && selectedType) typeError.textContent = "";

    const selectedTitle = root.querySelector("[data-selected-title]");
    const selectedPrice = root.querySelector("[data-selected-price]");
    if (selected && floorOptions[selected.value]) {
      const option = floorOptions[selected.value];
      if (selectedTitle) selectedTitle.textContent = option.title;
      if (selectedPrice) {
        selectedPrice.textContent =
          option.price == null ? "по запросу" : `от ${option.price} BYN/м²`;
      }
    } else {
      if (selectedTitle) selectedTitle.textContent = "Не выбрана";
      if (selectedPrice) selectedPrice.textContent = "—";
    }

    const resultPanel = root.querySelector(".floor-calculator__result-output");
    const transferBtn = root.querySelector("[data-floor-transfer]");
    if (resultPanel) resultPanel.hidden = true;
    if (transferBtn) transferBtn.hidden = true;
    lastResult = null;
  }

  function validateFloorCalculator() {
    const root = getRoot();
    if (!root) return { ok: false };

    const typeError = root.querySelector("[data-floor-type-error]");
    const areaError = root.querySelector("[data-floor-area-error]");
    const areaInput = root.querySelector("#floor-area");
    const selected = getSelectedRadio(root);

    if (typeError) typeError.textContent = "";
    if (areaError) areaError.textContent = "";

    let ok = true;

    if (!selected) {
      if (typeError) typeError.textContent = "Выберите вариант промышленного пола.";
      ok = false;
    }

    const type = selected ? selected.value : "";
    const isConsultation = type === "consultation";
    const raw = areaInput ? String(areaInput.value).trim() : "";

    if (!isConsultation) {
      if (!raw) {
        if (areaError) areaError.textContent = "Укажите площадь объекта.";
        ok = false;
      } else {
        const area = Number(raw);
        if (!(area > 0)) {
          if (areaError) areaError.textContent = "Площадь должна быть больше нуля.";
          ok = false;
        }
      }
    } else if (raw) {
      const area = Number(raw);
      if (!(area > 0)) {
        if (areaError) areaError.textContent = "Площадь должна быть больше нуля.";
        ok = false;
      }
    }

    if (!ok) return { ok: false };

    const option = floorOptions[type];
    const area = raw ? Number(raw) : null;

    return {
      ok: true,
      type,
      option,
      area,
      total: option.price != null && area ? area * option.price : null,
    };
  }

  function calculateFloorPrice() {
    const validation = validateFloorCalculator();
    if (!validation.ok) return null;

    const result = {
      type: validation.type,
      title: validation.option.title,
      price: validation.option.price,
      thickness: validation.option.thickness,
      area: validation.area,
      total: validation.total,
    };

    renderFloorResult(result);
    return result;
  }

  function renderFloorResult(result) {
    const root = getRoot();
    if (!root || !result) return;

    lastResult = result;

    const output = root.querySelector(".floor-calculator__result-output");
    const totalEl = root.querySelector("[data-floor-total]");
    const summaryEl = root.querySelector("[data-floor-summary]");
    const transferBtn = root.querySelector("[data-floor-transfer]");

    if (output) output.hidden = false;

    if (result.type === "consultation") {
      if (totalEl) {
        totalEl.textContent = "Подберём конструкцию после уточнения нагрузок";
      }
      if (summaryEl) {
        const areaPart = result.area ? ` · площадь ${result.area} м²` : "";
        summaryEl.textContent = `Выбрано: ${result.title}${areaPart}`;
      }
    } else {
      if (totalEl) {
        totalEl.textContent = `Ориентировочная стоимость — от ${formatMoney(result.total)} BYN`;
      }
      if (summaryEl) {
        summaryEl.textContent = `${result.title} · ${result.area} м² · от ${result.price} BYN/м² · ${result.thickness}`;
      }
    }

    if (transferBtn) transferBtn.hidden = false;
  }

  function transferFloorCalculationToForm() {
    if (!lastResult) {
      calculateFloorPrice();
      if (!lastResult) return;
    }

    const form =
      document.querySelector("#calculator") ||
      document.querySelector("form[data-lead-form]");
    if (!form) return;

    const setHidden = (name, value) => {
      let input = form.querySelector(`input[name="${name}"]`);
      if (!input) {
        input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        form.prepend(input);
      }
      input.value = value == null ? "" : String(value);
    };

    setHidden("floor_type", lastResult.type);
    setHidden("floor_area", lastResult.area == null ? "" : lastResult.area);
    setHidden("floor_base_price", lastResult.price == null ? "" : lastResult.price);
    setHidden(
      "floor_estimated_total",
      lastResult.total == null ? "" : Math.round(lastResult.total),
    );
    setHidden("area", lastResult.area == null ? "" : lastResult.area);
    setHidden("price_per_m2", lastResult.price == null ? "" : lastResult.price);
    setHidden(
      "estimated_total",
      lastResult.total == null ? "" : Math.round(lastResult.total),
    );

    const serviceInput = form.querySelector('input[name="selected_service"]');
    if (serviceInput) {
      serviceInput.value = `Промышленный бетонный пол — ${lastResult.title}`;
    }

    const notice = document.querySelector("[data-floor-transfer-notice]");
    if (notice) {
      notice.hidden = false;
      notice.textContent = "Параметры расчёта добавлены в заявку.";
    }

    const target =
      document.querySelector("#calculator") ||
      document.querySelector("#contacts");
    if (!target) return;

    const header = document.querySelector("[data-site-header], .site-header, .home-header");
    const offset = header ? header.offsetHeight + 8 : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }

  function bindFloorCalculator() {
    const root = getRoot();
    if (!root) return;

    root.querySelectorAll('input[name="floor_type"]').forEach((radio) => {
      radio.addEventListener("change", () => syncFloorCards(root));
    });

    root.querySelectorAll(".floor-option").forEach((card) => {
      const type = card.getAttribute("data-floor-type");
      const btn = card.querySelector(".floor-option__select");

      card.addEventListener("click", (e) => {
        if (e.target.closest("button")) return;
        selectFloorOption(type);
      });

      btn?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        selectFloorOption(type);
      });
    });

    root.querySelector("[data-floor-calculate]")?.addEventListener("click", () => {
      calculateFloorPrice();
    });

    root.querySelector("[data-floor-transfer]")?.addEventListener("click", () => {
      transferFloorCalculationToForm();
    });

    root.querySelector("#floor-area")?.addEventListener("input", () => {
      const areaError = root.querySelector("[data-floor-area-error]");
      if (areaError) areaError.textContent = "";
      const output = root.querySelector(".floor-calculator__result-output");
      const transferBtn = root.querySelector("[data-floor-transfer]");
      if (output) output.hidden = true;
      if (transferBtn) transferBtn.hidden = true;
      lastResult = null;
    });

    root.querySelectorAll(".floor-option__image").forEach((img) => {
      img.addEventListener("error", () => {
        img.closest(".floor-option__media")?.classList.add("floor-option__media--placeholder");
        img.remove();
      });
    });

    syncFloorCards(root);
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindFloorCalculator();
  });

  window.floorCalculatorApi = {
    selectFloorOption,
    validateFloorCalculator,
    calculateFloorPrice,
    renderFloorResult,
    transferFloorCalculationToForm,
    floorOptions,
  };
})();
