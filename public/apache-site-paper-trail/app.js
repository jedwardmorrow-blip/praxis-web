/* Apache Business Systems — Paper Trail draft
   Shared behavior: reveals, tracking-line draw, header state,
   mobile nav, indicia date, form demo state, scroll progress. */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- header stuck state + scroll progress meter ---- */
  var header = document.querySelector(".site-header");
  var progress = document.querySelector(".meter-progress");
  function onScroll() {
    if (header) header.classList.toggle("is-stuck", window.scrollY > 8);
    if (progress) {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? window.scrollY / max : 0;
      progress.style.transform = "scaleX(" + p + ")";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- mobile nav ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    });
  }

  /* ---- reveal on scroll ---- */
  var revealables = document.querySelectorAll(".rv, .trail");
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
    );
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---- stagger children marked with data-stagger ---- */
  document.querySelectorAll("[data-stagger]").forEach(function (group) {
    var kids = group.querySelectorAll(".rv");
    kids.forEach(function (kid, i) {
      kid.style.setProperty("--rv-delay", i * 90 + "ms");
    });
  });

  /* ---- meter indicia: stamp today's date, postal style ---- */
  var dateEl = document.getElementById("indicia-date");
  if (dateEl) {
    var months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    var now = new Date();
    dateEl.textContent =
      months[now.getMonth()] + " " +
      String(now.getDate()).padStart(2, "0") + " " +
      now.getFullYear();
  }

  /* ---- operating loop board ---- */
  var STOPS = {
    send: {
      kicker: "Stop 01 · Send",
      title: "Mail leaves the building on time, at the right postage.",
      copy: "Postage meters, mailing systems, and folder/inserters sized to your real volume — with lease timing watched so renewals never sneak up on you.",
      chips: ["Postage meters", "Mailing systems", "Folder / inserters"],
      href: "mailing-systems.html",
      link: "See mailing & postage systems",
      rc: ["Meters & inserters", "Statement runs", "Lease renewals", "Same-day service"]
    },
    answer: {
      kicker: "Stop 02 · Answer",
      title: "Calls reach a person, not a dead extension.",
      copy: "Business phone systems installed and supported locally — call routing that matches how your office works, and a main line customers can even text.",
      chips: ["Business phones", "Call routing", "Text-enabled lines"],
      href: "phones.html",
      link: "See business phones",
      rc: ["Phone systems", "Routing & mobile", "Contract end dates", "Local install & training"]
    },
    track: {
      kicker: "Stop 03 · Track",
      title: "Statements and notices move with a record behind them.",
      copy: "Document workflows that verify addresses before anything prints, and log every piece that goes out — so “did it send?” takes seconds, not archaeology.",
      chips: ["Document automation", "Address quality", "Tracking solutions"],
      href: "documents.html",
      link: "See documents & delivery",
      rc: ["Print-to-mail", "Address verification", "Returned mail", "Delivery records"]
    },
    prove: {
      kicker: "Stop 04 · Prove",
      title: "Delivery proof you can retrieve years later.",
      copy: "e-Certify electronic certified mail with searchable proof of delivery — because the value of certified mail is the day someone claims they never got it.",
      chips: ["Certified mail", "e-Certify workflows", "Searchable archives"],
      href: "certified-proof.html",
      link: "See certified mail & proof",
      rc: ["e-Certify", "Proof retrieval", "Green-card drawers", "Reduced postage"]
    },
    deliver: {
      kicker: "Stop 05 · Deliver",
      title: "Packages land without burying the front office.",
      copy: "Smart parcel lockers and shipping kiosks that turn package chaos into a self-serve handoff — with a notification and a record for every pickup.",
      chips: ["Parcel lockers", "Shipping kiosks", "Package handoff"],
      href: "parcel-lockers.html",
      link: "See parcel lockers",
      rc: ["Smart lockers", "Resident notify", "Front-office hours", "Pickup records"]
    },
    support: {
      kicker: "Stop 06 · Support",
      title: "A local tech shows up. Supplies arrive before you run out.",
      copy: "Service calls answered by the same Tucson team every time, preventive maintenance before the jam, and supplies ordering that beats statement day.",
      chips: ["Service calls", "Maintenance", "Supplies ordering"],
      href: "service-supplies.html",
      link: "See service & supplies",
      rc: ["Local techs", "Preventive visits", "Supply reorders", "Repair vs replace"]
    }
  };

  var board = document.getElementById("loop-board");
  if (board) {
    var tabs = board.querySelectorAll(".board-tab");
    var els = {
      kicker: document.getElementById("bd-kicker"),
      title: document.getElementById("bd-title"),
      copy: document.getElementById("bd-copy"),
      chips: document.getElementById("bd-chips"),
      link: document.getElementById("bd-link"),
      rc: [1, 2, 3, 4].map(function (i) { return document.getElementById("rc-" + i); })
    };
    var switching = false;
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        if (switching || tab.getAttribute("aria-selected") === "true") return;
        var stop = STOPS[tab.getAttribute("data-stop")];
        if (!stop) return;
        switching = true;
        tabs.forEach(function (t) {
          var active = t === tab;
          t.setAttribute("aria-selected", active ? "true" : "false");
          if (active) { t.removeAttribute("tabindex"); } else { t.setAttribute("tabindex", "-1"); }
        });
        var panel = document.getElementById("bd-panel");
        if (panel && tab.id) panel.setAttribute("aria-labelledby", tab.id);
        board.classList.add("is-switching");
        setTimeout(function () {
          els.kicker.textContent = stop.kicker;
          els.title.textContent = stop.title;
          els.copy.textContent = stop.copy;
          els.chips.innerHTML = stop.chips.map(function (c) { return '<span class="chip">' + c + "</span>"; }).join("");
          els.link.href = stop.href;
          els.link.innerHTML = stop.link + ' <span class="arr">→</span>';
          els.rc.forEach(function (el, i) { if (el) el.textContent = stop.rc[i]; });
          board.classList.remove("is-switching");
          switching = false;
        }, reduced ? 0 : 260);
      });
    });
  }

  /* ---- collage parallax (subtle, hero only) ---- */
  var collage = document.querySelector(".collage");
  if (collage && !reduced) {
    var layers = [
      [collage.querySelector(".piece--photo"), 0.02],
      [collage.querySelector(".piece--envelope"), 0.05],
      [collage.querySelector(".piece--ticket"), 0.09],
      [collage.querySelector(".piece--receipt"), 0.13],
      [collage.querySelector(".stamp-round"), 0.17]
    ].filter(function (l) { return l[0]; });
    var raf = null;
    function parallax() {
      raf = null;
      var y = window.scrollY;
      if (y > window.innerHeight * 1.3) return;
      layers.forEach(function (l) {
        l[0].style.setProperty("--py", (y * l[1]).toFixed(1) + "px");
      });
    }
    window.addEventListener("scroll", function () {
      if (!raf) raf = requestAnimationFrame(parallax);
    }, { passive: true });
  }

  /* ---- auto photo swap ----
     Drop real photos into assets/photos/ named after each slot id
     (e.g. assets/photos/slot-01-team.jpg) and every matching
     placeholder on the site replaces itself automatically.
     See photo-guide.html for the full shot list. */
  document.querySelectorAll("[data-photo]").forEach(function (slot) {
    var id = slot.getAttribute("data-photo");
    var img = new Image();
    img.onload = function () {
      slot.style.backgroundImage = "url('assets/photos/" + id + ".jpg')";
      slot.classList.add("has-photo");
      var pending = slot.querySelector(".chip");
      if (pending) pending.textContent = pending.textContent.replace(/pending/i, "on file");
    };
    img.src = "assets/photos/" + id + ".jpg";
  });

  /* ---- board keyboard navigation (arrow keys across stops) ---- */
  var boardTabs = document.querySelectorAll("#loop-board .board-tab");
  boardTabs.forEach(function (tab, i) {
    tab.addEventListener("keydown", function (ev) {
      var next = null;
      if (ev.key === "ArrowRight" || ev.key === "ArrowDown") next = boardTabs[(i + 1) % boardTabs.length];
      if (ev.key === "ArrowLeft" || ev.key === "ArrowUp") next = boardTabs[(i - 1 + boardTabs.length) % boardTabs.length];
      if (next) { ev.preventDefault(); next.focus(); next.click(); }
    });
  });

  /* ---- demo form: front-end draft only, no backend wired ---- */
  document.querySelectorAll("form[data-demo]").forEach(function (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var shell = form.closest(".cta-form");
      if (shell) shell.classList.add("is-done");
    });
  });

  /* ---- stat counters (default to final value; animate as enhancement) ---- */
  var counters = document.querySelectorAll("[data-count]");
  counters.forEach(function (el) {
    var raw = el.getAttribute("data-count");
    el.textContent = raw;
  });
  if (counters.length && "IntersectionObserver" in window && !reduced) {
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          cio.unobserve(e.target);
          var el = e.target;
          var target = parseFloat(el.getAttribute("data-count"));
          var decimals = (el.getAttribute("data-count").split(".")[1] || "").length;
          var start = null;
          var durMs = 1100;
          function step(ts) {
            if (!start) start = ts;
            var t = Math.min((ts - start) / durMs, 1);
            var eased = 1 - Math.pow(1 - t, 3);
            el.textContent = (target * eased).toFixed(decimals);
            if (t < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) { cio.observe(el); });
  }
})();
