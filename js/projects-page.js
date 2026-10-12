(function () {
  var grid = document.getElementById("project-grid");
  if (!grid) return;

  var projects = window.PROJECTS || [];

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
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
    .map(function (project) {
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

      return (
        '<article class="project-card">' +
        '<div class="project-top">' +
        '<img class="project-icon" src="' +
        escapeHtml(project.icon) +
        '" alt="" width="72" height="72">' +
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
})();
