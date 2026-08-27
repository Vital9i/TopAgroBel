/**
 * Общая логика заявок: валидация, отправка, редирект на thank-you.
 */

function getThankYouUrl() {
  return /\/uslugi\//.test(window.location.pathname)
    ? "thank-you.html"
    : "thank-you.html";
}

function redirectToThankYou({ name, phone, formId, source, equipment } = {}) {
  const params = new URLSearchParams();
  if (name) params.set("name", name);
  if (phone) params.set("phone", phone);
  if (formId) params.set("form", formId);
  if (source) params.set("source", source);
  if (equipment) params.set("equipment", equipment);

  const qs = params.toString();
  window.location.href = `${getThankYouUrl()}${qs ? `?${qs}` : ""}`;
}

function getPhoneDigits(phone) {
  let digits = String(phone || "").replace(/\D/g, "");
  if (digits.startsWith("80")) digits = `375${digits.slice(2)}`;
  return digits;
}

function isValidBelarusPhone(phone) {
  const digits = getPhoneDigits(phone);
  if (digits.startsWith("375")) return digits.length >= 12;
  return digits.length >= 9;
}

function resolveLeadPage(form) {
  if (form?.dataset?.leadPage) return form.dataset.leadPage.trim();
  if (document.body.dataset.leadPage) return document.body.dataset.leadPage.trim();
  if (document.body.classList.contains("home-page")) return "Главная";
  if (document.body.classList.contains("networks-landing")) return "Сети и благоустройство";
  if (document.body.classList.contains("floors-landing")) return "Бетонные полы";
  if (document.body.classList.contains("rental-landing")) return "Аренда техники";
  return "";
}

function resolveFormLeadSource(form) {
  if (form.dataset.leadSource) return form.dataset.leadSource.trim();
  if (form.closest("#callback-modal")) return "Обратный звонок";
  if (document.body.classList.contains("home-page")) return "Консультация";
  const title = document.title.replace(/\s*[—–-].*$/, "").trim();
  return title || "Заявка";
}

function pushLeadAnalytics({ formId, source } = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "form_submit_success",
    pagePath: location.pathname,
    pageTitle: document.title,
    pageLocation: location.href,
    form_id: formId || "",
    form_source: source || "",
  });
}

async function submitContactForm(form) {
  const consent = form.querySelector('input[name="consent"]');
  if (consent && !consent.checked) {
    window.alert("Подтвердите согласие на обработку персональных данных.");
    consent.focus();
    return;
  }

  const phoneInput = form.querySelector('[name="phone"]');
  const phone = String(phoneInput?.value || "").trim();
  const name = String(form.querySelector('[name="name"]')?.value || "").trim();
  const source = resolveFormLeadSource(form);
  const page = resolveLeadPage(form);
  const submitBtn = form.querySelector('[type="submit"]');
  const defaultText = submitBtn ? submitBtn.textContent : "";

  if (!getPhoneDigits(phone)) {
    window.alert("Пожалуйста, укажите номер телефона");
    phoneInput?.focus();
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.dataset.originalText = defaultText;
    submitBtn.textContent = "Отправляем…";
  }

  try {
    if (typeof sendLeadToTelegram !== "function") {
      throw new Error("Подключите js/telegram.js и настройте бота");
    }

    await sendLeadToTelegram({
      name,
      phone,
      page,
      form_label: source,
      selected_service: source,
      source,
    });

    pushLeadAnalytics({ formId: form.id || form.getAttribute("id") || "", source: page || source });

    redirectToThankYou({
      name,
      phone,
      formId: form.id || (form.closest("#callback-modal") ? "callback-modal" : "contact-form"),
      source: page ? `${page} · ${source}` : source,
    });
  } catch (err) {
    console.error(err);
    const details = err?.message ? `\n\n${err.message}` : "";
    window.alert(
      `Не удалось отправить заявку. Позвоните: +375 29 128-62-17${details}`,
    );
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = submitBtn.dataset.originalText || defaultText;
    }
  }
}

function initContactForms() {
  document.querySelectorAll("[data-contact-form]").forEach((form) => {
    if (form.dataset.leadsBound === "1") return;
    form.dataset.leadsBound = "1";

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submitContactForm(form);
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initContactForms);
} else {
  initContactForms();
}
