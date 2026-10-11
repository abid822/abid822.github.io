(function () {
  var lab = document.getElementById("lab");
  var roam = document.getElementById("bug-roam");
  var bug = document.getElementById("bug");
  var status = document.getElementById("qa-status");
  var result = document.getElementById("qa-result");
  var count = document.getElementById("qa-count");
  var reset = document.getElementById("bug-reset");
  if (!lab || !roam || !bug || !status || !result || !count || !reset) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var found = 0;
  var loose = true;
  var lastHop = 0;

  function place(random) {
    var width = lab.clientWidth;
    var height = lab.clientHeight;
    if (!width || !height) return;
    if (reduce) {
      roam.style.left = "calc(50% - 32px)";
      roam.style.top = "calc(50% - 32px)";
      return;
    }
    var pad = 10;
    var maxX = Math.max(0, width - roam.offsetWidth - pad * 2);
    var maxY = Math.max(0, height - roam.offsetHeight - pad * 2);
    var x = pad + (random ? Math.random() * maxX : maxX / 2);
    var y = pad + (random ? Math.random() * maxY : maxY / 2);
    roam.style.left = x + "px";
    roam.style.top = y + "px";
  }

  function frame(now) {
    if (loose && !reduce && now - lastHop > 900) {
      lastHop = now;
      place(true);
    }
    window.requestAnimationFrame(frame);
  }

  function showFailing() {
    lab.classList.remove("passed");
    status.textContent = "status: failing";
    status.classList.add("status-fail");
    status.classList.remove("status-pass");
    result.hidden = true;
    reset.hidden = true;
    bug.classList.remove("squashed");
    bug.disabled = false;
    loose = true;
    lastHop = 0;
  }

  bug.addEventListener("click", function () {
    loose = false;
    bug.classList.add("squashed");
    bug.disabled = true;
    found += 1;
    lab.classList.add("passed");
    status.textContent = "status: passing";
    status.classList.remove("status-fail");
    status.classList.add("status-pass");
    result.hidden = false;
    count.hidden = false;
    count.textContent = "bugs found: " + found;
    reset.hidden = false;
  });

  reset.addEventListener("click", function () {
    showFailing();
    place(true);
    bug.focus();
  });

  place(false);
  window.requestAnimationFrame(frame);
  window.addEventListener("resize", function () {
    if (!loose) return;
    place(true);
  });
})();
