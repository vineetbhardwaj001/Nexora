(function () {
  "use strict";

  var body = document.body;
  var landingMode = body.classList.contains("landing-site");
  var themeToggle = document.getElementById("themeToggle");
  var menuToggle = document.getElementById("menuToggle");
  var sidebar = document.getElementById("sidebar");
  var search = document.getElementById("docSearch");
  var nav = document.getElementById("docNav");
  var noResults = document.getElementById("noResults");
  var toast = document.getElementById("toast");
  var backTop = document.getElementById("backTop");
  var scrim = document.getElementById("lpScrim");
  var toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("show");
    }, 2200);
  }

  function getTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function updateThemeButton() {
    if (!themeToggle) return;
    var dark = getTheme() === "dark";
    themeToggle.textContent = dark ? "☼" : "◐";
    themeToggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    themeToggle.title = dark ? "Switch to light theme" : "Switch to dark theme";
  }

  try {
    if (window.localStorage.getItem("nexora-docs-theme") === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  } catch (error) {
    // Storage can be unavailable in private or restricted browsing contexts.
  }
  updateThemeButton();

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var nextTheme = getTheme() === "dark" ? "light" : "dark";
      if (nextTheme === "dark") document.documentElement.setAttribute("data-theme", "dark");
      else document.documentElement.removeAttribute("data-theme");
      try {
        window.localStorage.setItem("nexora-docs-theme", nextTheme);
      } catch (error) {
        // The theme still works for the current page when storage is unavailable.
      }
      updateThemeButton();
    });
  }

  function closeMenu() {
    if (landingMode) {
      body.classList.remove("lp-menu-open");
      if (scrim) scrim.hidden = true;
      if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        menuToggle.textContent = "☰";
      }
      return;
    }
    body.classList.remove("nav-open");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open documentation menu");
      menuToggle.textContent = "☰";
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      var open;
      if (landingMode) {
        open = !body.classList.contains("lp-menu-open");
        body.classList.toggle("lp-menu-open", open);
        if (scrim) scrim.hidden = !open;
        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
        menuToggle.textContent = open ? "×" : "☰";
      } else {
        open = !body.classList.contains("nav-open");
        body.classList.toggle("nav-open", open);
        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.setAttribute("aria-label", open ? "Close documentation menu" : "Open documentation menu");
        menuToggle.textContent = open ? "×" : "☰";
      }
    });
  }

  if (scrim) scrim.addEventListener("click", closeMenu);

  if (nav) {
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        var href = link.getAttribute("href") || "";
        if (href.charAt(0) === "#" && document.querySelector(href)) {
          closeMenu();
          nav.querySelectorAll(".nav-link").forEach(function (item) {
            item.classList.toggle("active", item === link);
          });
        }
      });
    });
  }

  document.addEventListener("click", function (event) {
    if (landingMode && body.classList.contains("lp-menu-open") &&
        nav && !event.target.closest("#docNav") &&
        !event.target.closest("#menuToggle")) {
      closeMenu();
    }
    if (!landingMode && body.classList.contains("nav-open") &&
        !event.target.closest("#sidebar") && !event.target.closest("#menuToggle")) {
      closeMenu();
    }
  });

  function filterNav(query) {
    if (!nav || !noResults) return;
    var q = query.toLowerCase().trim();
    var shown = 0;
    var groups = nav.querySelectorAll(".nav-group");
    if (!groups.length) return;
    groups.forEach(function (group) {
      var visible = 0;
      group.querySelectorAll(".nav-link").forEach(function (link) {
        var href = link.getAttribute("href");
        var section = href && href.charAt(0) === "#" ? document.querySelector(href) : null;
        var sectionText = section ? (section.innerText || section.textContent || "") : "";
        var searchable = (link.textContent + " " + sectionText + " " +
          (section ? section.getAttribute("data-search") || "" : "")).toLowerCase();
        var matches = !q || searchable.indexOf(q) !== -1;
        var item = link.closest("li");
        if (item) item.hidden = !matches;
        if (matches) { visible++; shown++; }
      });
      group.hidden = visible === 0;
    });
    noResults.hidden = shown !== 0;
    noResults.style.display = shown === 0 ? "block" : "none";
  }

  if (search && !search.classList.contains("lp-hidden-search")) {
    search.addEventListener("input", function () { filterNav(search.value); });
    search.addEventListener("keydown", function (event) {
      if (event.key !== "Enter" || !nav) return;
      var first = nav.querySelector("li:not([hidden]) .nav-link");
      if (first) {
        var target = document.querySelector(first.getAttribute("href"));
        if (target) {
          first.click();
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    var tag = event.target && event.target.tagName;
    var searchIsVisible = search && !search.classList.contains("lp-hidden-search");
    if (event.key === "/" && searchIsVisible && tag !== "INPUT" && tag !== "TEXTAREA") {
      event.preventDefault();
      search.focus();
    }
    if (event.key === "Escape") {
      closeMenu();
      if (search && !search.classList.contains("lp-hidden-search")) {
        search.blur();
        search.value = "";
        filterNav("");
      }
    }
  });

  function fallbackCopy(text) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (error) {}
    textarea.remove();
    return ok;
  }

  document.querySelectorAll("[data-copy]").forEach(function (button) {
    button.addEventListener("click", function () {
      var value = button.getAttribute("data-copy").replace(/&#10;/g, "\n");
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(function () {
          showToast("Commands copied to clipboard");
        }, function () {
          showToast(fallbackCopy(value) ? "Commands copied to clipboard" : "Copy unavailable — select the commands manually");
        });
      } else {
        showToast(fallbackCopy(value) ? "Commands copied to clipboard" : "Copy unavailable — select the commands manually");
      }
    });
  });

  if (nav) {
    var links = Array.prototype.slice.call(nav.querySelectorAll(".nav-link"));
    var sections = links.map(function (link) {
      var href = link.getAttribute("href");
      return href && href.charAt(0) === "#" ? document.querySelector(href) : null;
    }).filter(Boolean);
    if ("IntersectionObserver" in window && sections.length) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = "#" + entry.target.id;
          links.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === id);
          });
        });
      }, { rootMargin: "-22% 0px -68% 0px" });
      sections.forEach(function (section) { observer.observe(section); });
    }
  }

  if (backTop) {
    window.addEventListener("scroll", function () {
      backTop.classList.toggle("visible", window.scrollY > 500);
    }, { passive: true });
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}());
