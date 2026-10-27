(function () {
      "use strict";
      var body = document.body;
      var themeToggle = document.getElementById("themeToggle");
      var menuToggle = document.getElementById("menuToggle");
      var search = document.getElementById("docSearch");
      var nav = document.getElementById("docNav");
      var noResults = document.getElementById("noResults");
      var toast = document.getElementById("toast");
      var backTop = document.getElementById("backTop");
      var toastTimer;

      try {
        var savedTheme = localStorage.getItem("nexora-docs-theme");
        if (savedTheme === "dark") document.documentElement.setAttribute("data-theme", "dark");
      } catch (e) {}
      updateThemeButton();

      function updateThemeButton() {
        var dark = document.documentElement.getAttribute("data-theme") === "dark";
        themeToggle.textContent = dark ? "☼" : "◐";
        themeToggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
        themeToggle.title = dark ? "Switch to light theme" : "Switch to dark theme";
      }
      themeToggle.addEventListener("click", function () {
        var dark = document.documentElement.getAttribute("data-theme") === "dark";
        if (dark) document.documentElement.removeAttribute("data-theme");
        else document.documentElement.setAttribute("data-theme", "dark");
        try { localStorage.setItem("nexora-docs-theme", dark ? "light" : "dark"); } catch (e) {}
        updateThemeButton();
      });

      function closeMenu() {
        body.classList.remove("nav-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open documentation menu");
        menuToggle.textContent = "☰";
      }
      menuToggle.addEventListener("click", function () {
        var open = !body.classList.contains("nav-open");
        body.classList.toggle("nav-open", open);
        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.setAttribute("aria-label", open ? "Close documentation menu" : "Open documentation menu");
        menuToggle.textContent = open ? "×" : "☰";
      });
      nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          closeMenu();
          nav.querySelectorAll(".nav-link").forEach(function (item) { item.classList.remove("active"); });
          link.classList.add("active");
        });
      });
      document.addEventListener("click", function (event) {
        if (body.classList.contains("nav-open") && !event.target.closest("#sidebar") && !event.target.closest("#menuToggle")) closeMenu();
      });
      document.addEventListener("keydown", function (event) {
        var tag = event.target && event.target.tagName;
        if (event.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
          event.preventDefault();
          search.focus();
        }
        if (event.key === "Escape") {
          closeMenu();
          search.blur();
          search.value = "";
          filterNav("");
        }
      });

      function filterNav(query) {
        var q = query.toLowerCase().trim();
        var shown = 0;
        nav.querySelectorAll(".nav-group").forEach(function (group) {
          var links = group.querySelectorAll(".nav-link");
          var visible = 0;
          links.forEach(function (link) {
            var section = document.querySelector(link.getAttribute("href"));
            var text = (link.textContent + " " + (section ? (section.innerText || section.textContent) : "") + " " + (section ? section.getAttribute("data-search") : "")).toLowerCase();
            var matches = !q || text.indexOf(q) !== -1;
            link.closest("li").hidden = !matches;
            if (matches) { visible++; shown++; }
          });
          group.hidden = visible === 0;
        });
        noResults.style.display = shown === 0 ? "block" : "none";
      }
      search.addEventListener("input", function () { filterNav(search.value); });
      search.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          var first = nav.querySelector("li:not([hidden]) .nav-link");
          if (first) { first.click(); document.querySelector(first.getAttribute("href")).scrollIntoView({ behavior: "smooth" }); }
        }
      });

      function showToast(message) {
        toast.textContent = message;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2200);
      }
      function fallbackCopy(text) {
        var textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        var ok = false;
        try { ok = document.execCommand("copy"); } catch (e) {}
        textarea.remove();
        return ok;
      }
      document.querySelectorAll("[data-copy]").forEach(function (button) {
        button.addEventListener("click", function () {
          var value = button.getAttribute("data-copy").replace(/&#10;/g, "\n");
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(value).then(function () { showToast("Command copied to clipboard"); }, function () { showToast(fallbackCopy(value) ? "Command copied to clipboard" : "Copy unavailable — select the command manually"); });
          } else showToast(fallbackCopy(value) ? "Command copied to clipboard" : "Copy unavailable — select the command manually");
        });
      });
      var links = Array.prototype.slice.call(nav.querySelectorAll(".nav-link"));
      var sections = links.map(function (link) { return document.querySelector(link.getAttribute("href")); }).filter(Boolean);
      if ("IntersectionObserver" in window) {
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var id = "#" + entry.target.id;
            links.forEach(function (link) { link.classList.toggle("active", link.getAttribute("href") === id); });
          });
        }, { rootMargin: "-22% 0px -68% 0px" });
        sections.forEach(function (section) { observer.observe(section); });
      }
      window.addEventListener("scroll", function () { backTop.classList.toggle("visible", window.scrollY > 500); }, { passive: true });
      backTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
    }());
