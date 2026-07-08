import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  SERVICE_DETAILS,
  LINK_GROUPS,
  PAGE_EXTRA_GROUPS,
  MONOLIT_KARKAS_BLOCK,
} from "./service-content.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, "..");

const SITE_ORIGIN = "https://topagrobel.by";

const PHONE_OLEG = {
  tel: "+375291286217",
  display: "+375 (29) 128-62-17",
  label: "Олег",
};

const PHONE_ROBERT = {
  tel: "+375296582950",
  display: "+375 (29) 658-29-50",
  label: "Робертович",
};

/** @returns {string} */
function renderHeaderPhones() {
  return `<a href="tel:${PHONE_OLEG.tel}">${PHONE_OLEG.display}</a>
          <a href="tel:${PHONE_ROBERT.tel}">${PHONE_ROBERT.display}</a>`;
}

/** @returns {string} */
function renderSrvCtaPhones() {
  return `<p class="srv-cta-card__phone"><a href="tel:${PHONE_OLEG.tel}">${PHONE_OLEG.label}: ${PHONE_OLEG.display}</a><br><a href="tel:${PHONE_ROBERT.tel}">${PHONE_ROBERT.label}: ${PHONE_ROBERT.display}</a></p>`;
}

/** @typedef {{ slug: string; title: string; lede?: string; freq?: string; stub?: boolean }} Service */

/** @type {Service[]} */
const OBJECT_BUILD = [
  {
    slug: "stroitelstvo-zdaniy-i-sooruzheniy",
    title: "Строительство зданий и сооружений",
    freq: "2 470 / мес.",
  },
  {
    slug: "promyshlennoe-stroitelstvo",
    title: "Промышленное строительство",
    freq: "170 / мес.",
  },
  {
    slug: "promyshlennye-zdaniya",
    title: "Промышленные здания",
    freq: "170 / мес.",
  },
  {
    slug: "stroitelstvo-skladov",
    title: "Строительство складов",
    freq: "70 / мес.",
  },
  {
    slug: "stroitelstvo-angarov",
    title: "Строительство ангаров",
    freq: "70 / мес.",
  },
  {
    slug: "stroitelstvo-bystrovozvodimyh-zdaniy",
    title: "Быстровозводимые здания",
    freq: "80 / мес.",
  },
  {
    slug: "angary-iz-sendvich-paneley",
    title: "Ангары из сэндвич-панелей",
    freq: "10 / мес.",
  },
  {
    slug: "zdaniya-iz-sendvich-paneley",
    title: "Здания из сэндвич-панелей",
    freq: "90 / мес.",
  },
  {
    slug: "zdaniya-iz-metallokonstrukciy",
    title: "Здания из металлоконструкций",
    freq: "30 / мес.",
  },
  { slug: "zdaniya-iz-lstk", title: "Здания из ЛСТК", freq: "210 / мес." },
  {
    slug: "modulnye-zdaniya",
    title: "Модульные здания",
    freq: "20 / мес.",
  },
  { slug: "genpodryad", title: "Генподряд", freq: "30 / мес." },
  {
    slug: "rekonstrukciya-zdaniy",
    title: "Реконструкция зданий",
    freq: "220 / мес.",
  },
];

/** @type {Service[]} */
const WORK_TYPES = [
  {
    slug: "stroitelno-montazhnye-raboty",
    title: "Строительно-монтажные работы",
    freq: "580 / мес.",
  },
  {
    slug: "promyshlennye-betonnye-poly",
    title: "Промышленные бетонные полы",
  },
  { slug: "zemlyanye-raboty", title: "Земляные работы" },
  {
    slug: "fundamenty-promyshlennyh-zdaniy",
    title: "Фундаменты промышленных зданий",
  },
  {
    slug: "montazh-metallokonstrukciy",
    title: "Монтаж металлоконструкций",
  },
  {
    slug: "montazh-sbornogo-zhelezobetona",
    title: "Монтаж сборного железобетона",
  },
  {
    slug: "monolitnye-raboty",
    title: "Монолитные работы",
    freq: "120 / мес.",
  },
  { slug: "krovelnye-raboty", title: "Кровельные работы" },
  { slug: "fasadnye-raboty", title: "Фасадные работы" },
  {
    slug: "naruzhnye-inzhenernye-seti",
    title: "Наружные инженерные сети",
  },
  { slug: "teplotrassy", title: "Теплотрассы" },
  {
    slug: "stroitelstvo-dorog-i-ploshchadok",
    title: "Строительство дорог, проездов и площадок",
  },
  {
    slug: "blagoustroystvo-territorii",
    title: "Благоустройство территории",
  },
  { slug: "usilenie-konstrukciy", title: "Усиление конструкций" },
  {
    slug: "arenda-stroitelnoy-tehniki",
    title: "Аренда строительной техники",
    stub: true,
  },
];

const SERVICES = [...OBJECT_BUILD, ...WORK_TYPES];

/** @type {Record<string, string>} */
const PAGE_EXTRA_TITLES = {
  "stroitelno-montazhnye-raboty": "Виды строительно-монтажных работ",
  "promyshlennoe-stroitelstvo": "Работы в составе промышленного строительства",
  "stroitelstvo-zdaniy-i-sooruzheniy": "Полный цикл работ",
  "rekonstrukciya-zdaniy": "Работы при реконструкции",
};

function esc(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** @param {string[]} items */
function renderListItems(items) {
  return items.map((item) => `<li>${esc(item)}</li>`).join("");
}

/**
 * @param {string} title
 * @param {{ slug: string; label: string }[]} links
 */
function renderLinkGrid(title, links) {
  const items = links
    .map(
      (l) =>
        `<li><a class="srv-crosslink" href="${esc(l.slug)}.html">${esc(l.label)}</a></li>`,
    )
    .join("");
  return `
      <section class="srv-crosslinks wrap" aria-labelledby="srv-crosslinks-${esc(title).replace(/\s/g, "-")}">
        <h2 class="srv-section-title srv-section-title--center">${esc(title)}</h2>
        <ul class="srv-crosslinks-grid">${items}</ul>
      </section>`;
}

/** @param {string} slug */
function renderPageExtras(slug) {
  let html = "";
  const groupKey = PAGE_EXTRA_GROUPS[slug];
  if (groupKey && LINK_GROUPS[groupKey]) {
    html += renderLinkGrid(
      PAGE_EXTRA_TITLES[slug] ?? "Смежные услуги",
      LINK_GROUPS[groupKey],
    );
  }
  if (slug === "monolitnye-raboty") {
    html += `
      <section class="srv-detail wrap" aria-labelledby="srv-monolit-karkas">
        <h2 id="srv-monolit-karkas" class="srv-section-title">${esc(MONOLIT_KARKAS_BLOCK.title)}</h2>
        <p class="srv-section-lede">${esc(MONOLIT_KARKAS_BLOCK.text)}</p>
      </section>`;
  }
  return html;
}

/**
 * @param {import("./service-content.mjs").ServiceDetail} detail
 * @param {string} slug
 */
function detailedServiceLandingMarkup(detail, slug) {
  const t = esc(detail.h1);
  const scrollLead = `#service-lead-${slug}`;
  const scrollBtn = (label, extraClass = "") =>
    `<a class="srv-cta-solid srv-btn-scroll${extraClass ? ` ${extraClass}` : ""}" href="${scrollLead}" data-scroll-target="${scrollLead}">${esc(label)}</a>`;

  const heroBullets =
    detail.heroBullets?.map((b) => `<li>${esc(b)}</li>`).join("") ??
    `<li>Работаем с промышленными, складскими и коммерческими объектами по Беларуси.</li>`;

  const faqHtml = detail.faq
    .map(
      (item) => `
            <div class="faq-item">
              <button type="button" class="faq-q focus-ring" aria-expanded="false">${esc(item.q)}</button>
              <div class="faq-a">${esc(item.a)}</div>
            </div>`,
    )
    .join("");

  const relatedHtml = detail.related?.length
    ? renderLinkGrid("Смежные услуги", detail.related)
    : "";

  const leadCta = detail.leadCta ?? detail.ctaLabel;

  return `
      <section class="srv-hero" aria-labelledby="srv-hero-heading-${slug}">
        <div class="srv-hero__bg" aria-hidden="true"></div>
        <div class="srv-hero__inner wrap">
          <nav class="breadcrumbs breadcrumbs--srv" aria-label="Хлебные крошки">
            <ol>
              <li><a href="../index.html">Главная</a></li>
              <li><a href="index.html">Услуги</a></li>
              <li aria-current="page">${t}</li>
            </ol>
          </nav>
          <div class="srv-hero__grid">
            <div class="srv-hero__copy">
              <p class="srv-hero__label">Строительные услуги ТопАгроБел</p>
              <h1 id="srv-hero-heading-${slug}" class="srv-hero__title">${t}</h1>
              <ul class="srv-hero-list">${heroBullets}</ul>
              <p class="srv-hero__lede">${esc(detail.heroLede)}</p>
            </div>
            <aside class="srv-hero__cta srv-cta-card" aria-label="Обратная связь">
              <strong class="srv-cta-card__title">Получить расчёт</strong>
              <p class="srv-cta-card__sub">Оставьте заявку — подготовим ориентир по срокам и стоимости работ.</p>
              ${renderSrvCtaPhones()}
              ${scrollBtn(detail.ctaLabel)}
              <p class="srv-cta-card__hint">Ответ оперативно в рабочее время&nbsp;• пн–пт 09:00–18:00</p>
              <div class="srv-cta-card__avatar" aria-hidden="true"><span>ПК</span></div>
            </aside>
          </div>
        </div>
      </section>

      <section class="srv-detail srv-detail--muted wrap" aria-labelledby="srv-objects-${slug}">
        <h2 id="srv-objects-${slug}" class="srv-section-title">${esc(detail.objects.title)}</h2>
        <ul class="srv-checklist">${renderListItems(detail.objects.items)}</ul>
      </section>

      <section class="srv-feature">
        <div class="srv-feature-inner wrap">
          <div class="srv-feature-photo" aria-hidden="true"></div>
          <div class="srv-feature-body">
            <h2 class="srv-section-title">${esc(detail.works.title)}</h2>
            <ul class="srv-checklist srv-checklist--light">${renderListItems(detail.works.items)}</ul>
          </div>
        </div>
      </section>

      <section class="srv-detail wrap" aria-labelledby="srv-stages-${slug}">
        <h2 id="srv-stages-${slug}" class="srv-section-title">${esc(detail.stages.title)}</h2>
        <ol class="srv-steps-list">${detail.stages.items.map((item) => `<li>${esc(item)}</li>`).join("")}</ol>
      </section>

      <section class="srv-banner" aria-labelledby="srv-pricing-${slug}">
        <div class="srv-banner__bg" aria-hidden="true"></div>
        <div class="srv-banner__inner wrap">
          <div class="srv-banner__copy">
            <h2 id="srv-pricing-${slug}" class="srv-banner__title">${esc(detail.pricing.title)}</h2>
            <ul class="srv-checklist srv-checklist--light">${renderListItems(detail.pricing.items)}</ul>
          </div>
          <aside class="srv-banner__cta srv-cta-card srv-cta-card--compact">
            <strong class="srv-cta-card__title">Коммерческое предложение</strong>
            <p class="srv-cta-card__sub">Финальную цену закрепляем в договоре после сбора исходных данных по объекту.</p>
            ${scrollBtn(detail.ctaLabel)}
          </aside>
        </div>
      </section>

      <section class="srv-projects" aria-labelledby="srv-projects-heading-${slug}">
        <div class="srv-projects-head wrap">
          <h2 id="srv-projects-heading-${slug}" class="srv-projects-title">Примеры выполненных работ</h2>
          <a href="../index.html#home-portfolio" class="srv-projects-more">На главную — готовые объекты</a>
        </div>
        <div class="srv-projects-grid wrap">
          ${[1, 2, 3, 4, 5, 6]
            .map(
              (n) =>
                `<figure class="srv-project-cell"><figcaption class="visually-hidden">${t}&nbsp;— карточка проекта&nbsp;${n}</figcaption><span class="srv-project-ph">Фото ${n}</span></figure>`,
            )
            .join("")}
        </div>
      </section>

      <section class="srv-faq" aria-labelledby="srv-faq-title-${slug}">
        <div class="srv-faq-bar">
          <h2 id="srv-faq-title-${slug}" class="srv-faq-title">Частые вопросы</h2>
        </div>
        <div class="srv-faq-body wrap">
          <div class="faq faq--srv">${faqHtml}</div>
        </div>
      </section>

      <section class="srv-final strip-cta">
        <div class="strip-cta__inner wrap">
          <div>
            <strong class="strip-cta__title">${esc(detail.ctaLabel)}</strong>
            <p class="strip-cta__text">Короткая заявка ниже — технический отдел оценит объём работ и сроки подготовки КП.</p>
          </div>
          ${scrollBtn(detail.ctaLabel)}
        </div>
      </section>

      ${relatedHtml}

      <article id="service-lead-${slug}" class="srv-lead" aria-labelledby="srv-lead-title-${slug}">
        <div class="srv-lead-inner wrap">
          <h2 id="srv-lead-title-${slug}" class="srv-section-title">Форма заявки</h2>
          <p class="srv-section-lede">Опишите объект, площадь и сроки — свяжемся для уточнения деталей.</p>
          <form class="lead-form lead-form--srv" data-contact-form novalidate>
            <div class="field-row">
              <label for="lead-name-${slug}">Компания / ФИО</label>
              <input id="lead-name-${slug}" name="name" autocomplete="organization" placeholder="Как к вам обращаться">
            </div>
            <div class="field-row">
              <label for="lead-phone-${slug}">Телефон</label>
              <input id="lead-phone-${slug}" name="phone" autocomplete="tel" placeholder="+375…">
            </div>
            <div class="field-row">
              <label for="lead-msg-${slug}">Задача</label>
              <textarea id="lead-msg-${slug}" name="message" placeholder="Площадь, назначение объекта, срок КП"></textarea>
            </div>
            <div>
              <button class="srv-cta-solid srv-lead-submit" type="submit">${esc(leadCta)}</button>
            </div>
          </form>
        </div>
      </article>`;
}

/** @param {Service} service */
function stubServiceMarkup(service) {
  const slug = esc(service.slug);
  const t = esc(service.title);
  const scrollLead = `#service-lead-${service.slug}`;
  return `
      <section class="srv-hero" aria-labelledby="srv-hero-heading-${slug}">
        <div class="srv-hero__bg" aria-hidden="true"></div>
        <div class="srv-hero__inner wrap">
          <nav class="breadcrumbs breadcrumbs--srv" aria-label="Хлебные крошки">
            <ol>
              <li><a href="../index.html">Главная</a></li>
              <li><a href="index.html">Услуги</a></li>
              <li aria-current="page">${t}</li>
            </ol>
          </nav>
          <div class="srv-hero__grid">
            <div class="srv-hero__copy">
              <p class="srv-hero__label">Строительные услуги ТопАгроБел</p>
              <h1 id="srv-hero-heading-${slug}" class="srv-hero__title">${t}</h1>
              <p class="srv-hero__lede">Раздел находится в разработке. Скоро здесь появится информация об аренде строительной техники.</p>
            </div>
            <aside class="srv-hero__cta srv-cta-card" aria-label="Обратная связь">
              <strong class="srv-cta-card__title">Связаться с нами</strong>
              <p class="srv-cta-card__sub">Оставьте контакты — сообщим о запуске раздела или подберём технику через менеджера.</p>
              ${renderSrvCtaPhones()}
              <a class="srv-cta-solid srv-btn-scroll" href="${scrollLead}" data-scroll-target="${scrollLead}">Связаться с нами</a>
            </aside>
          </div>
        </div>
      </section>

      <article id="service-lead-${slug}" class="srv-lead" aria-labelledby="srv-lead-title-${slug}">
        <div class="srv-lead-inner wrap">
          <h2 id="srv-lead-title-${slug}" class="srv-section-title">Форма заявки</h2>
          <form class="lead-form lead-form--srv" data-contact-form novalidate>
            <div class="field-row">
              <label for="lead-name-${slug}">Компания / ФИО</label>
              <input id="lead-name-${slug}" name="name" autocomplete="organization" placeholder="Как к вам обращаться">
            </div>
            <div class="field-row">
              <label for="lead-phone-${slug}">Телефон</label>
              <input id="lead-phone-${slug}" name="phone" autocomplete="tel" placeholder="+375…">
            </div>
            <div class="field-row">
              <label for="lead-msg-${slug}">Сообщение</label>
              <textarea id="lead-msg-${slug}" name="message" placeholder="Интересующая техника или вопрос"></textarea>
            </div>
            <div>
              <button class="srv-cta-solid srv-lead-submit" type="submit">Отправить заявку</button>
            </div>
          </form>
        </div>
      </article>`;
}

/**
 * @param {"root" | "subdir"} depth
 */
function urls(depth) {
  const prefix = depth === "root" ? "" : "../";
  return {
    css: `${prefix}css/`,
    js: `${prefix}js/`,
    favicon: `${prefix}assets/favicon.svg`,
    up: prefix,
  };
}

/**
 * Корпоративные разделы: какой пункт единого верхнего меню считать текущим.
 * @param {string} folder
 * @returns {"blog" | "kontakty" | null}
 */
function corpNavActive(folder) {
  if (folder === "blog") return "blog";
  if (folder === "kontakty") return "kontakty";
  return null;
}

/**
 * Шапка как на главной: белый топбар + тёмная навигация.
 * @param {object} p
 * @param {"root" | "subdir"} p.depth
 * @param {"o-kompanii" | "uslugi" | "blog" | "kontakty" | null | undefined} p.active
 */
function renderUnifiedHeader({ depth, active = null }) {
  const u = urls(depth);
  const { up } = u;
  const rootIndex = `${up}index.html`;
  const reviewsHref = depth === "root" ? "#home-reviews" : `${rootIndex}#home-reviews`;

  /** @param {string} key */
  const ac = (key) =>
    active != null && active === key ? ' aria-current="page"' : "";

  const homeNavItem =
    depth === "root"
      ? `<li><a href="#"${ac("home")}>Главная</a></li>`
      : `<li><a href="${rootIndex}">Главная</a></li>`;

  const navLabel =
    depth === "root"
      ? "Навигация по главной странице"
      : "Основная навигация по сайту";

  const callbackMarkup =
    depth === "root"
      ? `<button type="button" class="home-btn-callback home-btn-scroll" data-scroll-target="#zakaz-consult">
          Обратный звонок
        </button>`
      : `<a class="home-btn-callback" href="${rootIndex}#zakaz-consult">
          Обратный звонок
        </a>`;

  return `
  <header class="home-header">
    <div class="home-topbar">
      <div class="wrap home-topbar-row">
        <a class="home-logo-strong" href="${rootIndex}">ТОП<span>АГРО</span>БЕЛ</a>
        <div class="home-contacts-strip">
          <span><strong>График:</strong> пн–пт 09:00–18:00</span>
          ${renderHeaderPhones()}
          <span>Минск и вся РБ</span>
        </div>
        ${callbackMarkup}
      </div>
    </div>
    <div class="home-navbar">
      <div class="wrap home-navbar-inner">
        <button type="button" class="home-nav-toggle" aria-expanded="false" aria-controls="home-main-navigation">
          Меню
        </button>
        <nav id="home-main-navigation" class="home-main-nav" data-open="false" aria-label="${navLabel}">
          <ul>
            ${homeNavItem}
            <li><a href="${up}o-kompanii/index.html"${ac("o-kompanii")}>О компании</a></li>
            <li><a href="${up}uslugi/index.html"${ac("uslugi")}>Услуги</a></li>
            <li><a href="${reviewsHref}">Отзывы</a></li>
            <li><a href="${up}blog/index.html"${ac("blog")}>Новости</a></li>
          </ul>
        </nav>
      </div>
    </div>
  </header>`;
}

/**
 * @param {"root" | "subdir"} depth
 */
function renderFooter(depth) {
  const { up } = urls(depth);
  return `
      <footer class="site-footer">
        <div class="wrap site-footer-inner">
          <section>
            <p class="footer-title">Строительство</p>
            <p class="footer-muted">Отдельных разделов «Стоимость», «Объекты» и «Проекты» нет по архитектуре: как на SEO-схеме они оформляются блоками внутри страниц услуг.</p>
          </section>
          <section>
            <p class="footer-title">Навигация</p>
            <ul class="footer-links">
              <li><a class="focus-ring" href="${up}uslugi/index.html">Каталог услуг</a></li>
              <li><a class="focus-ring" href="${up}seo-sitemap.html">SEO-карта</a></li>
              <li><a class="focus-ring" href="${up}rekvizity/index.html">Реквизиты</a></li>
            </ul>
          </section>
        </div>
      </footer>`;
}

function baseHead({ depth, title, meta }) {
  const u = urls(depth);
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(meta)}">
  <link rel="icon" href="${u.favicon}" type="image/svg+xml">
  <link rel="stylesheet" href="${u.css}base.css">
  <link rel="stylesheet" href="${u.css}layout.css">
  <link rel="stylesheet" href="${u.css}header-unified.css">
`;
}

function scripts({ depth }) {
  const u = urls(depth);
  return `\n  <script src="${u.js}main.js" defer></script>\n`;
}

/** JSON для вкладки «этапы сотрудничества» на страницах услуг (Nyutek-стиль). */
function serviceCooperationStages(service) {
  const title = service.title;
  return [
    {
      id: 1,
      title: "Заявка и обследование",
      text: `Принимаем задачу по направлению «${title}»: исходные данные, габариты, график ввода, особые технические условия и ограничения площадки.`,
    },
    {
      id: 2,
      title: "Расчёт и КП",
      text:
        "Предварительное коммерческое предложение: технологическая схема, ключевые материалы и объёмы работ, ориентир по срокам производства и монтажа.",
    },
    {
      id: 3,
      title: "Договор и проектирование",
      text:
        "Согласование условий, этапов оплат, объёма авторского надзора. При необходимости выпуск дополнительной рабочей документации и синхронизация с закупками.",
    },
    {
      id: 4,
      title: "Производство и логистика",
      text:
        "Изготовление металлоконструкций, КМД, контроль геометрии партий и поставки на объект в соответствии с графиком строительства.",
    },
    {
      id: 5,
      title: "Монтаж и сдача",
      text:
        "Работы на объекте, контроль качества, промежуточные акты и передача исполнительной документации; объект готовит к выпуску в эксплуатацию.",
    },
  ];
}

/**
 * Посадочная страница услуги: макет в духе референса (герой с жёлтым CTA-блоком, калькулятор-шаги,
 * география, этапы, преимущества, статистика, сетка проектов, FAQ, финальный CTA, карты и форма).
 * @param {Service} service
 */
function serviceLandingMarkup(service) {
  const slug = esc(service.slug);
  const t = esc(service.title);
  const lede = esc(
    service.lede ??
      `Услуга «${service.title}»: проектирование, смета, производство работ и сдача объекта по договору. Работаем в Минске и по всей Республике Беларусь.`,
  );

  const stagesJson = JSON.stringify(serviceCooperationStages(service)).replace(/</g, "\\u003c");

  const scrollLead = `#service-lead-${slug}`;
  /** @returns {string} */
  const scrollBtn = (label, extraClass = "") =>
    `<a class="srv-cta-solid srv-btn-scroll${extraClass ? ` ${extraClass}` : ""}" href="${scrollLead}" data-scroll-target="${scrollLead}">${label}</a>`;

  return `
      <section class="srv-hero" aria-labelledby="srv-hero-heading-${slug}">
        <div class="srv-hero__bg" aria-hidden="true"></div>
        <div class="srv-hero__inner wrap">
          <nav class="breadcrumbs breadcrumbs--srv" aria-label="Хлебные крошки">
            <ol>
              <li><a href="../index.html">Главная</a></li>
              <li><a href="index.html">Услуги</a></li>
              <li aria-current="page">${t}</li>
            </ol>
          </nav>
          <div class="srv-hero__grid">
            <div class="srv-hero__copy">
              <p class="srv-hero__label">Строительные услуги ТопАгроБел</p>
              <h1 id="srv-hero-heading-${slug}" class="srv-hero__title">${t}</h1>
              <ul class="srv-hero-list">
                <li>Прозрачная смета и этапность выполнения «проект&nbsp;→&nbsp;производство&nbsp;→&nbsp;монтаж».</li>
                <li>Собственное производство металлоконструкций и контроль поставки на объект.</li>
                <li>Работаем в Минске и по всей Республике Беларусь.</li>
                <li>Выезд на объект или разбор задачи удалённо по пакету документов.</li>
              </ul>
              <p class="srv-hero__lede">${lede}</p>
            </div>
            <aside class="srv-hero__cta srv-cta-card" aria-label="Обратная связь">
              <strong class="srv-cta-card__title">Получить консультацию</strong>
              <p class="srv-cta-card__sub">Подберём решение под ваш объект по направлению «${t}».</p>
              ${renderSrvCtaPhones()}
              ${scrollBtn("Оставить заявку")}
              <p class="srv-cta-card__hint">Ответ оперативно в рабочее время&nbsp;• пн–пт 09:00–18:00</p>
              <div class="srv-cta-card__avatar" aria-hidden="true"><span>ПК</span></div>
            </aside>
          </div>
        </div>
      </section>

      <section class="srv-section srv-calculator" aria-labelledby="srv-calc-title-${slug}" data-service-calc data-service-slug="${slug}">
        <div class="srv-calculator-inner wrap">
          <h2 id="srv-calc-title-${slug}" class="srv-section-title srv-section-title--dark">Запросите расчёт ориентира по параметрам объекта</h2>
          <p class="srv-section-lede">Демонстрационный блок: выберите сценарий и заполните поля — итоговая стоимость рассчитывается после выгрузки ТЗ заказчиком на этапе продакшна.</p>
          <div class="srv-calc-shell" role="tablist" aria-label="Сценарий расчёта">
            <button type="button" class="srv-calc-tab" role="tab" aria-selected="true" data-srv-tab="1">
              <span class="srv-calc-tab-icon" aria-hidden="true"></span><span>Проект + КМД</span>
            </button>
            <button type="button" class="srv-calc-tab" role="tab" aria-selected="false" data-srv-tab="2">
              <span class="srv-calc-tab-icon srv-calc-tab-icon--steel" aria-hidden="true"></span><span>Производство и монтаж</span>
            </button>
            <button type="button" class="srv-calc-tab" role="tab" aria-selected="false" data-srv-tab="3">
              <span class="srv-calc-tab-icon srv-calc-tab-icon--key" aria-hidden="true"></span><span>Под ключ</span>
            </button>
          </div>
          <div class="srv-calc-panels">
            <div class="srv-calc-panel" data-srv-panel="1" role="tabpanel">
              <div class="srv-calc-fields">
                <label class="srv-field"><span class="srv-field__l">Общая площадь, м²</span><input type="text" placeholder="например, 2800"></label>
                <label class="srv-field"><span class="srv-field__l">Протяжённость, м</span><input type="text" placeholder="фасады / торцы"></label>
                <label class="srv-field"><span class="srv-field__l">Высота здания, м</span><input type="text" placeholder="по ключу потолков"></label>
              </div>
            </div>
            <div class="srv-calc-panel" data-srv-panel="2" role="tabpanel" hidden>
              <div class="srv-calc-fields">
                <label class="srv-field"><span class="srv-field__l">Объём МК в тоннах (ориентир)</span><input type="text" placeholder="оценочно"></label>
                <label class="srv-field"><span class="srv-field__l">Срок поставки</span><input type="text" placeholder="недели / месяцы"></label>
                <label class="srv-field"><span class="srv-field__l">Тип навесного ограждения</span><input type="text" placeholder="сэндвич / профлист …"></label>
              </div>
            </div>
            <div class="srv-calc-panel" data-srv-panel="3" role="tabpanel" hidden>
              <div class="srv-calc-fields">
                <label class="srv-field"><span class="srv-field__l">Назначение объекта</span><input type="text" placeholder="${t}"></label>
                <label class="srv-field"><span class="srv-field__l">Срок КП до</span><input type="text" placeholder="дата / бюджетный квартал"></label>
                <label class="srv-field"><span class="srv-field__l">Адрес / район</span><input type="text" placeholder="область, населённый пункт"></label>
              </div>
            </div>
          </div>
          <div class="srv-calc-actions">
            <button type="button" class="srv-calc-submit srv-btn-scroll" data-scroll-target="${scrollLead}">Передать параметры менеджеру</button>
          </div>
          <p class="srv-calc-disclaimer"><strong>Важно:</strong> финальную цену закрепляют в приложении к договору после сборки исходных данных.</p>
        </div>
      </section>

      <section class="srv-geo">
        <div class="srv-geo-inner wrap">
          <div class="srv-geo-map" aria-hidden="true">
            <svg class="srv-by-map" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 260" aria-hidden="true">
              <rect width="320" height="260" rx="14" fill="#252830"/>
              <ellipse cx="120" cy="120" rx="90" ry="78" fill="rgba(244,190,0,0.16)"/>
              <ellipse cx="210" cy="148" rx="56" ry="62" fill="rgba(244,190,0,0.38)"/>
              <path stroke="rgba(255,255,255,0.12)" stroke-width="1.2" fill="none" d="M42 208h238M42 174h238M62 208V52M122 208V52"/>
            </svg>
            <span class="srv-geo-badge">География: Минск и вся РБ</span>
          </div>
          <div class="srv-geo-copy">
            <h2 class="srv-geo-title">География и логистика</h2>
            <p>ТопАгроБел ведёт проекты в Минске и по всей Республике Беларусь. Планируем логистику поставок и монтаж с учётом удалённости площадки и пропускного режима.</p>
            <ul class="srv-checklist">
              <li>Выезд инженера и разбор технологической схемы на вашей площадке.</li>
              <li>Планируем производственные партии и доставку с учётом пропускного режима и пропускной способности площадки.</li>
              <li>Операции «${t}» ведём в связке со смежными подрядчиками по сценарию генерального подряда или координированным тендером.</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="srv-cooperation wrap" aria-labelledby="srv-stage-title-${slug}">
        <h2 id="srv-stage-title-${slug}" class="srv-section-title srv-section-title--center">Этапы сотрудничества</h2>
        <div class="srv-stages srv-stages--nyutek" data-service-stages="${slug}" data-stage-default="03" aria-label="Этапы сотрудничества">
          <div class="srv-stages-layout">
            <aside class="srv-stages-sidebar" role="tablist" aria-label="Шаг процесса"></aside>
            <div class="srv-stages-pane">
              <div class="srv-stage-photo" aria-hidden="true"></div>
              <div class="srv-stage-inner">
                <div class="srv-stage-skew">
                  <div class="srv-stage-panels"></div>
                  ${scrollBtn("Узнать подробнее", "srv-stage-cta")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <script type="application/json" id="service-stages-json-${slug}">${stagesJson}</script>

      <section class="srv-feature">
        <div class="srv-feature-inner wrap">
          <div class="srv-feature-photo" aria-hidden="true"></div>
          <div class="srv-feature-body">
            <h2 class="srv-section-title">Технологии и качество производства работ</h2>
            <p class="srv-section-lede">Для услуги «${t}» подбираем конструктив и материалы с учётом нормативной базы Беларуси, коррозионной активности и нагрузок.</p>
            <ul class="srv-checklist srv-checklist--light">
              <li>Разделение производственного блока строительно-монтажных работ и авторского наблюдения где это требуется ТЗ.</li>
              <li>Стандартизация узлов там, где позволяет проект — выше качество монтажа и ниже брак при стыковании партий КМД.</li>
              <li>Отчётность по этапам: акты промежуточных работ, промежуточные оплаты по графику договора.</li>
            </ul>
            ${scrollBtn("Оставить заявку")}
          </div>
        </div>
      </section>

      <section class="srv-banner" aria-labelledby="srv-banner-heading-${slug}">
        <div class="srv-banner__bg" aria-hidden="true"></div>
        <div class="srv-banner__inner wrap">
          <div class="srv-banner__copy">
            <h2 id="srv-banner-heading-${slug}" class="srv-banner__title">Полная прозрачность смет и сроков</h2>
            <p>В отдельных разделах «Стоимость» или «Объекты» на сайте блоки представлены внутри каждой посадочной страницы услуги&nbsp;— согласно архитектуре SEO-схемы ТопАгроБел.</p>
          </div>
          <aside class="srv-banner__cta srv-cta-card srv-cta-card--compact">
            <strong class="srv-cta-card__title">Консультация по вашему ТЗ</strong>
            <p class="srv-cta-card__sub">Пришлите габариты, назначение и желаемый срок&nbsp;— подготовим структурированное КП по «${t}».</p>
            ${scrollBtn("Оставить заявку")}
          </aside>
        </div>
      </section>

      <section class="srv-stats wrap" aria-labelledby="srv-stats-title">
        <h2 id="srv-stats-title" class="srv-section-title srv-section-title--center">Почему нас выбирают</h2>
        <div class="srv-stats-grid">
          <article class="srv-stat">
            <b class="srv-stat__num"><span class="srv-stat__accent">13+</span> лет</b>
            <p>На рынке промышленного строительства и монтажа.</p>
          </article>
          <article class="srv-stat">
            <b class="srv-stat__num"><span class="srv-stat__accent">200 000&nbsp;м²</span></b>
            <p>Выполненных объектов суммарно и под обслуживанием.</p>
          </article>
          <article class="srv-stat">
            <b class="srv-stat__num"><span class="srv-stat__accent">50+</span> специалистов</b>
            <p>Штат производственного блока и инженеры сопровождения.</p>
          </article>
        </div>
        <div class="srv-stats-foot">
          <p>Строительно-монтажные блоки выполняются с понятными критериями приёмки; исполнительная документация передаётся вместе с объектом.</p>
          <ul class="srv-inline-list">
            <li>Собственный парк техники ·</li>
            <li>КИП на площадке ·</li>
            <li>Юридически понятное закрытие этапов</li>
          </ul>
        </div>
      </section>

      <section class="srv-projects" aria-labelledby="srv-projects-heading-${slug}">
        <div class="srv-projects-head wrap">
          <h2 id="srv-projects-heading-${slug}" class="srv-projects-title">Готовые объекты по направлению</h2>
          <a href="../index.html#home-portfolio" class="srv-projects-more">На главную — готовые объекты</a>
        </div>
        <div class="srv-projects-grid wrap">
          ${[1, 2, 3, 4, 5, 6]
            .map(
              (n) =>
                `<figure class="srv-project-cell"><figcaption class="visually-hidden">${t}&nbsp;— карточка проекта&nbsp;${n}</figcaption><span class="srv-project-ph">Фото ${n}</span></figure>`,
            )
            .join("")}
        </div>
      </section>

      ${renderPageExtras(service.slug)}

      <section class="srv-faq" aria-labelledby="srv-faq-title-${slug}">
        <div class="srv-faq-bar">
          <h2 id="srv-faq-title-${slug}" class="srv-faq-title">Частые вопросы</h2>
        </div>
        <div class="srv-faq-body wrap">
          <div class="faq faq--srv">
            <div class="faq-item">
              <button type="button" class="faq-q focus-ring" aria-expanded="false">${esc(`Подходит ли ${service.title} для объектов в Минске и по всей РБ?`)}</button>
              <div class="faq-a">Да: страница приземлена под региональный спрос, логистику поставки КМД и типичные климатические нагрузки при проектировании.</div>
            </div>
            <div class="faq-item">
              <button type="button" class="faq-q focus-ring" aria-expanded="false">Можно ли «под ключ» со смежными подрядами?</button>
              <div class="faq-a">Да — берём производственное ядро, координируем смежников по графику и смете или выступаем генподрядчиком.</div>
            </div>
            <div class="faq-item">
              <button type="button" class="faq-q focus-ring" aria-expanded="false">За какой срок можно получить детализированное КП?</button>
              <div class="faq-a">Ориентир 3–14 рабочих дней после сбора исходных данных; простые типовые сценарии ускоряются.</div>
            </div>
          </div>
        </div>
      </section>

      <section class="srv-final strip-cta">
        <div class="strip-cta__inner wrap">
          <div>
            <strong class="strip-cta__title">Обсудим ваш объект уже сегодня</strong>
            <p class="strip-cta__text">Короткая заявка ниже помогает техническому отделу сразу оценить габариты, технологию и приоритет сроков.</p>
          </div>
          ${scrollBtn("Оставить заявку")}
        </div>
      </section>

      <section class="srv-maps-section wrap" aria-label="Локации на карте">
        <div class="srv-map-grid">
          <div class="srv-map-slot">
            <p class="srv-map-slot__ttl">Офис / официальное присутствие</p>
            <div class="srv-map-frame" aria-hidden="true"><span>Виджет карты</span></div>
          </div>
          <div class="srv-map-slot">
            <p class="srv-map-slot__ttl">Производство КМД / отгрузка</p>
            <div class="srv-map-frame" aria-hidden="true"><span>Виджет карты</span></div>
          </div>
        </div>
      </section>

      <article id="service-lead-${slug}" class="srv-lead" aria-labelledby="srv-lead-title-${slug}">
        <div class="srv-lead-inner wrap">
          <h2 id="srv-lead-title-${slug}" class="srv-section-title">Форма заявки по услуге</h2>
          <p class="srv-section-lede">Форма демонстрационная без бэкенда; при отправке показывается уведомление. Позже здесь можно подключить почту, CRM или API.</p>
          <form class="lead-form lead-form--srv" data-contact-form novalidate>
            <div class="field-row">
              <label for="lead-name-${slug}">Компания / ФИО</label>
              <input id="lead-name-${slug}" name="name" autocomplete="organization" placeholder="Как к вам обращаться">
            </div>
            <div class="field-row">
              <label for="lead-phone-${slug}">Телефон</label>
              <input id="lead-phone-${slug}" name="phone" autocomplete="tel" placeholder="+375…">
            </div>
            <div class="field-row">
              <label for="lead-msg-${slug}">Объём и срок задачи по «${t}»</label>
              <textarea id="lead-msg-${slug}" name="message" placeholder="Площадь, технология, срок КП или вопрос специалисту"></textarea>
            </div>
            <div>
              <button class="srv-cta-solid srv-lead-submit" type="submit">Отправить заявку</button>
            </div>
          </form>
        </div>
      </article>`;
}

function serviceHtml(service) {
  const detail = SERVICE_DETAILS[service.slug];
  let mainMarkup;
  let pageTitle;
  let meta;

  if (service.stub) {
    mainMarkup = stubServiceMarkup(service);
    pageTitle = "Аренда строительной техники | ТопАгроБел";
    meta =
      "Аренда строительной техники для земляных, погрузочных, демонтажных и строительных работ. Страница находится в разработке.";
  } else if (detail) {
    mainMarkup = detailedServiceLandingMarkup(detail, service.slug);
    pageTitle = detail.seoTitle;
    meta = detail.seoDescription;
  } else {
    mainMarkup = serviceLandingMarkup(service);
    pageTitle = `${service.title} — ТопАгроБел`;
    meta = `${service.title}: строительные работы, прозрачная смета, этапы, готовые объекты (блок), FAQ по Беларуси.`;
  }

  return `${baseHead({
    depth: "subdir",
    title: pageTitle,
    meta,
  })}
  <link rel="stylesheet" href="${urls("subdir").css}service-page.css">
</head>
<body class="site-shell">
${renderUnifiedHeader({
  depth: "subdir",
  active: "uslugi",
})}

  <main class="site-main site-main--service">
${mainMarkup}
  </main>

${renderFooter("subdir")}
${scripts({ depth: "subdir" })}
</body>
</html>`;
}

function uslugiIndexHtml() {
  const meta =
    "Каталог промышленного и складского строительства: строительство объектов, виды строительно-монтажных работ, ангары, быстровозводимые технологии, генподряд.";

  /** @param {string} heading @param {Service[]} rows */
  const groupSection = (heading, rows) => {
    const rowsHtml = rows
      .map(
        (r) => `
          <section class="link-card">
            <h3 style="margin:0 0 8px;"><a href="${esc(r.slug)}.html">${esc(r.title)}</a></h3>
            <p style="margin:0;color:#565656">${esc(`/uslugi/${r.slug}`)}</p>
          </section>`,
      )
      .join("");
    return `
      <section class="wrap uslugi-group" style="margin-top:16px;">
        <h2 class="page-title" style="font-size:22px;">${esc(heading)}</h2>
        <div class="card-grid cols-3">${rowsHtml}
        </div>
      </section>`;
  };

  const groupsHtml =
    groupSection("Строительство объектов", OBJECT_BUILD) +
    groupSection("Виды работ", WORK_TYPES);

  return `${baseHead({ depth: "subdir", title: "Услуги — ТопАгроБел", meta })}
  <link rel="stylesheet" href="${urls("subdir").css}service-page.css">
</head>
<body class="site-shell">
${renderUnifiedHeader({
  depth: "subdir",
  active: "uslugi",
})}

  <main class="site-main">
    <div class="wrap">
      <nav class="breadcrumbs" aria-label="Хлебные крошки">
        <ol>
          <li><a href="../index.html">Главная</a></li>
          <li aria-current="page">Услуги</li>
        </ol>
      </nav>
      <h1 class="page-title">Строительные услуги</h1>
      <p class="page-lede">Каталог посадочных страниц: строительство промышленных, складских и коммерческих объектов и отдельные виды строительно-монтажных работ.</p>

      <div class="hero">
        <h2 style="margin:0 0 10px;font-size:20px;">Схема проекта и правила блоков на услуге</h2>
        <p style="margin:0;color:#565656;font-weight:650;">Инфографический макет: <a href="../seo-sitemap.html">SEO-карта сайта</a>.</p>
      </div>
    </div>
${groupsHtml}

  </main>

${renderFooter("subdir")}
${scripts({ depth: "subdir" })}
</body>
</html>`;
}

function corpHtml({ folder, title, paragraphs }) {
  const meta = `${title} — официальный сайт ТопАгроБел`;

  const bodyPs = paragraphs
    .map((p) => `<p class="page-lede" style="margin-top:14px">${esc(p)}</p>`)
    .join("");

  return `${baseHead({ depth: "subdir", title: `${title} — ТопАгроБел`, meta })}
</head>
<body class="site-shell">
${renderUnifiedHeader({
  depth: "subdir",
  active: corpNavActive(folder),
})}

  <main class="site-main">
    <div class="wrap">
      <nav class="breadcrumbs" aria-label="Хлебные крошки">
        <ol>
          <li><a href="../index.html">Главная</a></li>
          <li aria-current="page">${esc(title)}</li>
        </ol>
      </nav>

      <h1 class="page-title">${esc(title)}</h1>
      ${bodyPs}
    </div>
  </main>

${renderFooter("subdir")}
${scripts({ depth: "subdir" })}
</body>
</html>`;
}

function homepageHtml() {
  const meta =
    "Строительство промышленных и складских объектов в регионе присутствия; каталог услуг и понятная структура SEO-страниц.";

  return `${baseHead({ depth: "root", title: "ТопАгроБел — строительная компания", meta })}
</head>
<body class="site-shell">
${renderUnifiedHeader({
  depth: "root",
  active: null,
})}

  <main class="site-main">
    <div class="wrap hero">
      <h1 class="hero-title">Промышленное и складское строительство</h1>
      <p class="hero-lede">Каркас статического сайта разбит на папки и отдельные HTML-файлы по утверждённой SEO-карте. Главное отличие: «Стоимость», «Объекты» и «Проекты» не выделяются в отдельные разделы — они становятся частью каждой страницы услуги.</p>
      <div class="hero-actions">
        <a class="btn btn-primary focus-ring" href="uslugi/index.html">Каталог услуг</a>
        <a class="btn btn-ghost focus-ring" href="kontakty/index.html">Связаться</a>
        <a class="btn btn-ghost focus-ring" href="seo-sitemap.html">SEO-схема проекта</a>
      </div>
    </div>

    <div class="wrap" style="margin-top:26px;">
      <h2 style="margin:8px 0 10px;font-size:22px;">Быстрые ссылки служебных страниц</h2>
      <div class="card-grid cols-3">
        <section class="link-card"><h2>Служебные</h2><ul><li><a href="o-kompanii/index.html">О компании</a></li><li><a href="partnery/index.html">Партнеры</a></li></ul></section>
        <section class="link-card"><h2>Документы</h2><ul><li><a href="sertifikaty-i-dokumenty/index.html">Сертификаты и документы</a></li><li><a href="rekvizity/index.html">Реквизиты</a></li></ul></section>
        <section class="link-card"><h2>Медиаполе SEO</h2><ul><li><a href="blog/index.html">Блог</a></li><li><a href="uslugi/index.html">Ядро по услугам</a></li></ul></section>
      </div>
    </div>
  </main>

${renderFooter("root")}
${scripts({ depth: "root" })}
</body>
</html>`;
}

function seoSitemapHtml() {
  const objectItems = OBJECT_BUILD.map(
    (s, idx) => `
                <li class="service-item"><span class="num">${idx + 1}</span><div><span class="service-name">${esc(s.title)}</span><a class="url" href="uslugi/${esc(s.slug)}.html">${esc(`/uslugi/${s.slug}`)}</a></div><span class="freq">${esc(s.freq ?? "—")}</span></li>`,
  ).join("");
  const workItems = WORK_TYPES.map(
    (s, idx) => `
                <li class="service-item"><span class="num">${idx + 1}</span><div><span class="service-name">${esc(s.title)}</span><a class="url" href="uslugi/${esc(s.slug)}.html">${esc(`/uslugi/${s.slug}`)}</a></div><span class="freq">${esc(s.freq ?? "—")}</span></li>`,
  ).join("");
  const body = `
  <main class="page">
    <div class="container">
      <header class="header">
        <h1 class="title">SEO-сайтмап сайта ТопАгроБел</h1>
        <p class="subtitle">Промышленное и складское строительство, виды строительно-монтажных работ и посадочные страницы услуг.<br/>Частотность на исходной схеме — суммарный спрос кластера в месяц по Минской области.</p>

        <div class="semantic-bar">
          <div class="semantic-icon"><span></span></div>
          <span>Охват семантики:</span>
          <span><span class="yellow">расширенный</span> каталог услуг</span>
          <span class="dot"></span>
          <span>промышленное строительство и виды работ</span>
        </div>

        <section class="home-node">
          <div class="home-icon" aria-hidden="true"></div>
          <div>
            <strong><a href="index.html">Главная</a></strong>
            <div class="home-url">260 / мес.</div>
          </div>
        </section>
      </header>

      <section class="structure">
        <div class="section-box services-section">
          <div class="box-title"><span class="title-icon crane"></span>Услуги <small>(SEO-ядро)</small></div>

          <div class="services-grid">
            <article class="service-column">
              <div class="service-head">Строительство объектов</div>
              <ul class="service-list">${objectItems}
              </ul>
            </article>

            <article class="service-column">
              <div class="service-head">Виды работ</div>
              <ul class="service-list">${workItems}
              </ul>
            </article>
          </div>
        </div>

        <div class="section-box side-section">
          <div class="box-title"><span class="title-icon doc"></span>Служебные страницы</div>
          <div class="side-list">
            <div class="side-item"><div class="line-icon user"></div><div><div class="side-name">О компании</div><a class="side-url url" href="o-kompanii/index.html">${esc(`/o-kompanii/`)}</a></div></div>
            <div class="side-item"><div class="line-icon hand"></div><div><div class="side-name">Партнеры</div><a class="side-url url" href="partnery/index.html">${esc(`/partnery/`)}</a></div></div>
            <div class="side-item"><div class="line-icon cert"></div><div><div class="side-name">Сертификаты и документы</div><a class="side-url url" href="sertifikaty-i-dokumenty/index.html">${esc(`/sertifikaty-i-dokumenty/`)}</a></div></div>
            <div class="side-item"><div class="line-icon pin"></div><div><div class="side-name">Контакты</div><a class="side-url url" href="kontakty/index.html">${esc(`/kontakty/`)}</a></div></div>
            <div class="side-item"><div class="line-icon calc"></div><div><div class="side-name">Реквизиты</div><a class="side-url url" href="rekvizity/index.html">${esc(`/rekvizity/`)}</a></div></div>
          </div>
        </div>

        <div class="section-box support-section">
          <div class="box-title"><span class="title-icon book"></span>Контентная поддержка</div>
          <div class="support-grid">
            <article class="blog-card">
              <div class="line-icon pencil"></div>
              <div class="blog-title"><span><a href="blog/index.html">Блог</a></span><span>${esc(`/blog/`)} — информационные статьи и расширение семантики</span></div>
            </article>

            <article class="note-card">
              <div class="note-title"><span class="badge-icon">★</span>Что важно</div>
              <ul class="note-list">
                <li><b>1</b><span>Отдельных разделов «Стоимость», «Объекты» и «Проекты» нет.</span></li>
                <li><b>2</b><span>Стоимость — отдельный блок внутри каждой страницы услуги.</span></li>
                <li><b>3</b><span>Готовые объекты — блок внутри страниц услуг, не отдельный раздел.</span></li>
                <li><b>4</b><span>Данные на схеме соответствуют исходной таблице Google Ads по Минской области (в суммах частот).</span></li>
              </ul>
            </article>

            <article class="template-card">
              <div class="template-title"><span class="badge-icon">⚙</span>Шаблон страницы услуги</div>
              <div class="template-flow">
                <div class="flow-item"><div class="flow-ico"></div>Описание<br/>услуги</div>
                <div class="arrow">→</div>
                <div class="flow-item"><div class="flow-ico light"></div>Технология /<br/>решение</div>
                <div class="arrow">→</div>
                <div class="flow-item"><div class="flow-ico rub">BYN</div>Стоимость</div>
                <div class="arrow">→</div>
                <div class="flow-item"><div class="flow-ico steps"></div>Этапы</div>
                <div class="flow-item"><div class="flow-ico steps"></div>Готовые<br/>объекты</div>
                <div class="arrow">→</div>
                <div class="flow-item"><div class="flow-ico rub">?</div>FAQ</div>
                <div class="arrow">→</div>
                <div class="flow-item"><div class="flow-ico"></div>Форма<br/>заявки</div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>

    <div class="building-sketch" aria-hidden="true"></div>
    <div class="bottom-drawing" aria-hidden="true"></div>
  </main>`;

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SEO-сайтмап — ТопАгроБел</title>
  <meta name="description" content="${esc(`Интерактивная SEO-схема распределения посадочных страниц услуги ТопАгроБел.`)}">
  <link rel="stylesheet" href="${urls("root").css}base.css">
  <link rel="stylesheet" href="${urls("root").css}layout.css">
  <link rel="stylesheet" href="${urls("root").css}header-unified.css">
  <link rel="icon" href="${urls("root").favicon}" type="image/svg+xml">
  <link rel="stylesheet" href="${urls("root").css}sitemap.css">
</head>
<body class="site-shell">
${renderUnifiedHeader({
  depth: "root",
  active: null,
})}
<div id="viz">${body}</div>
${renderFooter("root")}
${scripts({ depth: "root" })}
</body>
</html>`;
}

function sitemapXml() {
  const today = new Date().toISOString().slice(0, 10);
  const staticPages = [
    { loc: "/", priority: "1.0", changefreq: "weekly" },
    { loc: "/uslugi/", priority: "0.9", changefreq: "weekly" },
    ...SERVICES.map((s) => ({
      loc: `/uslugi/${s.slug}`,
      priority: s.stub ? "0.4" : "0.8",
      changefreq: s.stub ? "monthly" : "monthly",
    })),
    { loc: "/o-kompanii/", priority: "0.7", changefreq: "monthly" },
    { loc: "/partnery/", priority: "0.6", changefreq: "monthly" },
    { loc: "/sertifikaty-i-dokumenty/", priority: "0.6", changefreq: "monthly" },
    { loc: "/kontakty/", priority: "0.7", changefreq: "monthly" },
    { loc: "/rekvizity/", priority: "0.4", changefreq: "yearly" },
    { loc: "/blog/", priority: "0.6", changefreq: "weekly" },
  ];

  const urls = staticPages
    .map(
      (p) => `
  <url>
    <loc>${SITE_ORIGIN}${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;
}

function beskarkasRedirectHtml() {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=stroitelstvo-angarov.html">
  <link rel="canonical" href="${SITE_ORIGIN}/uslugi/stroitelstvo-angarov">
  <title>Перенаправление — Строительство ангаров | ТопАгроБел</title>
  <script>location.replace("stroitelstvo-angarov.html");</script>
</head>
<body>
  <p>Страница перемещена. <a href="stroitelstvo-angarov.html">Перейти к строительству ангаров</a>.</p>
</body>
</html>`;
}

for (const s of SERVICES) {
  fs.writeFileSync(
    path.join(PROJECT_ROOT, "uslugi", `${s.slug}.html`),
    serviceHtml(s),
    "utf8",
  );
}

fs.writeFileSync(path.join(PROJECT_ROOT, "uslugi", "index.html"), uslugiIndexHtml(), "utf8");

// index.html поддерживается вручную (макет главной) — не перезаписывать.
// fs.writeFileSync(path.join(PROJECT_ROOT, "index.html"), homepageHtml(), "utf8");

fs.writeFileSync(path.join(PROJECT_ROOT, "seo-sitemap.html"), seoSitemapHtml(), "utf8");

fs.writeFileSync(path.join(PROJECT_ROOT, "sitemap.xml"), sitemapXml(), "utf8");

fs.writeFileSync(
  path.join(PROJECT_ROOT, "uslugi", "beskarkasnye-angary.html"),
  beskarkasRedirectHtml(),
  "utf8",
);

const corp = [
  // «О компании» — см. статический o-kompanii/index.html (макет, не генератором).
  {
    folder: "partnery",
    title: "Партнеры",
    paragraphs: ["Блок партнёрских логотипов и производственных связок."],
  },
  {
    folder: "sertifikaty-i-dokumenty",
    title: "Сертификаты и документы",
    paragraphs: [
      "Список действующих разрешений, сертификатов и карточек соответствия.",
    ],
  },
  {
    folder: "kontakty",
    title: "Контакты",
    paragraphs: ["Точка входа клиента для коммерческих заявок и выездных расчётов."],
  },
  {
    folder: "rekvizity",
    title: "Реквизиты",
    paragraphs: ["Полная карточка юридического лица с банковскими счетами."],
  },
  {
    folder: "blog",
    title: "Блог",
    paragraphs: [
      "Поддерживающее SEO информационное наполнение: статьи, разбор технологии, экспертные кейсы без отрыва от главного ядра «услуг».",
      "При росте блога удобно добавлять вложенные папки: /blog/…/index.html или article.html под ваш генератор статического экспорта.",
    ],
  },
];

for (const c of corp) {
  fs.writeFileSync(
    path.join(PROJECT_ROOT, c.folder, "index.html"),
    corpHtml(c),
    "utf8",
  );
}

console.log(`OK: ${SERVICES.length} service landing pages generated.`);
