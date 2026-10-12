(function () {
  var grid = document.getElementById("project-grid");
  var dialog = document.getElementById("project-detail");
  if (!grid) return;

  var projects = window.PROJECTS || [];
  var shotIndex = 0;
  var openProject = null;
  var startX = 0;

  var titleNode = dialog ? dialog.querySelector(".detail-title") : null;
  var shotNode = dialog ? dialog.querySelector(".detail-shot") : null;
  var countNode = dialog ? dialog.querySelector(".detail-count") : null;
  var mediaNode = dialog ? dialog.querySelector(".detail-media") : null;
  var prevBtn = dialog ? dialog.querySelector("[data-dir='-1']") : null;
  var nextBtn = dialog ? dialog.querySelector("[data-dir='1']") : null;

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function shotsFor(project) {
    return (project.screenshots || []).slice(0, 3).filter(function (shot) {
      return shot && shot.src;
    });
  }

  var storeFor = {
    iOS: { label: "App Store", key: "ios" },
    Android: { label: "Google Play", key: "android" },
  };

  if (!projects.length) {
    grid.innerHTML = '<p class="empty">No projects yet.</p>';
    return;
  }

  grid.innerHTML = projects
    .map(function (project, index) {
      var badges = (project.platforms || [])
        .map(function (platform) {
          return "<li>" + escapeHtml(platform) + "</li>";
        })
        .join("");

      var stores = (project.platforms || [])
        .map(function (platform) {
          var meta = storeFor[platform];
          if (!meta) return "";
          var url = project.stores && project.stores[meta.key];
          if (url) {
            return (
              '<a class="store" href="' +
              escapeHtml(url) +
              '" target="_blank" rel="noopener noreferrer">' +
              escapeHtml(meta.label) +
              "</a>"
            );
          }
          return (
            '<span class="store"><span>' +
            escapeHtml(meta.label) +
            '</span> <span class="soon">Coming soon</span></span>'
          );
        })
        .join("");

      var privacy = "/projects/" + encodeURIComponent(project.slug) + "/privacy.html";
      var shots = shotsFor(project);
      var first = shots[0];
      var carousel = "";
      if (first) {
        carousel =
          '<div class="carousel" data-project="' +
          index +
          '">' +
          '<div class="carousel-frame">' +
          '<button type="button" class="carousel-open" aria-label="Open screenshot 1 of ' +
          shots.length +
          ": " +
          escapeHtml(first.alt || project.name) +
          '">' +
          '<img src="' +
          escapeHtml(first.src) +
          '" alt="' +
          escapeHtml(first.alt || "") +
          '" width="' +
          Number(first.width) +
          '" height="' +
          Number(first.height) +
          '" loading="lazy" decoding="async">' +
          "</button></div>" +
          (shots.length > 1
            ? '<div class="carousel-nav">' +
              '<button type="button" data-dir="-1">Previous</button>' +
              '<p class="carousel-count" aria-live="polite">1 / ' +
              shots.length +
              "</p>" +
              '<button type="button" data-dir="1">Next</button>' +
              "</div>"
            : "") +
          "</div>";
      }

      var clip = "";
      if (project.media && project.media.src) {
        clip =
          '<button type="button" class="clip-btn" data-clip="' +
          index +
          '">Watch clip</button>';
      }

      return (
        '<article class="project-card">' +
        '<div class="project-top">' +
        '<img class="project-icon" src="' +
        escapeHtml(project.icon) +
        '" alt="" width="72" height="72" decoding="async">' +
        "<div>" +
        "<h2>" +
        escapeHtml(project.name) +
        "</h2>" +
        '<ul class="badges" aria-label="Platforms">' +
        badges +
        "</ul>" +
        "</div>" +
        "</div>" +
        "<p>" +
        escapeHtml(project.description) +
        "</p>" +
        carousel +
        clip +
        '<div class="stores">' +
        stores +
        "</div>" +
        '<a class="privacy-link" href="' +
        privacy +
        '">Privacy Policy</a>' +
        "</article>"
      );
    })
    .join("");

  function showCardShot(carousel, nextIndex) {
    var project = projects[Number(carousel.getAttribute("data-project"))];
    var shots = shotsFor(project);
    if (!shots.length) return;
    var current = carousel._index || 0;
    current = (nextIndex + shots.length) % shots.length;
    carousel._index = current;
    var shot = shots[current];
    var img = carousel.querySelector("img");
    var open = carousel.querySelector(".carousel-open");
    var count = carousel.querySelector(".carousel-count");
    img.src = shot.src;
    img.alt = shot.alt || "";
    img.width = Number(shot.width);
    img.height = Number(shot.height);
    if (open) {
      open.setAttribute(
        "aria-label",
        "Open screenshot " + (current + 1) + " of " + shots.length + ": " + (shot.alt || project.name)
      );
    }
    if (count) count.textContent = current + 1 + " / " + shots.length;
  }

  function clearMedia() {
    if (!mediaNode) return;
    var video = mediaNode.querySelector("video");
    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
    mediaNode.replaceChildren();
  }

  function renderMedia(project) {
    clearMedia();
    var media = project.media;
    if (!media || !media.src || !mediaNode) return;
    var label = document.createElement("p");
    label.textContent = "clip";
    mediaNode.appendChild(label);
    if (media.kind === "video") {
      var video = document.createElement("video");
      video.controls = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.width = Number(media.width) || 360;
      video.height = Number(media.height) || 640;
      if (media.poster) video.poster = media.poster;
      if (media.alt) video.setAttribute("aria-label", media.alt);
      var source = document.createElement("source");
      source.src = media.src;
      if (/\.webm($|\?)/i.test(media.src)) source.type = "video/webm";
      else if (/\.mp4($|\?)/i.test(media.src)) source.type = "video/mp4";
      video.appendChild(source);
      mediaNode.appendChild(video);
      return;
    }
    var gif = document.createElement("img");
    gif.src = media.src;
    gif.alt = media.alt || project.name + " clip";
    gif.width = Number(media.width) || 360;
    gif.height = Number(media.height) || 640;
    gif.decoding = "async";
    mediaNode.appendChild(gif);
  }

  function showDetail(project, index) {
    if (!dialog || !shotNode) return;
    var projectChanged = openProject !== project || !dialog.open;
    openProject = project;
    var shots = shotsFor(project);
    titleNode.textContent = project.name;
    if (!shots.length) {
      shotNode.hidden = true;
      shotNode.removeAttribute("src");
      shotNode.alt = "";
      if (countNode) countNode.textContent = "";
      if (prevBtn) prevBtn.hidden = true;
      if (nextBtn) nextBtn.hidden = true;
    } else {
      shotIndex = (index + shots.length) % shots.length;
      var shot = shots[shotIndex];
      shotNode.hidden = false;
      shotNode.src = shot.src;
      shotNode.alt = shot.alt || "";
      shotNode.width = Number(shot.width);
      shotNode.height = Number(shot.height);
      if (countNode) {
        countNode.textContent = "Screenshot " + (shotIndex + 1) + " of " + shots.length;
      }
      var single = shots.length < 2;
      if (prevBtn) prevBtn.hidden = single;
      if (nextBtn) nextBtn.hidden = single;
    }
    if (projectChanged) renderMedia(project);
    if (!dialog.open) dialog.showModal();
  }

  grid.addEventListener("click", function (event) {
    var clip = event.target.closest(".clip-btn");
    if (clip) {
      showDetail(projects[Number(clip.getAttribute("data-clip"))], 0);
      return;
    }
    var carousel = event.target.closest(".carousel");
    if (!carousel) return;
    var dirButton = event.target.closest("[data-dir]");
    if (dirButton) {
      var dir = Number(dirButton.getAttribute("data-dir"));
      showCardShot(carousel, (carousel._index || 0) + dir);
      return;
    }
    if (event.target.closest(".carousel-open")) {
      showDetail(projects[Number(carousel.getAttribute("data-project"))], carousel._index || 0);
    }
  });

  if (dialog) {
    prevBtn.addEventListener("click", function () {
      if (!openProject) return;
      showDetail(openProject, shotIndex - 1);
    });
    nextBtn.addEventListener("click", function () {
      if (!openProject) return;
      showDetail(openProject, shotIndex + 1);
    });
    dialog.querySelector("[data-close]").addEventListener("click", function () {
      dialog.close();
    });
    dialog.addEventListener("close", clearMedia);
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("keydown", function (event) {
      if (!openProject) return;
      if (event.target.closest("video, input, textarea")) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        showDetail(openProject, shotIndex + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        showDetail(openProject, shotIndex - 1);
      }
    });
    var panel = dialog.querySelector(".detail-panel");
    panel.addEventListener(
      "touchstart",
      function (event) {
        startX = event.changedTouches[0].clientX;
      },
      { passive: true }
    );
    panel.addEventListener(
      "touchend",
      function (event) {
        if (!openProject || shotsFor(openProject).length < 2) return;
        var dx = event.changedTouches[0].clientX - startX;
        if (Math.abs(dx) < 40) return;
        showDetail(openProject, shotIndex + (dx < 0 ? 1 : -1));
      },
      { passive: true }
    );
  }
})();
