(function () {
  var output = document.getElementById("terminal-output");
  var form = document.getElementById("terminal-form");
  var input = document.getElementById("terminal-input");
  if (!output || !form || !input) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var history = [];
  var histIndex = 0;
  var booted = false;

  var boot = [
    { kind: "cmd", text: "whoami" },
    { kind: "out", text: "Abidur Chowdhury" },
    { kind: "cmd", text: "cat role.txt" },
    { kind: "out", text: "Software Developer & Software Test Engineer" },
    { kind: "cmd", text: "location" },
    { kind: "out", text: "Orlando, Florida" },
    { kind: "hint", text: 'type "help" to look around' },
  ];

  function scrollDown() {
    output.scrollTop = output.scrollHeight;
  }

  function addLine(kind, text) {
    var line = document.createElement("p");
    line.className = "line line-" + (kind === "cmd" ? "cmd" : kind === "err" ? "err" : kind === "hint" ? "hint" : "out");
    if (kind === "cmd") {
      var prompt = document.createElement("span");
      prompt.className = "pr";
      prompt.setAttribute("aria-hidden", "true");
      prompt.textContent = ">";
      line.append(prompt, document.createTextNode(" " + text));
    } else {
      line.textContent = text;
    }
    output.appendChild(line);
    scrollDown();
    return line;
  }

  function sleep(ms) {
    return new Promise(function (resolve) {
      window.setTimeout(resolve, ms);
    });
  }

  async function typeText(node, text) {
    if (reduce) {
      node.textContent = text;
      return;
    }
    for (var i = 0; i < text.length; i += 1) {
      node.textContent += text.charAt(i);
      scrollDown();
      await sleep(text.length > 28 ? 12 : 22);
    }
  }

  async function playBoot() {
    output.replaceChildren();
    for (var i = 0; i < boot.length; i += 1) {
      var item = boot[i];
      if (item.kind === "cmd") {
        var line = document.createElement("p");
        line.className = "line line-cmd";
        var prompt = document.createElement("span");
        prompt.className = "pr";
        prompt.setAttribute("aria-hidden", "true");
        prompt.textContent = ">";
        var typed = document.createElement("span");
        line.append(prompt, document.createTextNode(" "), typed);
        output.appendChild(line);
        await typeText(typed, item.text);
      } else {
        var out = document.createElement("p");
        out.className = "line line-" + (item.kind === "hint" ? "hint" : "out");
        output.appendChild(out);
        await typeText(out, item.text);
      }
      if (!reduce) await sleep(160);
    }
  }

  function go(href, message) {
    addLine("out", message);
    window.setTimeout(function () {
      window.location.href = href;
    }, reduce ? 0 : 400);
  }

  function run(raw) {
    var key = raw.trim().toLowerCase().replace(/\s+/g, " ");
    if (!key) return;
    if (key === "clear") {
      output.replaceChildren();
      return;
    }

    addLine("cmd", raw.trim());

    if (key === "help") {
      addLine(
        "out",
        [
          "help        list commands",
          "about       open the about page",
          "projects    open projects",
          "photos      open photography",
          "contact     email and github",
          "whoami      print my name",
          "location    print where I am",
          "clear       clear the screen",
          "sudo        you can try",
        ].join("\n")
      );
      return;
    }

    if (key === "about") return go("/about.html", "opening about…");
    if (key === "projects" || key === "games") return go("/projects.html", "opening projects…");
    if (key === "photos" || key === "photography") return go("/photography.html", "opening photography…");
    if (key === "contact" || key === "email") return go("/about.html#contact", "opening contact…");
    if (key === "whoami") return addLine("out", "Abidur Chowdhury");
    if (key === "location") return addLine("out", "Orlando, Florida");
    if (key === "cat role.txt" || key === "role") {
      return addLine("out", "Software Developer & Software Test Engineer");
    }
    if (key === "sudo make me a sandwich") {
      return addLine("out", "nice try. this machine has no root and no bread.");
    }
    if (key.indexOf("sudo") === 0) {
      addLine("err", "abidur.net: you are not in the sudoers file. this incident will be reported.");
      addLine("out", "(reported straight to /dev/null.)");
      return;
    }
    if (key === "bug" || key === "test") {
      addLine("out", "bug is loose in the qa lab. go squash it.");
      var lab = document.getElementById("lab");
      if (lab) lab.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      var bug = document.getElementById("bug");
      if (bug) bug.focus();
      return;
    }
    if (key === "hello" || key === "hi") {
      return addLine("out", "hey. type help if you want the real commands.");
    }

    addLine("err", "zsh: command not found: " + raw.trim());
    addLine("hint", "type help");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!booted) return;
    var value = input.value;
    input.value = "";
    if (!value.trim()) return;
    history.push(value);
    histIndex = history.length;
    run(value);
  });

  input.addEventListener("keydown", function (event) {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    if (!history.length) return;
    event.preventDefault();
    if (event.key === "ArrowUp" && histIndex > 0) {
      histIndex -= 1;
      input.value = history[histIndex];
    } else if (event.key === "ArrowDown") {
      if (histIndex < history.length - 1) {
        histIndex += 1;
        input.value = history[histIndex];
      } else {
        histIndex = history.length;
        input.value = "";
      }
    }
  });

  document.addEventListener("konami", function () {
    if (!booted) return;
    addLine("out", "cheat code accepted. extra life granted.");
  });

  input.disabled = true;
  playBoot()
    .catch(function () {
      output.replaceChildren();
      boot.forEach(function (item) {
        addLine(item.kind === "cmd" ? "cmd" : item.kind, item.text);
      });
    })
    .finally(function () {
      booted = true;
      input.disabled = false;
      input.placeholder = "";
      output.setAttribute("role", "log");
      output.setAttribute("aria-live", "polite");
      output.setAttribute("aria-relevant", "additions");
    });
})();
