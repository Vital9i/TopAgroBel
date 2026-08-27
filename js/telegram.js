function escapeTelegramHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatTelegramPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits ? `+${digits}` : String(phone || "").trim();
}

function formatTelegramLeadName(name) {
  const value = String(name || "").trim();
  return value ? escapeTelegramHtml(value) : "не указано";
}

function buildLeadSource(pageSource) {
  let source = String(pageSource || "Сайт ТопАгроБел").trim();
  source = source.replace(/\s*Источник:\s*.+$/i, "").trim();
  return source || "Сайт ТопАгроБел";
}

const LEAD_PAGE_LABELS = {
  "home-page": "Главная",
  "networks-landing": "Сети и благоустройство",
  "floors-landing": "Бетонные полы",
  "rental-landing": "Аренда техники",
};

function resolveLeadPage(lead = {}) {
  if (lead.page) return String(lead.page).trim();

  if (typeof document !== "undefined" && document.body) {
    const bodyPage = document.body.dataset.leadPage;
    if (bodyPage) return bodyPage.trim();

    for (const [className, label] of Object.entries(LEAD_PAGE_LABELS)) {
      if (document.body.classList.contains(className)) return label;
    }
  }

  return "";
}

function resolveLeadFormLabel(lead = {}) {
  return String(
    lead.form_label || lead.selected_service || lead.source || "",
  ).trim();
}

function buildTelegramLeadMessage(lead = {}) {
  const name = lead.name || "";
  const phone = lead.phone || "";
  const page =
    resolveLeadPage(lead) ||
    buildLeadSource(lead.source || lead.selected_service || "ТопАгроБел");
  const formLabel = resolveLeadFormLabel(lead);
  const workType = lead.work_type || lead.floor_type || "";
  const area = lead.floor_area || lead.area || lead.scope || "";
  const equipment = lead.equipment || "";
  const message = lead.message || lead.comment || "";
  const price = lead.price_per_m2 || "";
  const total = lead.estimated_total || "";
  const time = new Date().toLocaleString("ru-RU", { timeZone: "Europe/Minsk" });

  let text =
    `🔔 <b>Новая заявка: ${escapeTelegramHtml(page)}</b>\n\n` +
    `👤 <b>Имя:</b> ${formatTelegramLeadName(name)}\n` +
    `📱 <b>Телефон:</b> ${formatTelegramPhone(phone)}\n`;

  if (formLabel && formLabel !== page) {
    text += `📋 <b>Форма:</b> ${escapeTelegramHtml(formLabel)}\n`;
  }

  if (String(equipment).trim()) {
    text += `🚜 <b>Техника:</b> ${escapeTelegramHtml(String(equipment).trim())}\n`;
  }

  if (String(workType).trim()) {
    text += `🛠 <b>Тип работ:</b> ${escapeTelegramHtml(String(workType).trim())}\n`;
  }

  if (area !== "" && area !== null && area !== undefined) {
    text += `📐 <b>Объём:</b> ${escapeTelegramHtml(String(area))}\n`;
  }

  if (String(price).trim()) {
    text += `💵 <b>Цена:</b> ${escapeTelegramHtml(String(price).trim())} руб./м²\n`;
  }

  const totalNum = Number(total);
  if (Number.isFinite(totalNum) && totalNum > 0) {
    text += `💰 <b>Ориентир:</b> ${escapeTelegramHtml(
      new Intl.NumberFormat("ru-RU").format(Math.round(totalNum)),
    )} руб.\n`;
  }

  if (String(message).trim()) {
    text += `💬 <b>Комментарий:</b> ${escapeTelegramHtml(String(message).trim())}\n`;
  }

  text += `🕐 <b>Время:</b> ${time}`;

  return text;
}

async function sendLeadToTelegram(lead = {}) {
  if (typeof TELEGRAM_CONFIG === "undefined") {
    throw new Error("TELEGRAM_CONFIG не загружен — проверьте js/config.js");
  }

  if (!TELEGRAM_CONFIG.BOT_TOKEN || String(TELEGRAM_CONFIG.BOT_TOKEN).includes("YOUR_")) {
    throw new Error("Укажите BOT_TOKEN в js/config.js");
  }

  if (!TELEGRAM_CONFIG.CHAT_ID) {
    throw new Error("Укажите CHAT_ID в js/config.js");
  }

  if (typeof LEAD_ENDPOINT === "string" && LEAD_ENDPOINT.length > 0) {
    try {
      return await sendLeadViaProxy(lead);
    } catch (proxyError) {
      console.warn("PHP-прокси недоступен, отправка напрямую", proxyError);
    }
  }

  const message = buildTelegramLeadMessage(lead);
  const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CONFIG.CHAT_ID,
      text: message,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.ok) {
    throw new Error(data.description || "Ошибка Telegram API");
  }

  return data;
}

async function sendLeadViaProxy(lead) {
  const endpoint = LEAD_ENDPOINT || "api/send-lead.php";
  const url = new URL(endpoint, window.location.href).href;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.ok) {
    throw new Error(data.error || "Ошибка отправки через сервер");
  }

  return data;
}
