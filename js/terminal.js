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

  var jokes = [
    "Why did the test go to therapy? Too many unresolved issues.",
    "My code told a joke. Nobody laughed. It was a dry run.",
    "QA walked into a bar. Then a bar. Then a bar. Then null.",
    "A bug and a feature walked into standup. Nobody could tell them apart.",
    "The suite is like a smoke alarm: loudest right after I start cooking.",
    "Why do developers prefer dark mode? Light attracts bugs.",
    "The flaky test and I are talking again. It passed on the third try.",
    "I asked the build if it was okay. It said it depends.",
    "They said ship it. The bug heard ship and packed a suitcase.",
    "Assertion failed: expected coffee, received another meeting.",
  ];

  var matrixToken = 0;

  function go(href, message) {
    addLine("out", message);
    window.setTimeout(function () {
      window.location.href = href;
    }, reduce ? 0 : 400);
  }

  function stopMatrix() {
    matrixToken += 1;
    var rain = document.querySelector(".matrix-rain");
    if (rain) rain.remove();
  }

  function playMatrix() {
    if (reduce) {
      addLine("out", "the matrix has you.");
      return;
    }
    stopMatrix();
    var token = matrixToken;
    var shell = output.closest(".terminal");
    var rain = document.createElement("pre");
    rain.className = "matrix-rain";
    rain.setAttribute("aria-hidden", "true");
    rain.style.position = "absolute";
    rain.style.left = "0";
    rain.style.right = "0";
    rain.style.top = output.offsetTop + "px";
    rain.style.height = output.clientHeight + "px";
    rain.style.margin = "0";
    rain.style.overflow = "hidden";
    rain.style.zIndex = "2";
    rain.style.pointerEvents = "none";
    rain.style.color = "#86efac";
    rain.style.background = "#070b12";
    rain.style.font = "12px/1.15 ui-monospace, monospace";
    shell.style.position = "relative";
    shell.appendChild(rain);

    var glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var started = performance.now();
    var heads = [];

    function frame(now) {
      if (token !== matrixToken) return;
      if (now - started >= 1500) {
        rain.remove();
        addLine("out", "wake up, neo… (back to work)");
        return;
      }
      var cols = Math.max(8, Math.floor(rain.clientWidth / 10));
      var rows = Math.max(6, Math.floor(rain.clientHeight / 14));
      while (heads.length < cols) heads.push(Math.floor(Math.random() * rows));
      var lines = [];
      var r;
      var c;
      for (r = 0; r < rows; r += 1) lines.push("");
      for (c = 0; c < cols; c += 1) {
        heads[c] = (heads[c] + 1) % (rows + 6);
        for (r = 0; r < rows; r += 1) {
          var trail = heads[c] - r;
          lines[r] += trail >= 0 && trail < 7 ? glyphs.charAt(Math.floor(Math.random() * glyphs.length)) : " ";
        }
      }
      rain.textContent = lines.join("\n");
      window.requestAnimationFrame(frame);
    }

    window.requestAnimationFrame(frame);
  }

  function runTests() {
    var lines = [
      "✓ renders homepage",
      "✓ squash the bug is squashable",
      "✓ privacy page loads",
      "✓ coffee level > 0",
    ];
    if (Math.random() < 0.1) lines.push("⚠ 1 flaky test (passed on retry)");
    lines.push("12 passed, 0 failed ✓ all green");
    if (reduce) {
      lines.forEach(function (line) {
        addLine("out", line);
      });
      return;
    }
    var index = 0;
    function next() {
      if (index >= lines.length) return;
      addLine("out", lines[index]);
      index += 1;
      if (index < lines.length) window.setTimeout(next, 260);
    }
    next();
  }

  function run(raw) {
    var key = raw.trim().toLowerCase().replace(/\s+/g, " ");
    if (!key) return;
    if (key === "clear") {
      stopMatrix();
      output.replaceChildren();
      return;
    }

    addLine("cmd", raw.trim());

    if (key === "help --all") {
      addLine(
        "out",
        [
          "help            list commands",
          "help --all      list every command",
          "about           open the about page",
          "projects        open projects",
          "photos          open photography",
          "contact         email",
          "whoami          print my name",
          "location        print where I am",
          "clear           clear the screen",
          "sudo            you can try",
          "coffee          brew a cup",
          "joke            tell a joke",
          "matrix          enter the matrix",
          "run tests       run the suite",
          "npm test        same suite",
          "weather         orlando forecast",
          "hire            start a conversation",
          "exit            try to leave",
          "ls              list files",
          "cat secrets.txt open the secret file",
          "history         show typed commands",
        ].join("\n")
      );
      return;
    }

    if (key === "help") {
      addLine(
        "out",
        [
          "help        list commands",
          "about       open the about page",
          "projects    open projects",
          "photos      open photography",
          "contact     email",
          "whoami      print my name",
          "location    print where I am",
          "clear       clear the screen",
          "sudo        you can try",
          "+ 10 hidden commands, try help --all",
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
      addLine("out", "bug is on the loose. go squash it.");
      var lab = document.getElementById("lab");
      if (lab) lab.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      var bug = document.getElementById("bug");
      if (bug) bug.focus();
      return;
    }
    if (key === "hello" || key === "hi") {
      return addLine("out", "hey. type help if you want the real commands.");
    }
    if (key === "coffee") {
      addLine(
        "out",
        ["   ( (", "    ) )", " .------.", " |      |]", " '------'"].join("\n")
      );
      return addLine("out", "brewing… ☕ caffeine levels nominal.");
    }
    if (key === "joke") {
      return addLine("out", jokes[Math.floor(Math.random() * jokes.length)]);
    }
    if (key === "matrix") {
      playMatrix();
      return;
    }
    if (key === "run tests" || key === "npm test") {
      runTests();
      return;
    }
    if (key === "weather") {
      return addLine("out", "Orlando, FL: hot, humid, 100% chance of afternoon thunderstorms ⛈");
    }
    if (key === "hire") {
      return addLine("out", "Hiring? Let's talk: email@abidur.net");
    }
    if (key === "exit") {
      return addLine("out", "nice try. there is no escape. (type clear instead)");
    }
    if (key === "ls") {
      return addLine("out", "about.txt  projects/  photos/  role.txt  secrets.txt");
    }
    if (key === "cat secrets.txt") {
      addLine("err", "Permission denied.");
      return addLine("out", "…fine: the secret is I write tests before coffee.");
    }
    if (key === "history") {
      return addLine(
        "out",
        history
          .map(function (cmd, index) {
            return index + 1 + "  " + cmd;
          })
          .join("\n")
      );
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
