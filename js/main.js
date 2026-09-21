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

  /* Hero muted loop: play inline video, else try fallbacks, else terminal */
  const heroLoop = document.querySelector("[data-hero-loop]");
  if (heroLoop) {
    const terminal = heroLoop.querySelector(".hero-terminal");
    const inlineVideo = heroLoop.querySelector("video.hero-video");

    const showTerminal = () => {
      if (inlineVideo) inlineVideo.remove();
      heroLoop.querySelectorAll("video, img").forEach((el) => el.remove());
      if (terminal) terminal.hidden = false;
    };

    const playVideo = (video) => {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      return video.play().catch(() => {
        /* autoplay blocked — still leave muted video visible */
      });
    };

    const trySources = (sources, i) => {
      if (i >= sources.length) {
        showTerminal();
        return;
      }
      const src = sources[i];
      const isVideo = /\.(mp4|webm)$/i.test(src);

      if (isVideo) {
        const video = document.createElement("video");
        video.className = "hero-video";
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
          if (terminal) terminal.hidden = true;
          if (inlineVideo) inlineVideo.remove();
          heroLoop.querySelectorAll("video, img").forEach((el) => {
            if (el !== video) el.remove();
          });
          heroLoop.prepend(video);
          playVideo(video);
        };
        video.onerror = () => trySources(sources, i + 1);
        video.src = src;
      } else {
        const img = new Image();
        img.alt = "";
        img.setAttribute("aria-hidden", "true");
        img.onload = () => {
          if (terminal) terminal.hidden = true;
          if (inlineVideo) inlineVideo.remove();
          heroLoop.querySelectorAll("video, img").forEach((el) => el.remove());
          heroLoop.prepend(img);
        };
        img.onerror = () => trySources(sources, i + 1);
        img.src = src;
      }
    };

    if (inlineVideo) {
      const onFail = () => {
        const sources = (heroLoop.getAttribute("data-hero-loop") || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .filter((s) => !/loop\.mp4$/i.test(s));
        if (sources.length) trySources(sources, 0);
        else showTerminal();
      };

      inlineVideo.addEventListener("error", onFail, { once: true });
      if (inlineVideo.readyState >= 2) {
        if (terminal) terminal.hidden = true;
        playVideo(inlineVideo);
      } else {
        inlineVideo.addEventListener(
          "loadeddata",
          () => {
            if (terminal) terminal.hidden = true;
            playVideo(inlineVideo);
          },
          { once: true }
        );
        /* If source never loads */
        setTimeout(() => {
          if (inlineVideo.readyState < 2 && !inlineVideo.error) {
            /* still buffering — leave as-is */
          } else if (inlineVideo.error) {
            onFail();
          }
        }, 4000);
      }
    } else {
      const sources = (heroLoop.getAttribute("data-hero-loop") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      trySources(sources, 0);
    }
  }
})();
