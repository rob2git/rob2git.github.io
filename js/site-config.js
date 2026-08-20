/**
 * SITE CONFIG
 * -----------
 * Edit the values below and every page updates automatically —
 * name, role, tagline, email and social links all pull from here.
 * No other file needs to change when your personal details change.
 */
const SITE = {
  name: "Robert Barreto-Bajana",
  role: "Project Manager & Nerd & Writer",
  tagline: "Reflecting on the journey and the adventures behind it.",
  email: "agiletent@proton.me",
  location: "Tampa, FL",
  social: [
    { label: "Email", href: "mailto:agiletent@proton.me" },
    { label: "LinkedIn", href: "https://linkedin.com/in/robertbarreto" },
    { label: "GitHub", href: "https://github.com/rob2git" }
  ],
  issueLabel: "Welcome"// small margin label used on the homepage
};

/**
 * Fills every element carrying a data-site="..." attribute with the
 * matching value from SITE above. Called automatically on page load.
 */
function applySiteConfig() {
  document.querySelectorAll("[data-site]").forEach((el) => {
    const key = el.getAttribute("data-site");
    if (key === "email") {
      el.textContent = SITE.email;
      if (el.tagName === "A") el.href = "mailto:" + SITE.email;
    } else if (SITE[key] !== undefined) {
      el.textContent = SITE[key];
    }
  });

  const socialWrap = document.querySelector("[data-site-social]");
  if (socialWrap) {
    socialWrap.innerHTML = SITE.social
      .map((s) => `<a href="${s.href}" class="social-link">${s.label}</a>`)
      .join(" | ");
  }

  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", applySiteConfig);
