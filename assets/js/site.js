/* ==========================================================================
   BUG PRODUCTION — site.js (v2)
   Dil, header, mobil menü, reveal, geri sayım, sekmeler, fragman oynatıcı,
   kamera saati, lightbox, kopyala düğmeleri
   ========================================================================== */
(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- 1. DİL ---------- */
  var LANG_KEY = "bp-lang";
  function currentLang() { return document.documentElement.getAttribute("data-site-lang") === "en" ? "en" : "tr"; }

  function setLang(lang) {
    var l = lang === "en" ? "en" : "tr";
    var root = document.documentElement;
    root.setAttribute("data-site-lang", l);
    root.setAttribute("lang", l);
    try { localStorage.setItem(LANG_KEY, l); } catch (e) {}
    $$("[data-lang-btn]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang-btn") === l));
    });
    var t = $('meta[name="title-' + l + '"]');
    if (t) document.title = t.content;
    var d = $('meta[name="desc-' + l + '"]');
    var md = $('meta[name="description"]');
    if (d && md) md.content = d.content;
    osdTick();
  }
  $$("[data-lang-btn]").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang-btn")); });
  });

  /* ---------- 2. HEADER ---------- */
  var hdr = $(".hdr");
  function onScroll() { if (hdr) hdr.classList.toggle("is-stuck", window.scrollY > 24); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- 3. MOBİL MENÜ ---------- */
  var burger = $(".burger");
  var mnav = $(".mnav");
  function closeNav() {
    if (!burger || !mnav) return;
    burger.classList.remove("on");
    mnav.classList.remove("on");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (burger && mnav) {
    burger.addEventListener("click", function () {
      var open = !mnav.classList.contains("on");
      burger.classList.toggle("on", open);
      mnav.classList.toggle("on", open);
      burger.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    $$("a", mnav).forEach(function (a) { a.addEventListener("click", closeNav); });
  }

  /* ---------- 4. REVEAL ---------- */
  var items = $$(".rv");
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("on"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("on"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 5. GERİ SAYIM ---------- */
  // Dead Margin — 18 Eylül 2026 (Türkiye saati)
  var TARGET = new Date("2026-09-18T00:00:00+03:00").getTime();
  var clocks = $$("[data-countdown]");
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function tick() {
    var diff = TARGET - Date.now();
    var out = diff <= 0;
    clocks.forEach(function (c) {
      $$("[data-released]", c).forEach(function (el) { el.hidden = !out; });
      $$("[data-pending]", c).forEach(function (el) { el.hidden = out; });
      if (out) return;
      var s = Math.floor(diff / 1000);
      var set = function (k, v) { var el = $('[data-unit="' + k + '"]', c); if (el) el.textContent = v; };
      set("d", pad(Math.floor(s / 86400)));
      set("h", pad(Math.floor(s / 3600) % 24));
      set("m", pad(Math.floor(s / 60) % 60));
      set("s", pad(s % 60));
    });
  }
  if (clocks.length) { tick(); setInterval(tick, 1000); }

  /* ---------- 6. KAMERA SAATİ (OSD) ---------- */
  var MONTHS = {
    tr: ["OCA", "ŞUB", "MAR", "NİS", "MAY", "HAZ", "TEM", "AĞU", "EYL", "EKİ", "KAS", "ARA"],
    en: ["JAN.", "FEB.", "MAR.", "APR.", "MAY", "JUN.", "JUL.", "AUG.", "SEP.", "OCT.", "NOV.", "DEC."]
  };
  function osdTick() {
    var now = new Date();
    var l = currentLang();
    $$("[data-osd-time]").forEach(function (el) {
      el.textContent = pad(now.getHours()) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds());
    });
    $$("[data-osd-date]").forEach(function (el) {
      el.textContent = pad(now.getDate()) + " " + MONTHS[l][now.getMonth()] + " " + now.getFullYear();
    });
  }
  if ($("[data-osd-time],[data-osd-date]")) { setInterval(osdTick, 1000); }

  /* ---------- 7. SEKMELER ---------- */
  // <div data-tabs> içindeki [role=tab] düğmeleri aria-controls ile panele bağlı
  $$("[data-tabs]").forEach(function (group) {
    var tabs = $$('[role="tab"]', group);
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        var p = document.getElementById(t.getAttribute("aria-controls"));
        if (p) { p.classList.toggle("on", on); p.hidden = false; }
      });
      if (focus) tab.focus();
      group.dispatchEvent(new CustomEvent("tabchange", { detail: tab }));
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        var k = e.key, n = null;
        if (k === "ArrowRight" || k === "ArrowDown") n = tabs[(i + 1) % tabs.length];
        if (k === "ArrowLeft" || k === "ArrowUp") n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (k === "Home") n = tabs[0];
        if (k === "End") n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
  });

  /* ---------- 8. FRAGMAN OYNATICI ---------- */
  // Steam fragmanları HLS olarak yayınlanıyor; Safari yerel oynatır, diğerleri için hls.js yüklenir.
  var HLS_SRC = "https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js";
  var hlsLoading = null;
  function loadHls() {
    if (window.Hls) return Promise.resolve(window.Hls);
    if (hlsLoading) return hlsLoading;
    hlsLoading = new Promise(function (res, rej) {
      var s = document.createElement("script");
      s.src = HLS_SRC; s.async = true;
      s.onload = function () { res(window.Hls); };
      s.onerror = rej;
      document.head.appendChild(s);
    });
    return hlsLoading;
  }

  $$("[data-cam]").forEach(function (cam) {
    var video = $("video", cam);
    var start = $(".cam-start", cam);
    var poster = $(".cam-poster", cam);
    var fallback = cam.getAttribute("data-fallback");
    var hls = null;

    function stop() {
      if (hls) { hls.destroy(); hls = null; }
      video.pause();
      video.removeAttribute("src");
      video.load();
      cam.classList.remove("is-playing");
    }
    function fail() {
      stop();
      if (fallback) window.open(fallback, "_blank", "noopener");
    }
    function play() {
      var src = cam.getAttribute("data-src");
      if (!src) return fail();
      cam.classList.add("is-playing");
      video.controls = true;
      var canNative = !!video.canPlayType("application/vnd.apple.mpegurl");
      function native() {
        video.src = src;
        video.play().catch(function () {});
      }
      // MSE varsa hls.js (Chrome/Edge/Firefox); yoksa yerel HLS (iOS Safari)
      if (!(window.MediaSource || window.ManagedMediaSource)) return canNative ? native() : fail();
      loadHls().then(function (Hls) {
        if (!Hls || !Hls.isSupported()) return canNative ? native() : fail();
        hls = new Hls({ capLevelToPlayerSize: true });
        hls.on(Hls.Events.ERROR, function (_, data) { if (data && data.fatal) fail(); });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () { video.play().catch(function () {}); });
      }).catch(function () { return canNative ? native() : fail(); });
    }
    if (start) start.addEventListener("click", play);

    // fragman seçici
    var sel = cam.getAttribute("data-selector");
    var group = sel && document.getElementById(sel);
    if (group) {
      $$("[data-trailer]", group).forEach(function (btn) {
        btn.addEventListener("click", function () {
          $$("[data-trailer]", group).forEach(function (b) { b.setAttribute("aria-selected", String(b === btn)); });
          stop();
          cam.setAttribute("data-src", btn.getAttribute("data-trailer"));
          if (poster && btn.getAttribute("data-poster")) {
            poster.src = btn.getAttribute("data-poster");
            poster.classList.toggle("crop-osd", btn.hasAttribute("data-crop"));
          }
          var lbl = $("[data-cam-label]", cam);
          if (lbl) lbl.textContent = btn.getAttribute("data-label") || "";
          play();
        });
      });
    }
  });

  /* ---------- 9. LIGHTBOX ---------- */
  var lb = $(".lightbox");
  if (lb) {
    var lbImg = $("img", lb);
    var lastFocus = null;
    $$("[data-shot]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var img = $("img", btn);
        if (!img) return;
        lastFocus = btn;
        lbImg.src = img.getAttribute("data-full") || img.src;
        lbImg.alt = img.alt;
        lb.classList.add("on");
        document.body.style.overflow = "hidden";
        $(".close", lb).focus();
      });
    });
    var closeLb = function () {
      lb.classList.remove("on");
      lbImg.removeAttribute("src");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    };
    lb.addEventListener("click", closeLb);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lb.classList.contains("on")) closeLb();
    });
  }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });

  /* ---------- 10. KOPYALA ---------- */
  $$("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var box = btn.closest(".boiler");
      var src = box && $('[data-lang="' + currentLang() + '"]', box.querySelector("p"));
      var text = (src || (box && box.querySelector("p")) || {}).textContent || "";
      text = text.replace(/\s+/g, " ").trim();
      var done = function () {
        btn.classList.add("done");
        setTimeout(function () { btn.classList.remove("done"); }, 1600);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () {});
      } else {
        var ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); done(); } catch (e) {}
        ta.remove();
      }
    });
  });

  /* ---------- 11. YIL ---------- */
  $$("[data-year]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  setLang(currentLang());
})();
