(function () {
  var RETURN_KEY = "leadReturnUrl";

  function isThankYouPath(pathname) {
    return /thank-you/i.test(pathname || "");
  }

  function isSafeReturnUrl(url) {
    if (!url || typeof url !== "string") return false;
    try {
      var parsed = new URL(url, location.origin);
      if (parsed.origin !== location.origin) return false;
      if (isThankYouPath(parsed.pathname)) return false;
      return true;
    } catch (_) {
      return false;
    }
  }

  function resolveReturnUrl(params) {
    try {
      var stored = sessionStorage.getItem(RETURN_KEY);
      if (stored && isSafeReturnUrl(stored)) {
        sessionStorage.removeItem(RETURN_KEY);
        return stored;
      }
    } catch (_) {}

    var fromQuery = params.get("return") || "";
    if (fromQuery) {
      var candidate =
        fromQuery.charAt(0) === "/"
          ? location.origin + fromQuery
          : fromQuery;
      if (isSafeReturnUrl(candidate)) return candidate;
    }

    if (document.referrer && isSafeReturnUrl(document.referrer)) {
      return document.referrer;
    }

    return "";
  }

  var params = new URLSearchParams(location.search);
  var name = params.get("name") || "";
  var phone = params.get("phone") || "";
  var formId = params.get("form") || "";
  var source = params.get("source") || "";
  var returnUrl = resolveReturnUrl(params);

  var title = document.getElementById("thankYouTitle");
  var phoneEl = document.getElementById("thankYouPhone");
  var backBtn = document.getElementById("thankYouBack");

  if (name && title) title.textContent = name + ", спасибо!";
  if (phone && phoneEl) {
    phoneEl.textContent = phone;
    phoneEl.hidden = false;
  }

  if (backBtn) {
    if (returnUrl) {
      backBtn.href = returnUrl;
    } else if (window.history.length > 1) {
      backBtn.addEventListener("click", function (event) {
        event.preventDefault();
        window.history.back();
      });
    } else {
      backBtn.href = /\/uslugi\//.test(location.pathname)
        ? "../index.html"
        : "index.html";
    }
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "form_submit_success",
    pagePath: location.pathname,
    pageTitle: document.title,
    pageLocation: location.href,
    form_id: formId,
    form_source: source,
    return_url: returnUrl || document.referrer || "",
  });
})();
