// Shared by index.html and project.html: each block runs only if its elements exist.
document.documentElement.classList.add("js");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

// Hero: rotate the discipline line
const rotator = document.getElementById("rotator");
if (rotator && !reduced) {
  const count = rotator.children.length;
  rotator.appendChild(rotator.children[0].cloneNode(true)); // clone for a seamless loop
  let index = 0;
  setInterval(() => {
    index += 1;
    rotator.classList.remove("no-anim");
    rotator.style.transform = `translateY(-${index * 1.16}em)`;
    if (index === count) {
      setTimeout(() => {
        index = 0;
        rotator.classList.add("no-anim");
        rotator.style.transform = "translateY(0)";
      }, 900);
    }
  }, 2200);
}

// Reel: open the tilted panel into a full rectangle while scrolling
const reel = document.getElementById("reel");
const panel = document.getElementById("reel-panel");
const wide = [24, 14, 80, 34, 86, 100, 14, 94];
const narrow = [5, 6, 92, 20, 100, 100, 0, 95]; // portrait screens need a wider starting shape
const to = [0, 0, 100, 0, 100, 100, 0, 100];

// About: light up the statement word by word
const statement = document.querySelector("[data-words]");
let words = [];
if (statement) {
  statement.innerHTML = statement.textContent
    .trim()
    .split(/\s+/)
    .map((word) => `<span class="w">${word}</span>`)
    .join(" ");
  words = statement.querySelectorAll(".w");
}

function onScroll() {
  const vh = window.innerHeight;

  if (reel) {
    // 0 at the top of the page, 1 once the panel has been pinned for 60% of its travel
    const travel = reel.offsetHeight - vh;
    const p = clamp(window.scrollY / (reel.offsetTop + travel * 0.6), 0, 1);
    const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    const from = window.innerWidth < 700 ? narrow : wide;
    const pts = from.map((v, i) => v + (to[i] - v) * e);
    panel.style.clipPath = `polygon(${pts[0]}% ${pts[1]}%, ${pts[2]}% ${pts[3]}%, ${pts[4]}% ${pts[5]}%, ${pts[6]}% ${pts[7]}%)`;
  }

  if (statement) {
    const rect = statement.getBoundingClientRect();
    const lit = clamp((vh * 0.85 - rect.top) / (rect.height + vh * 0.35), 0, 1) * words.length;
    words.forEach((word, i) => word.classList.toggle("is-lit", i < lit));
  }
}

if ((reel || statement) && !reduced) {
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
    },
    { passive: true }
  );
  window.addEventListener("resize", onScroll);
  onScroll();
}

// Reveal blocks as they enter the viewport
const targets = document.querySelectorAll(
  ".tile, .glass, .fact, .about__split, .form, .section-title, .display, .cs-cover, .cs-label, .cs-body, .cs-tile, .cs-palette, .cs-type, .cs-stack img, .work__more"
);
targets.forEach((el) => el.classList.add("reveal"));
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);
targets.forEach((el) => observer.observe(el));

// Pointer dot
const cursor = document.querySelector(".cursor");
if (cursor && !reduced && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let x = 0, y = 0, tx = 0, ty = 0;
  window.addEventListener("mousemove", (event) => {
    tx = event.clientX;
    ty = event.clientY;
    cursor.classList.add("is-on");
    cursor.classList.toggle("is-big", Boolean(event.target.closest("a, button, .choices label")));
  });
  document.addEventListener("mouseleave", () => cursor.classList.remove("is-on"));
  (function follow() {
    x += (tx - x) * 0.2;
    y += (ty - y) * 0.2;
    cursor.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(follow);
  })();
}

// Lahore local time
const clock = document.getElementById("clock");
if (clock) {
  const tick = () => {
    clock.textContent = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Karachi" }).format(new Date());
  };
  tick();
  setInterval(tick, 30000);
}

// Contact form: open the visitor's email app with the message filled in
const form = document.getElementById("form");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const interests = data.getAll("interest").join(", ") || "Not specified";
    const body = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nInterested in: ${interests}\n\n${data.get("message")}`;
    const address = form.getAttribute("action");
    window.location.href = `${address}?subject=${encodeURIComponent("New project enquiry")}&body=${encodeURIComponent(body)}`;
  });
}
