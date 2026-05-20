# ТопАгроБел — статический каркас сайта

Проект разбит под SEO-структуру с макета: главная → каталог услуг → посадочные страницы, служебные разделы, блог. Стили вынесены в `css/`, поведение (меню, FAQ, формы, интерактив главной) в `js/main.js`.

## Карта файлов и папок

| Раздел | Путь |
| --- | --- |
| Главная | `index.html` |
| Интерактивная SEO-схема с макета | `seo-sitemap.html`, стили инфографики — `css/sitemap.css` (обёртка `#viz`) |
| Услуги — список | `uslugi/index.html` |
| Посадочные услуги (16 шт.) | `uslugi/*.html` |
| О компании | `o-kompanii/index.html` |
| Партнеры | `partnery/index.html` |
| Сертификаты | `sertifikaty-i-dokumenty/index.html` |
| Контакты | `kontakty/index.html` |
| Реквизиты | `rekvizity/index.html` |
| Блог | `blog/index.html` |
| Стили общие | `css/base.css`, `css/layout.css`, `css/header-unified.css` (единая шапка) |
| Лендинг главной по макету | `css/home.css`; Swiper подключается из `index.html` (CDN) |
| Макет «О компании» | `css/about-page.css`; разметка в `o-kompanii/index.html` |
| Шаблон посадочных услуг (Nyutek-стиль блоки) | `css/service-page.css`; разметка из `scripts/generate-site.mjs` → перегенерация `uslugi/*.html` |
| Скрипты | `js/main.js` |
| Ресурсы | `assets/` (например `favicon.svg`) |

## Перегенерация HTML

После изменения текстов или списка услуг в кодогенераторе:

```bash
node scripts/generate-site.mjs
```

**Важно:** скрипт **не перезаписывает** корневой `index.html` и не генерирует `o-kompanii/index.html` — их разметку правим напрямую в репозитории.

## Прочее

- Фото объектов имеет смысл класть в `assets/images/` и использовать в блоке «Готовые объекты» на страницах услуг.
# TopAgroBel
