(() => {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* Swap placeholder UI for real screenshots when files exist */
  document.querySelectorAll("[data-screenshot]").forEach((screen) => {
    const src = screen.getAttribute("data-screenshot");
    if (!src) return;

    const img = new Image();
    img.onload = () => {
      img.alt = screen.getAttribute("data-alt") || "App screenshot";
      screen.replaceChildren(img);
    };
    img.onerror = () => {
      /* keep placeholder UI */
    };
    img.src = src;
  });

  /* Swap diagram fallbacks for real diagram/screenshot images */
  document.querySelectorAll("[data-diagram]").forEach((panel) => {
    const src = panel.getAttribute("data-diagram");
    if (!src) return;

    const img = new Image();
    img.onload = () => {
      img.alt = panel.getAttribute("data-alt") || "Architecture diagram";
      panel.replaceChildren(img);
    };
    img.onerror = () => {
      /* keep diagram fallback */
    };
    img.src = src;
  });

  /* Hero muted loop: try mp4 / webm / gif, else keep CSS terminal */
  const heroLoop = document.querySelector("[data-hero-loop]");
  if (heroLoop) {
    const sources = (heroLoop.getAttribute("data-hero-loop") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const tryNext = (i) => {
      if (i >= sources.length) return;
      const src = sources[i];
      const isVideo = /\.(mp4|webm)$/i.test(src);

      if (isVideo) {
        const video = document.createElement("video");
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;
        video.autoplay = true;
        video.loop = true;
        video.preload = "metadata";
        video.setAttribute("muted", "");
        video.setAttribute("playsinline", "");
        video.setAttribute("aria-hidden", "true");
        video.onloadeddata = () => {
          heroLoop.replaceChildren(video);
          video.play().catch(() => {});
        };
        video.onerror = () => tryNext(i + 1);
        video.src = src;
      } else {
        const img = new Image();
        img.alt = "";
        img.setAttribute("aria-hidden", "true");
        img.onload = () => heroLoop.replaceChildren(img);
        img.onerror = () => tryNext(i + 1);
        img.src = src;
      }
    };

    tryNext(0);
  }
})();
