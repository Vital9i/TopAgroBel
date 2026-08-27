/** Ключ API: https://developer.tech.yandex.ru/ (при необходимости) */
const YANDEX_MAPS_API_KEY = '';

const MAP_WORK_PERIODS = [
  'на объекте до 28 мая 2026',
  '12–20 мая 2026',
  '15–25 мая 2026',
  'до 5 июня 2026',
  '18–30 мая 2026',
  '10–22 мая 2026',
  'до 15 июня 2026',
  '20 мая — 3 июня 2026',
  '14–26 мая 2026',
  'до 1 июня 2026'
];

/** Техника на карте: Минск, Кобрин, Брест */
const MAP_KOBRIN_FLEET_IDS = ['b879f-8965', 'ek12-8872', 'cdm308'];
const MAP_BREST_FLEET_IDS = ['l933f-8926'];

const MAP_CITY_COORDS = {
  minsk: { place: 'Минск', coords: [53.9045, 27.5615] },
  brest: { place: 'Брест', coords: [52.0976, 23.7341] },
  kobrin: { place: 'Кобрин', coords: [52.2138, 24.3564] }
};

function shuffleArray(items) {
  const list = [...items];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function coordsWithJitter(baseCoords, index, total) {
  const angle = (index / Math.max(total, 1)) * Math.PI * 2;
  const radius = 0.018 + (index % 3) * 0.006;
  return [
    baseCoords[0] + Math.cos(angle) * radius,
    baseCoords[1] + Math.sin(angle) * radius
  ];
}

function buildMapMarkers() {
  if (typeof FLEET === 'undefined') return [];

  const fleet = FLEET.filter(item => item.id !== 'hmb68');
  const periods = shuffleArray(MAP_WORK_PERIODS);

  const kobrinFleet = fleet.filter(item => MAP_KOBRIN_FLEET_IDS.includes(item.id));
  const brestFleet = fleet.filter(item => MAP_BREST_FLEET_IDS.includes(item.id));
  const minskFleet = fleet.filter(item =>
    !MAP_KOBRIN_FLEET_IDS.includes(item.id) && !MAP_BREST_FLEET_IDS.includes(item.id)
  );

  const buildCityMarkers = (items, cityKey) => {
    const city = MAP_CITY_COORDS[cityKey];
    return items.map((equipment, index) => ({
      coords: coordsWithJitter(city.coords, index, items.length),
      place: city.place,
      dates: periods[index % periods.length],
      equipmentName: equipment.name,
      image: equipment.image
    }));
  };

  return [
    ...buildCityMarkers(minskFleet, 'minsk'),
    ...buildCityMarkers(brestFleet, 'brest'),
    ...buildCityMarkers(kobrinFleet, 'kobrin')
  ];
}

function createBalloonHtml(marker) {
  return `
    <div class="map-balloon">
      <img class="map-balloon__img" src="${marker.image}" alt="${marker.equipmentName}">
      <p class="map-balloon__place">${marker.place}</p>
      <p class="map-balloon__dates">Сроки на объекте: ${marker.dates}</p>
    </div>
  `;
}

function initYandexMap() {
  const container = document.getElementById('yandexMap');
  if (!container || typeof ymaps === 'undefined') return;

  ymaps.ready(() => {
    const map = new ymaps.Map('yandexMap', {
      center: [52.85, 26.4],
      zoom: 7,
      controls: ['zoomControl', 'fullscreenControl']
    }, {
      suppressMapOpenBlock: true
    });

    map.behaviors.disable('scrollZoom');

    const markers = buildMapMarkers();

    markers.forEach(marker => {
      const placemark = new ymaps.Placemark(
        marker.coords,
        {
          balloonContentHeader: marker.equipmentName,
          balloonContentBody: createBalloonHtml(marker),
          hintContent: `${marker.place} — ${marker.dates}`
        },
        {
          preset: 'islands#yellowDotIcon'
        }
      );

      map.geoObjects.add(placemark);
    });

    if (map.geoObjects.getLength() > 1) {
      map.setBounds(map.geoObjects.getBounds(), {
        checkZoomRange: true,
        zoomMargin: 50
      });
    }
  });
}

function loadYandexMapsScript() {
  if (document.getElementById('yandexMapsScript')) {
    if (typeof ymaps !== 'undefined') initYandexMap();
    return;
  }

  const script = document.createElement('script');
  script.id = 'yandexMapsScript';
  script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU${YANDEX_MAPS_API_KEY ? `&apikey=${YANDEX_MAPS_API_KEY}` : ''}`;
  script.async = true;
  script.onload = initYandexMap;
  script.onerror = () => {
    const el = document.getElementById('yandexMap');
    if (el) {
      el.innerHTML = '<p class="map-section__fallback">Не удалось загрузить Яндекс.Карты. Проверьте подключение к интернету или укажите API-ключ в js/map.js</p>';
    }
  };
  document.head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', loadYandexMapsScript);
