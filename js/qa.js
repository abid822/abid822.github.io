(function () {
  var lab = document.getElementById("lab");
  var bug = document.getElementById("bug");
  var status = document.getElementById("qa-status");
  var result = document.getElementById("qa-result");
  var count = document.getElementById("qa-count");
  var reset = document.getElementById("bug-reset");
  if (!lab || !bug || !status || !result || !count || !reset) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var timer = 0;
  var found = 0;

  function place(random) {
    if (reduce) {
      bug.style.left = "50%";
      bug.style.top = "50%";
      bug.style.transform = "translate(-50%, -50%)";
      return;
    }
    var pad = 10;
    var maxX = Math.max(0, lab.clientWidth - bug.offsetWidth - pad * 2);
    var maxY = Math.max(0, lab.clientHeight - bug.offsetHeight - pad * 2);
    var x = pad + (random ? Math.random() * maxX : maxX / 2);
    var y = pad + (random ? Math.random() * maxY : maxY / 2);
    bug.style.left = "0px";
    bug.style.top = "0px";
    bug.style.transform = "translate(" + x + "px, " + y + "px)";
  }

  function wander() {
    window.clearInterval(timer);
    if (reduce) return;
    timer = window.setInterval(function () {
      place(true);
    }, 1100);
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
  }

  bug.addEventListener("click", function () {
    window.clearInterval(timer);
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
    wander();
    bug.focus();
  });

  bug.style.transition = "none";
  place(false);
  window.requestAnimationFrame(function () {
    bug.style.transition = "";
    wander();
  });
})();
