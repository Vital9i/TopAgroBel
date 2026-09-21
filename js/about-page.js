(() => {
  const tabs = document.querySelectorAll("[data-team-tab]");
  const panels = document.querySelectorAll("[data-team-panel]");
  if (!tabs.length || !panels.length) return;

  const activate = (id) => {
    tabs.forEach((tab) => {
      const on = tab.getAttribute("data-team-tab") === id;
      tab.classList.toggle("is-active", on);
      tab.setAttribute("aria-selected", on ? "true" : "false");
    });
    panels.forEach((panel) => {
      const on = panel.getAttribute("data-team-panel") === id;
      panel.classList.toggle("is-active", on);
      panel.hidden = !on;
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activate(tab.getAttribute("data-team-tab"));
    });
  });
})();
