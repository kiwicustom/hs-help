(() => {
  const I18N = window.AH_HELP_I18N;
  if (!I18N) return;

  const STORAGE_KEY = "ah.help.lang";
  const htmlLang = { de: "de", en: "en", fi: "fi", fr: "fr", it: "it", gsw: "gsw" };

  function detectLang() {
    try {
      const params = new URLSearchParams(location.search);
      const fromQuery = params.get("lang");
      if (fromQuery && I18N.strings[fromQuery]) return fromQuery;
    } catch {
      /* ignore */
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && I18N.strings[saved]) return saved;
    } catch {
      /* ignore */
    }
    const nav = (navigator.languages || [navigator.language || ""]).map((l) =>
      String(l).toLowerCase()
    );
    for (const l of nav) {
      if (l.startsWith("de-ch") || l === "gsw") return "gsw";
      if (l.startsWith("de")) return "de";
      if (l.startsWith("en")) return "en";
      if (l.startsWith("fi")) return "fi";
      if (l.startsWith("fr")) return "fr";
      if (l.startsWith("it")) return "it";
    }
    return I18N.defaultLang;
  }

  function t(lang, key) {
    return I18N.strings[lang]?.[key] ?? I18N.strings[I18N.defaultLang]?.[key] ?? key;
  }

  function setMeta(name, content, attr = "name") {
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  function stampLangLinks(lang) {
    document.querySelectorAll("a[href]").forEach((a) => {
      const raw = a.getAttribute("href");
      if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("tel:")) {
        return;
      }
      let url;
      try {
        url = new URL(raw, location.href);
      } catch {
        return;
      }
      const sameHelp =
        url.origin === location.origin || url.hostname === "help.alles-hockey.ch";
      if (!sameHelp) return;
      if (url.searchParams.get("lang") === lang) return;
      url.searchParams.set("lang", lang);
      const next =
        url.origin === location.origin
          ? `${url.pathname}${url.search}${url.hash}`
          : url.toString();
      a.setAttribute("href", next);
    });
  }

  function apply(lang) {
    const dict = I18N.strings[lang] || I18N.strings[I18N.defaultLang];
    document.documentElement.lang = htmlLang[lang] || lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key || dict[key] == null) return;
      el.textContent = dict[key];
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (!key || dict[key] == null) return;
      el.innerHTML = dict[key];
    });

    const page = document.body.getAttribute("data-page");
    if (page) {
      document.title = t(lang, `${page}.meta.title`);
      setMeta("description", t(lang, `${page}.meta.description`));
    }

    document.querySelectorAll("[data-lang]").forEach((btn) => {
      const on = btn.getAttribute("data-lang") === lang;
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.classList.toggle("is-active", on);
    });

    stampLangLinks(lang);

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }

    try {
      const url = new URL(location.href);
      if (url.searchParams.get("lang") !== lang) {
        url.searchParams.set("lang", lang);
        history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
      }
    } catch {
      /* ignore */
    }
  }

  function buildSwitcher(current) {
    const wrap = document.getElementById("lang-switch");
    if (!wrap) return;
    wrap.innerHTML = "";
    const label = document.createElement("span");
    label.className = "lang-switch__label";
    label.setAttribute("data-i18n", "lang.label");
    label.textContent = t(current, "lang.label");
    wrap.appendChild(label);

    const group = document.createElement("div");
    group.className = "lang-switch__group";
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", t(current, "lang.label"));

    I18N.langs.forEach(({ code, label: name }) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "lang-switch__btn";
      btn.setAttribute("data-lang", code);
      btn.textContent = name;
      btn.addEventListener("click", () => apply(code));
      group.appendChild(btn);
    });
    wrap.appendChild(group);
  }

  const lang = detectLang();
  buildSwitcher(lang);
  apply(lang);
})();
