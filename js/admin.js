/**
 * ADMIN.JS
 * --------
 * Powers admin.html: a password-gated editor for add / edit / delete of
 * blog posts.
 *
 * HOW THIS WORKS (read this before relying on it):
 * This is a static site with no server and no database, so there's nowhere
 * private to save posts to. Edits made here are saved to this browser's
 * localStorage only — they preview instantly on this device, but they are
 * NOT visible to other visitors and are NOT saved to your actual files.
 * When you're happy with your changes, click "Download posts-data.js" and
 * replace js/posts-data.js in your project with the downloaded file, then
 * re-upload the site to your host. That step is what makes changes public.
 *
 * SECURITY NOTE:
 * The password below lives in a plain JavaScript file that ships to every
 * visitor's browser. Anyone who opens their browser's developer tools can
 * read it. This screen only keeps out casual visitors clicking around your
 * site — it is not real access control. Don't use it to gate anything
 * sensitive, and don't reuse a password you care about.
 */

const ADMIN_SESSION_KEY = "admin_unlocked";

let workingPosts = [];
let editingId = null; // null = creating a new post

// ---------- password gate ----------

function initAdminGate() {
  const gate = document.querySelector("[data-admin-gate]");
  const panel = document.querySelector("[data-admin-panel]");
  const form = document.querySelector("[data-gate-form]");
  const input = document.querySelector("[data-gate-input]");
  const error = document.querySelector("[data-gate-error]");
  if (!gate || !panel || !form) return;

  function unlock() {
    sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
    gate.hidden = true;
    panel.hidden = false;
    initEditor();
  }

  if (sessionStorage.getItem(ADMIN_SESSION_KEY) === "1") {
    unlock();
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value === SITE.adminPassword) {
      unlock();
    } else {
      error.hidden = false;
      input.value = "";
      input.focus();
    }
  });
}

// ---------- editor ----------

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function uniqueSlug(base) {
  let slug = base || "post";
  let n = 2;
  const ids = workingPosts.map((p) => p.id);
  while (ids.includes(slug)) {
    slug = `${base}-${n}`;
    n++;
  }
  return slug;
}

function saveWorkingPosts() {
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(workingPosts));
}

function renderAdminList() {
  const list = document.querySelector("[data-admin-list]");
  if (!list) return;

  const sorted = [...workingPosts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  if (sorted.length === 0) {
    list.innerHTML = `<p class="empty-state">No posts yet. Use the form to add your first one.</p>`;
    return;
  }

  list.innerHTML = sorted
    .map(
      (p) => `
      <div class="admin-row" data-post-row="${p.id}">
        <div class="admin-row-main">
          <span class="post-card-date">${formatDate(p.date)}</span>
          <h3 class="admin-row-title">${p.title}</h3>
          <span class="post-card-tags">${p.tags.join(" · ")}</span>
        </div>
        <div class="admin-row-actions">
          <button class="btn btn-ghost btn-small" data-edit="${p.id}">Edit</button>
          <button class="btn btn-danger btn-small" data-delete="${p.id}">Delete</button>
        </div>
      </div>`
    )
    .join("");

  list.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => loadPostIntoForm(btn.getAttribute("data-edit")));
  });
  list.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", () => deletePost(btn.getAttribute("data-delete")));
  });
}

function loadPostIntoForm(id) {
  const post = workingPosts.find((p) => p.id === id);
  if (!post) return;
  editingId = id;

  document.querySelector("[data-form-heading]").textContent = "Edit post";
  document.querySelector("[data-field-id]").value = post.id;
  document.querySelector("[data-field-id]").disabled = true;
  document.querySelector("[data-field-title]").value = post.title;
  document.querySelector("[data-field-date]").value = post.date;
  document.querySelector("[data-field-tags]").value = post.tags.join(", ");
  document.querySelector("[data-field-excerpt]").value = post.excerpt;
  document.querySelector("[data-field-content]").value = post.content.trim();
  document.querySelector("[data-cancel-edit]").hidden = false;
  document.querySelector("[data-field-title]").focus();
}

function resetForm() {
  editingId = null;
  document.querySelector("[data-post-form]").reset();
  document.querySelector("[data-form-heading]").textContent = "New post";
  document.querySelector("[data-field-id]").disabled = false;
  document.querySelector("[data-field-id]").value = "";
  document.querySelector("[data-field-date]").value = new Date()
    .toISOString()
    .slice(0, 10);
  document.querySelector("[data-cancel-edit]").hidden = true;
}

function deletePost(id) {
  const post = workingPosts.find((p) => p.id === id);
  if (!post) return;
  if (!confirm(`Delete "${post.title}"? This can't be undone.`)) return;

  workingPosts = workingPosts.filter((p) => p.id !== id);
  saveWorkingPosts();
  renderAdminList();
  if (editingId === id) resetForm();
  showNotice("Post deleted.");
}

function handleFormSubmit(e) {
  e.preventDefault();

  const title = document.querySelector("[data-field-title]").value.trim();
  const date = document.querySelector("[data-field-date]").value;
  const tagsRaw = document.querySelector("[data-field-tags]").value.trim();
  const excerpt = document.querySelector("[data-field-excerpt]").value.trim();
  const content = document.querySelector("[data-field-content]").value.trim();

  if (!title || !date || !content) {
    showNotice("Title, date, and content are required.", true);
    return;
  }

  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  if (editingId) {
    const idx = workingPosts.findIndex((p) => p.id === editingId);
    if (idx !== -1) {
      workingPosts[idx] = { ...workingPosts[idx], title, date, tags, excerpt, content };
    }
    showNotice("Post updated.");
  } else {
    const idField = document.querySelector("[data-field-id]");
    const id = uniqueSlug(idField.value.trim() ? slugify(idField.value) : slugify(title));
    workingPosts.push({ id, title, date, tags, excerpt, content });
    showNotice("Post added.");
  }

  saveWorkingPosts();
  renderAdminList();
  resetForm();
}

function showNotice(message, isError) {
  const notice = document.querySelector("[data-admin-notice]");
  if (!notice) return;
  notice.textContent = message;
  notice.classList.toggle("admin-notice--error", !!isError);
  notice.hidden = false;
  clearTimeout(showNotice._t);
  showNotice._t = setTimeout(() => (notice.hidden = true), 3200);
}

// ---------- export / reset ----------

function generatePostsFileContent(posts) {
  const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
  const entries = sorted
    .map((p) => {
      const tags = JSON.stringify(p.tags);
      const esc = (s) => s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
      return `  {
    id: ${JSON.stringify(p.id)},
    title: ${JSON.stringify(p.title)},
    date: ${JSON.stringify(p.date)},
    tags: ${tags},
    excerpt: ${JSON.stringify(p.excerpt)},
    content: \`
      ${esc(p.content).split("\n").join("\n      ")}
    \`
  }`;
    })
    .join(",\n");

  return `/**
 * BLOG POSTS
 * ----------
 * Generated by admin.html on ${new Date().toISOString().slice(0, 10)}.
 * To add a new post by hand, copy one of the objects below, give it a
 * unique "id", and fill in the fields. Newest-first order is just for
 * readability — the site always sorts by date automatically.
 */
const POSTS = [
${entries}
];
`;
}

function exportPostsFile() {
  const content = generatePostsFileContent(workingPosts);
  const blob = new Blob([content], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "posts-data.js";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showNotice("Downloaded. Replace js/posts-data.js with this file, then re-upload your site.");
}

function resetToFile() {
  if (!confirm("Discard all local changes and go back to what's in posts-data.js?")) return;
  localStorage.removeItem(POSTS_STORAGE_KEY);
  workingPosts = [...POSTS];
  renderAdminList();
  resetForm();
  showNotice("Local changes discarded.");
}

// ---------- boot ----------

function initEditor() {
  workingPosts = [...getAllPosts()];
  renderAdminList();
  resetForm();

  document.querySelector("[data-post-form]").addEventListener("submit", handleFormSubmit);
  document.querySelector("[data-cancel-edit]").addEventListener("click", resetForm);
  document.querySelector("[data-export]").addEventListener("click", exportPostsFile);
  document.querySelector("[data-reset]").addEventListener("click", resetToFile);

  const titleField = document.querySelector("[data-field-title]");
  const idField = document.querySelector("[data-field-id]");
  titleField.addEventListener("input", () => {
    if (!editingId) idField.placeholder = slugify(titleField.value) || "auto-generated-from-title";
  });
}

document.addEventListener("DOMContentLoaded", initAdminGate);
