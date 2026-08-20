/**
 * MAIN.JS
 * -------
 * Shared behavior for every page. Each function below checks whether the
 * element it needs exists before running, so this one file can safely be
 * included on every page without errors.
 */

// ---------- helpers ----------

function formatDate(isoString) {
  const d = new Date(isoString + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function sortedPosts() {
  return [...POSTS].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function postCardHTML(post) {
  return `
    <a class="post-card" href="post.html?id=${encodeURIComponent(post.id)}">
      <span class="post-card-date">${formatDate(post.date)}</span>
      <h3 class="post-card-title">${post.title}</h3>
      <p class="post-card-excerpt">${post.excerpt}</p>
      <span class="post-card-tags">${post.tags.join(" · ")}</span>
    </a>
  `;
}

// ---------- navigation ----------

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-links");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("nav-links--open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  // Highlight the current page in the nav
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === current) link.classList.add("nav-link--active");
  });
}

// ---------- homepage: latest 3 posts ----------

function renderLatestPosts() {
  const container = document.querySelector("[data-latest-posts]");
  if (!container) return;
  const latest = sortedPosts().slice(0, 3);
  container.innerHTML = latest.map(postCardHTML).join("");
}

// ---------- blog index: full list + search ----------

function renderBlogList(filterText) {
  const container = document.querySelector("[data-all-posts]");
  if (!container) return;

  let posts = sortedPosts();
  if (filterText) {
    const q = filterText.trim().toLowerCase();
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  container.innerHTML = posts.length
    ? posts.map(postCardHTML).join("")
    : `<p class="empty-state">No posts match "${filterText}". Try a different search.</p>`;
}

function initBlogPage() {
  const list = document.querySelector("[data-all-posts]");
  if (!list) return;
  renderBlogList("");

  const search = document.querySelector("[data-post-search]");
  if (search) {
    search.addEventListener("input", (e) => renderBlogList(e.target.value));
  }
}

// ---------- single post page ----------

function initPostPage() {
  const container = document.querySelector("[data-post-detail]");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const post = POSTS.find((p) => p.id === id);

  if (!post) {
    container.innerHTML = `
      <p class="post-eyebrow">Not found</p>
      <h1>We couldn't find that post</h1>
      <p>It may have been moved or the link is out of date.</p>
      <p><a class="btn btn-primary" href="blog.html">Back to all posts</a></p>
    `;
    document.title = "Post not found";
    return;
  }

  document.title = post.title + " — " + SITE.name;
  container.innerHTML = `
    <p class="post-eyebrow">${formatDate(post.date)} · ${post.tags.join(" · ")}</p>
    <h1>${post.title}</h1>
    <div class="post-body">${post.content}</div>
    <p class="post-back"><a href="blog.html">&larr; Back to all posts</a></p>
  `;
}

// ---------- hero fade-in ----------

function initHero() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  // Adding this class kicks off the staggered CSS fade defined in style.css
  requestAnimationFrame(() => hero.classList.add("hero--visible"));
}

// ---------- boot ----------

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initHero();
  renderLatestPosts();
  initBlogPage();
  initPostPage();
});
