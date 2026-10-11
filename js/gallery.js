(function () {
  var gallery = document.getElementById("gallery");
  var empty = document.getElementById("gallery-empty");
  var dialog = document.getElementById("lightbox");
  if (!gallery || !dialog) return;

  var photos = window.PHOTOS || [];
  var index = 0;
  var image = dialog.querySelector(".lightbox-photo");
  var caption = dialog.querySelector(".lightbox-caption");
  var status = dialog.querySelector(".lightbox-status");
  var prev = dialog.querySelector("[data-dir='-1']");
  var next = dialog.querySelector("[data-dir='1']");
  var startX = 0;

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  if (!photos.length) {
    if (empty) empty.hidden = false;
    return;
  }

  gallery.innerHTML = photos
    .map(function (photo, i) {
      var captionHtml = photo.caption
        ? "<figcaption>" + escapeHtml(photo.caption) + "</figcaption>"
        : "";
      return (
        "<figure class='shot'>" +
        "<button type='button' data-index='" +
        i +
        "' aria-label='Open photo: " +
        escapeHtml(photo.alt) +
        "'>" +
        "<img src='" +
        escapeHtml(photo.src) +
        "' alt='' width='" +
        Number(photo.width) +
        "' height='" +
        Number(photo.height) +
        "' loading='lazy' decoding='async'>" +
        "</button>" +
        captionHtml +
        "</figure>"
      );
    })
    .join("");

  function show(nextIndex) {
    index = (nextIndex + photos.length) % photos.length;
    var photo = photos[index];
    image.src = photo.src;
    image.alt = photo.alt;
    image.width = photo.width;
    image.height = photo.height;
    caption.textContent = photo.caption || "";
    caption.hidden = !photo.caption;
    if (status) {
      status.textContent =
        (photo.caption || photo.alt) + ". Image " + (index + 1) + " of " + photos.length + ".";
    }
    var single = photos.length < 2;
    prev.hidden = single;
    next.hidden = single;
  }

  gallery.addEventListener("click", function (event) {
    var button = event.target.closest("button[data-index]");
    if (!button) return;
    show(Number(button.getAttribute("data-index")));
    dialog.showModal();
  });

  prev.addEventListener("click", function () {
    show(index - 1);
  });
  next.addEventListener("click", function () {
    show(index + 1);
  });

  dialog.querySelector("[data-close]").addEventListener("click", function () {
    dialog.close();
  });

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) dialog.close();
  });

dialog.addEventListener("keydown", function (event) {
  if (event.key === "ArrowRight") {
    event.preventDefault();
    show(index + 1);
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    show(index - 1);
  } else if (event.key === "Escape") {
    dialog.close();
  }
});

  var panel = dialog.querySelector(".lightbox-panel");
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
      var dx = event.changedTouches[0].clientX - startX;
      if (Math.abs(dx) < 40) return;
      show(index + (dx < 0 ? 1 : -1));
    },
    { passive: true }
  );
})();