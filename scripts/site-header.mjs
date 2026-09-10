/**
 * Unified site-header + mobile menu markup (earthworks / header-unified pattern).
 * @typedef {'root' | 'uslugi' | 'subdir'} HeaderDepth
 * @typedef {'home' | 'uslugi' | 'o-kompanii' | 'blog' | null} HeaderActive
 * @typedef {'single' | 'dual'} PhonesMode
 */

/** @type {{ slug: string; label: string; wip?: boolean }[]} */
export const PODRYAD_SERVICES = [
  { slug: "promyshlennye-betonnye-poly", label: "Бетонные полы" },
  { slug: "zemlyanye-raboty", label: "Земляные работы" },
  { slug: "naruzhnye-inzhenernye-seti", label: "Наружные сети" },
  { slug: "arenda-stroitelnoy-tehniki", label: "Аренда техники" },
  { slug: "rekonstrukciya-zdaniy", label: "Реконструкция зданий", wip: true },
  { slug: "fundamenty-promyshlennyh-zdaniy", label: "Фундаменты", wip: true },
  {
    slug: "montazh-metallokonstrukciy",
    label: "Монтаж металлоконструкций",
    wip: true,
  },
  { slug: "monolitnye-raboty", label: "Монолитные работы", wip: true },
  { slug: "krovelnye-raboty", label: "Кровельные работы", wip: true },
  { slug: "fasadnye-raboty", label: "Фасадные работы", wip: true },
  {
    slug: "stroitelstvo-dorog-i-ploshchadok",
    label: "Дороги и площадки",
    wip: true,
  },
  { slug: "montazh-sbornogo-zhelezobetona", label: "Сборный ЖБ", wip: true },
  { slug: "usilenie-konstrukciy", label: "Усиление конструкций", wip: true },
  { slug: "stroitelno-montazhnye-raboty", label: "СМР", wip: true },
];

/** @type {{ slug: string; label: string; wip?: boolean }[]} */
export const GENPODRYAD_SERVICES = [
  { slug: "genpodryad", label: "Генподряд", wip: true },
  { slug: "promyshlennye-zdaniya", label: "Промышленные здания", wip: true },
  { slug: "stroitelstvo-skladov", label: "Складские здания", wip: true },
  { slug: "stroitelstvo-angarov", label: "Ангары", wip: true },
  {
    slug: "stroitelstvo-bystrovozvodimyh-zdaniy",
    label: "Быстровозводимые здания",
    wip: true,
  },
  {
    slug: "zdaniya-iz-sendvich-paneley",
    label: "Здания из сэндвич-панелей",
    wip: true,
  },
  {
    slug: "zdaniya-iz-metallokonstrukciy",
    label: "Здания из металлоконструкций",
    wip: true,
  },
  { slug: "zdaniya-iz-lstk", label: "Здания из ЛСТК", wip: true },
  { slug: "modulnye-zdaniya", label: "Модульные здания", wip: true },
  {
    slug: "angary-iz-sendvich-paneley",
    label: "Ангары из сэндвич-панелей",
    wip: true,
  },
  {
    slug: "stroitelstvo-zdaniy-i-sooruzheniy",
    label: "Здания и сооружения",
    wip: true,
  },
  {
    slug: "promyshlennoe-stroitelstvo",
    label: "Промстроительство",
    wip: true,
  },
];

/** @type {Map<string, string>} */
export const SERVICE_LABEL_BY_SLUG = new Map(
  [...PODRYAD_SERVICES, ...GENPODRYAD_SERVICES].map((s) => [s.slug, s.label]),
);

const BADGE = ' <span class="nav-dropdown__badge">В разработке</span>';

const CLOSE_ICON =
  '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';

/**
 * @param {HeaderDepth} depth
 */
function pathPrefixes(depth) {
  if (depth === "root") {
    return {
      home: "index.html",
      logo: "assets/images/main/Logo.webp",
      uslugiIndex: "uslugi/index.html",
      uslugiBase: "uslugi/",
      oKompanii: "o-kompanii/index.html",
      blog: "blog/index.html",
      reviews: "#home-reviews",
    };
  }
  if (depth === "uslugi") {
    return {
      home: "../index.html",
      logo: "../assets/images/main/Logo.webp",
      uslugiIndex: "index.html",
      uslugiBase: "",
      oKompanii: "../o-kompanii/index.html",
      blog: "../blog/index.html",
      reviews: "../index.html#home-reviews",
    };
  }
  return {
    home: "../index.html",
    logo: "../assets/images/main/Logo.webp",
    uslugiIndex: "../uslugi/index.html",
    uslugiBase: "../uslugi/",
    oKompanii: "../o-kompanii/index.html",
    blog: "../blog/index.html",
    reviews: "../index.html#home-reviews",
  };
}

/**
 * @param {string} slug
 * @param {string} uslugiBase
 */
function serviceHref(slug, uslugiBase) {
  return `${uslugiBase}${slug}.html`;
}

/**
 * @param {{ slug: string; label: string; wip?: boolean }} item
 * @param {string} href
 * @param {string | null} trailSlug
 * @param {'desktop' | 'mobile'} mode
 */
function serviceLink(item, href, trailSlug, mode) {
  const current =
    trailSlug && trailSlug === item.slug ? ' aria-current="page"' : "";
  const badge = item.wip ? BADGE : "";
  if (mode === "desktop") {
    return `<li><a class="nav-dropdown__link" href="${href}"${current}>${item.label}${badge}</a></li>`;
  }
  return `<a class="nav-mobile__link" href="${href}" data-close-mobile-menu${current}>${item.label}${badge}</a>`;
}

/**
 * @param {object} opts
 * @param {HeaderDepth} opts.depth
 * @param {HeaderActive} [opts.active]
 * @param {string | null} [opts.trailLabel]
 * @param {string | null} [opts.trailSlug]
 * @param {PhonesMode} [opts.phonesMode]
 * @returns {string}
 */
export function renderSiteHeaderAndMobile({
  depth,
  active = null,
  trailLabel = null,
  trailSlug = null,
  phonesMode = "single",
}) {
  const p = pathPrefixes(depth);
  const showTrail = Boolean(trailLabel);
  const ac = (key) =>
    active != null && active === key ? ' aria-current="page"' : "";

  const uslugiCurrent =
    !showTrail && active === "uslugi" ? ' aria-current="page"' : "";

  const desktopPodryad = PODRYAD_SERVICES.map((item) =>
    serviceLink(
      item,
      serviceHref(item.slug, p.uslugiBase),
      trailSlug,
      "desktop",
    ),
  ).join("\n                    ");

  const desktopGen = GENPODRYAD_SERVICES.map((item) =>
    serviceLink(
      item,
      serviceHref(item.slug, p.uslugiBase),
      trailSlug,
      "desktop",
    ),
  ).join("\n                    ");

  const mobilePodryad = PODRYAD_SERVICES.map((item) =>
    serviceLink(
      item,
      serviceHref(item.slug, p.uslugiBase),
      trailSlug,
      "mobile",
    ),
  ).join("\n            ");

  const mobileGen = GENPODRYAD_SERVICES.map((item) =>
    serviceLink(
      item,
      serviceHref(item.slug, p.uslugiBase),
      trailSlug,
      "mobile",
    ),
  ).join("\n            ");

  const dropdownBody = `<div class="nav-dropdown" role="region" aria-label="Каталог услуг">
              <div class="nav-dropdown__cols">
                <div class="nav-dropdown__col">
                  <p class="nav-dropdown__title">Подряд</p>
                  <ul class="nav-dropdown__list">
                    ${desktopPodryad}
                  </ul>
                </div>
                <div class="nav-dropdown__col">
                  <p class="nav-dropdown__title">Генподряд</p>
                  <ul class="nav-dropdown__list">
                    ${desktopGen}
                  </ul>
                </div>
              </div>
              <a class="nav-dropdown__all" href="${p.uslugiIndex}">Все услуги</a>
            </div>`;

  const uslugiDesktopItem = showTrail
    ? `<li class="nav__item nav__item--trail nav__item--dropdown">
            <div class="nav__trail-trigger">
              <a class="nav__link" href="${p.uslugiIndex}" aria-haspopup="true" aria-expanded="false"${uslugiCurrent}>Услуги</a>
              <span class="nav__trail-sep" aria-hidden="true">→</span>
              <span class="nav__trail-current" aria-current="page">${trailLabel}</span>
            </div>
            ${dropdownBody}
          </li>`
    : `<li class="nav__item nav__item--dropdown">
            <a class="nav__link" href="${p.uslugiIndex}" aria-haspopup="true" aria-expanded="false"${uslugiCurrent}>Услуги</a>
            ${dropdownBody}
          </li>`;

  const uslugiMobileBlock = showTrail
    ? `<div class="nav-mobile__dropdown">
          <a class="nav-mobile__link nav-mobile__link--trail" href="${p.uslugiIndex}" data-close-mobile-menu${uslugiCurrent}>
            <span>Услуги</span>
            <span class="nav__trail-sep" aria-hidden="true">→</span>
            <span class="nav__trail-current" aria-current="page">${trailLabel}</span>
          </a>
          <div class="nav-mobile__dropdown-panel">
            <p class="nav-mobile__sub-label">Подряд</p>
            ${mobilePodryad}
            <p class="nav-mobile__sub-label">Генподряд</p>
            ${mobileGen}
          </div>
        </div>`
    : `<div class="nav-mobile__dropdown">
          <a class="nav-mobile__link" href="${p.uslugiIndex}" data-close-mobile-menu${uslugiCurrent}>Услуги</a>
          <div class="nav-mobile__dropdown-panel">
            <p class="nav-mobile__sub-label">Подряд</p>
            ${mobilePodryad}
            <p class="nav-mobile__sub-label">Генподряд</p>
            ${mobileGen}
          </div>
        </div>`;

  const headerActions =
    phonesMode === "dual"
      ? `<div class="header-actions">
        <div class="header-contact">
          <div class="header-contact-lines">
            <a class="header-phone-row" href="tel:+375291286217">
              <span class="header-phone-row__name">Олег Олегович</span>
              <span class="header-phone-row__num">+375 (29) 128-62-17</span>
            </a>
            <a class="header-phone-row" href="tel:+375296582950">
              <span class="header-phone-row__name">Святослав Робертович</span>
              <span class="header-phone-row__num">+375 (29) 658-29-50</span>
            </a>
          </div>
        </div>
        <button class="btn btn--yellow btn--sm header-actions__callback" type="button" data-callback-modal>Заказать звонок</button>
        <div class="header-socials" data-messenger-links data-messenger-compact></div>
      </div>`
      : `<div class="header-actions">
        <div class="header-contact">
          <div class="header-contact-lines">
            <a class="header-phone" href="tel:+375291286217">+375 (29) 128-62-17</a>
          </div>
          <div class="header-socials" data-messenger-links data-messenger-compact></div>
        </div>
        <button class="btn btn--yellow btn--sm header-actions__callback" type="button" data-callback-modal>Заказать звонок</button>
      </div>`;

  const mobileActions =
    phonesMode === "dual"
      ? `<div class="nav-mobile__actions">
        <div class="nav-mobile__phones">
          <a class="nav-mobile__phone" href="tel:+375291286217">
            <span class="nav-mobile__phone-name">Олег Олегович</span>
            <span class="nav-mobile__phone-num">+375 (29) 128-62-17</span>
          </a>
          <a class="nav-mobile__phone" href="tel:+375296582950">
            <span class="nav-mobile__phone-name">Святослав Робертович</span>
            <span class="nav-mobile__phone-num">+375 (29) 658-29-50</span>
          </a>
        </div>
        <div data-messenger-links data-messenger-nav></div>
        <button class="btn btn--dark btn--full" type="button" data-callback-modal data-close-mobile-menu>Заказать звонок</button>
      </div>`
      : `<div class="nav-mobile__actions">
        <a class="btn btn--yellow btn--full" href="tel:+375291286217">+375 (29) 128-62-17</a>
        <div data-messenger-links data-messenger-nav></div>
        <button class="btn btn--dark btn--full" type="button" data-callback-modal data-close-mobile-menu>Заказать звонок</button>
      </div>`;

  return `  <header class="site-header" data-site-header>
    <div class="wrap site-header__inner">
      <a class="logo" href="${p.home}" aria-label="ТопАгроБел — на главную">
        <img class="logo__img" src="${p.logo}" alt="ТопАгроБел" width="160" height="44" decoding="async">
      </a>

      <nav class="nav" aria-label="Основная навигация по сайту">
        <ul class="nav__list">
          <li><a class="nav__link" href="${p.home}"${ac("home")}>Главная</a></li>
          ${uslugiDesktopItem}
          <li><a class="nav__link" href="${p.oKompanii}"${ac("o-kompanii")}>О компании</a></li>
          <li><a class="nav__link" href="${p.reviews}">Отзывы</a></li>
          <li><a class="nav__link" href="${p.blog}"${ac("blog")}>Новости</a></li>
        </ul>
      </nav>

      ${headerActions}

      <button
        class="burger"
        type="button"
        data-burger
        aria-expanded="false"
        aria-controls="mobile-menu"
        aria-label="Открыть меню">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <div class="nav-mobile" id="mobile-menu" data-mobile-menu aria-hidden="true">
    <button type="button" class="nav-mobile__backdrop" data-close-mobile-menu aria-label="Закрыть меню"></button>
    <nav class="nav-mobile__panel" aria-label="Мобильная навигация">
      <div class="nav-mobile__head">
        <span class="nav-mobile__brand">ТопАгроБел</span>
        <button type="button" class="nav-mobile__close" data-close-mobile-menu aria-label="Закрыть меню">
          ${CLOSE_ICON}
        </button>
      </div>
      <div class="nav-mobile__links">
        <a class="nav-mobile__link" href="${p.home}" data-close-mobile-menu${ac("home")}>Главная</a>
        ${uslugiMobileBlock}
        <a class="nav-mobile__link" href="${p.oKompanii}" data-close-mobile-menu${ac("o-kompanii")}>О компании</a>
        <a class="nav-mobile__link" href="${p.reviews}" data-close-mobile-menu>Отзывы</a>
        <a class="nav-mobile__link" href="${p.blog}" data-close-mobile-menu${ac("blog")}>Новости</a>
      </div>
      ${mobileActions}
    </nav>
  </div>`;
}
