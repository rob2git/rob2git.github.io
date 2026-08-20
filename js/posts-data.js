/**
 * BLOG POSTS
 * ----------
 * To add a new post, copy one of the objects below, give it a unique
 * "id" (used in the URL: post.html?id=your-id), and fill in the fields.
 * Newest posts should go at the TOP of the array — the homepage and
 * blog index both sort by date automatically, so order here doesn't
 * strictly matter, but keeping newest-first makes the file easier to read.
 *
 * "content" accepts plain HTML — wrap paragraphs in <p> tags.
 */
const POSTS = [
  {
    id: "designing-with-restraint",
    title: "Designing with restraint",
    date: "2026-07-28",
    tags: ["Design", "Process"],
    excerpt:
      "Most interfaces don't fail because they're missing a feature. They fail because nothing was left out.",
    content: `
      <p>Most interfaces don't fail because they're missing a feature. They fail because nothing was left out. Every panel, badge, and secondary action seemed reasonable on its own, and together they add up to a screen that asks for more attention than the task deserves.</p>
      <p>Restraint isn't the absence of decisions — it's the presence of a lot of them, most of which end in "no." Every element on a page should be able to answer a simple question: what happens if this is removed? If the honest answer is "nothing," it doesn't belong.</p>
      <p>I've started keeping a running list of things I cut from a design before shipping it. It's usually longer than the list of things I kept. That ratio feels like a reasonable proxy for whether the work is actually finished.</p>
    `
  },
  {
    id: "a-year-of-writing-weekly",
    title: "A year of writing weekly",
    date: "2026-06-14",
    tags: ["Writing", "Reflection"],
    excerpt:
      "Fifty-two short posts later, the habit turned out to matter more than any single piece of writing.",
    content: `
      <p>A year ago I committed to publishing something short every week, regardless of quality. The goal was never to produce fifty-two great posts — it was to build a habit sturdy enough to survive weeks when I had nothing interesting to say.</p>
      <p>Most weeks I didn't. I wrote about a meeting that went badly, a bug I couldn't reproduce, a conversation with a friend about career changes. None of it was remarkable on its own. But looking back, the accumulation says more about how I think than any individual entry does.</p>
      <p>If you're waiting for a good idea before you start writing, you'll wait longer than you think. The idea usually shows up around paragraph three.</p>
    `
  },
  {
    id: "notes-on-remote-collaboration",
    title: "Notes on remote collaboration",
    date: "2026-05-02",
    tags: ["Work", "Process"],
    excerpt:
      "The teams that collaborate well remotely aren't the ones with the most meetings — they're the ones with the best written record.",
    content: `
      <p>The teams that collaborate well remotely aren't the ones with the most meetings — they're the ones with the best written record. A decision that only exists in someone's memory of a call is a decision that will be re-litigated in three weeks.</p>
      <p>The habit that made the biggest difference on my team was small: every meeting ends with someone writing a two-sentence summary in the shared doc before anyone leaves the call. Not a full transcript. Just what was decided and who owns the next step.</p>
      <p>It sounds trivial. It isn't. Six months in, we stopped having the same argument twice.</p>
    `
  },
  {
    id: "on-taking-better-meeting-notes",
    title: "On taking better meeting notes",
    date: "2026-03-19",
    tags: ["Work"],
    excerpt:
      "Good notes aren't a transcript of what was said. They're a record of what changed.",
    content: `
      <p>Good notes aren't a transcript of what was said. They're a record of what changed — a decision made, a risk surfaced, an owner assigned. Everything else is noise you can safely let go of.</p>
      <p>I used to try to capture everything and ended up with pages I never reread. Now I keep three columns: decisions, open questions, and owners. If a note doesn't fit one of those three, it probably didn't need to be written down.</p>
    `
  },
  {
    id: "rebuilding-my-workflow-around-plain-text",
    title: "Rebuilding my workflow around plain text",
    date: "2026-01-22",
    tags: ["Tools"],
    excerpt:
      "Every tool I've used for more than five years shares one property: it stores its data as plain text.",
    content: `
      <p>Every tool I've used for more than five years shares one property: it stores its data as plain text. Not because plain text is exciting, but because it's the one format I can be confident will still open in a decade.</p>
      <p>This year I moved my notes, my task list, and most of my writing into plain Markdown files synced through a folder I control. I lost some polish. I gained the certainty that none of it depends on a company staying in business.</p>
      <p>It's a small trade. I'd make it again.</p>
    `
  }
];
