(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector("#site-nav");
  var label = toggle ? toggle.querySelector(".sr-only") : null;

  function setOpen(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (label) label.textContent = open ? "Close menu" : "Menu";
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("open"));
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setOpen(false);
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("open")) return;
      if (nav.contains(event.target) || toggle.contains(event.target)) return;
      setOpen(false);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 760px)").matches) setOpen(false);
    });
  }

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  if (!reduce) {
    document.body.classList.add("page-in");
    window.addEventListener("pageshow", function () {
      document.body.classList.remove("page-out");
    });

    var leaving = false;
    window.siteGo = function (href) {
      if (leaving) return;
      leaving = true;
      document.body.classList.add("page-out");
      window.setTimeout(function () {
        window.location.href = href;
      }, 240);
    };

    document.addEventListener("click", function (event) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      var link = event.target.closest("a");
      if (!link || !link.href) return;
      if (link.target && link.target !== "_self") return;
      if (link.hasAttribute("download")) return;
      var url;
      try {
        url = new URL(link.href, window.location.href);
      } catch (error) {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.protocol === "mailto:" || url.protocol === "tel:") return;
      if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return;
      event.preventDefault();
      window.siteGo(link.href);
    });
  } else {
    window.siteGo = function (href) {
      window.location.href = href;
    };
  }

  if (!reduce && finePointer && !coarsePointer) {
    var glow = document.createElement("div");
    glow.className = "cursor-glow";
    glow.setAttribute("aria-hidden", "true");
    document.body.appendChild(glow);
    document.addEventListener(
      "pointermove",
      function (event) {
        if (event.pointerType !== "mouse") {
          glow.classList.remove("on");
          return;
        }
        glow.classList.add("on");
        glow.style.transform =
          "translate(" + event.clientX + "px, " + event.clientY + "px) translate(-50%, -50%)";
      },
      { passive: true }
    );
    document.addEventListener("pointerout", function (event) {
      if (!event.relatedTarget && !event.toElement) glow.classList.remove("on");
    });
  }

  if (!reduce && document.documentElement.classList.contains("js")) {
    var nodes = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.12 }
      );
      nodes.forEach(function (node) {
        observer.observe(node);
      });
    } else {
      nodes.forEach(function (node) {
        node.classList.add("in");
      });
    }
  }

  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  var code = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];
  var pos = 0;

  document.addEventListener("keydown", function (event) {
    var key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (key === code[pos]) {
      pos += 1;
      if (pos === code.length) {
        pos = 0;
        grantExtraLife();
      }
      return;
    }
    pos = key === code[0] ? 1 : 0;
  });

  function grantExtraLife() {
    document.body.classList.add("extra-life");
    var toast = document.getElementById("toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast";
      toast.className = "toast";
      toast.setAttribute("role", "status");
      document.body.appendChild(toast);
    }
    toast.textContent = "konami code accepted — extra life";
    toast.hidden = false;
    window.clearTimeout(grantExtraLife.timer);
    grantExtraLife.timer = window.setTimeout(function () {
      toast.hidden = true;
      document.body.classList.remove("extra-life");
    }, 4200);
    document.dispatchEvent(new CustomEvent("konami"));
  }
})();
