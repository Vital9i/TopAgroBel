/**
 * Единый YouTube-плеер для сайта.
 * Использование:
 *   <div class="yt-player" data-youtube="VIDEO_ID_OR_URL" data-youtube-title="Заголовок"></div>
 *   data-youtube-mode="inline" | "modal" (по умолчанию inline)
 */
(function () {
  function parseYoutubeId(value) {
    if (!value) return "";
    const raw = String(value).trim();
    if (/^[A-Za-z0-9_-]{6,}$/.test(raw) && !raw.includes(".")) return raw;
    const match = raw.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{6,})/,
    );
    return match ? match[1] : "";
  }

  function thumbUrl(id, quality) {
    return `https://i.ytimg.com/vi/${id}/${quality}.jpg`;
  }

  function createIframe(id, title, autoplay) {
    const iframe = document.createElement("iframe");
    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
    });
    if (autoplay) params.set("autoplay", "1");
    iframe.className = "yt-player__iframe";
    iframe.src = `https://www.youtube.com/embed/${id}?${params.toString()}`;
    iframe.title = title || "YouTube video";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.loading = "lazy";
    return iframe;
  }

  function mountFacade(root, id, title, onPlay, poster) {
    root.classList.add("yt-player");
    root.innerHTML = "";

    const facade = document.createElement("button");
    facade.type = "button";
    facade.className = "yt-player__facade";
    facade.setAttribute("aria-label", `Смотреть: ${title || "видео"}`);
    if (!id) facade.disabled = true;

    const img = document.createElement("img");
    img.className = "yt-player__thumb";
    img.src = poster || (id ? thumbUrl(id, "hqdefault") : "");
    img.alt = title || "Обложка видео";
    img.width = 480;
    img.height = 360;
    img.loading = "lazy";
    img.decoding = "async";
    if (!poster && id) {
      img.addEventListener("error", () => {
        if (!img.src.includes("mqdefault")) {
          img.src = thumbUrl(id, "mqdefault");
        }
      });

      const hi = new Image();
      hi.onload = () => {
        if (hi.naturalWidth > 120) img.src = thumbUrl(id, "maxresdefault");
      };
      hi.src = thumbUrl(id, "maxresdefault");
    }

    const play = document.createElement("span");
    play.className = "yt-player__play";
    play.setAttribute("aria-hidden", "true");
    play.innerHTML =
      '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';

    facade.append(img, play);
    root.appendChild(facade);

    facade.addEventListener("click", (e) => {
      e.preventDefault();
      onPlay();
    });
  }

  function playInline(root, id, title) {
    root.innerHTML = "";
    root.classList.add("is-playing");
    root.appendChild(createIframe(id, title, true));
  }

  function openInModal(id, title) {
    if (typeof window.openSiteVideo === "function") {
      window.openSiteVideo({
        src: `https://youtu.be/${id}`,
        title: title || "Видео",
      });
      return;
    }
    const trigger = document.createElement("button");
    trigger.hidden = true;
    trigger.setAttribute("data-video-open", "");
    trigger.setAttribute("data-video-src", `https://youtu.be/${id}`);
    trigger.setAttribute("data-video-title", title || "Видео");
    document.body.appendChild(trigger);
    trigger.click();
    trigger.remove();
  }

  function initYoutubePlayers(scope) {
    const root = scope || document;
    root.querySelectorAll("[data-youtube]").forEach((el) => {
      if (el.closest("[hidden]")) return;
      if (el.dataset.youtubeReady === "1") return;
      const id = parseYoutubeId(el.getAttribute("data-youtube"));
      const poster = el.getAttribute("data-youtube-poster") || "";
      if (!id && !poster) return;

      const title = el.getAttribute("data-youtube-title") || el.getAttribute("aria-label") || "Видео";
      const mode = (el.getAttribute("data-youtube-mode") || "inline").toLowerCase();
      el.dataset.youtubeReady = "1";

      mountFacade(el, id, title, () => {
        if (!id) return;
        if (mode === "modal") openInModal(id, title);
        else playInline(el, id, title);
      }, poster);
    });
  }

  window.YoutubePlayer = {
    parseId: parseYoutubeId,
    createIframe,
    thumbUrl,
    init: initYoutubePlayers,
  };

  document.addEventListener("DOMContentLoaded", () => {
    initYoutubePlayers();
  });
})();
