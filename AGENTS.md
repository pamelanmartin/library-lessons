# AGENTS.md

Instructions for AI assistants (and other automated tools) working in this repository.
People should start with [README.md](README.md).

## What this repository is

Self-paced library lessons for University of Idaho students, hosted on GitHub Pages.
Each lesson is one plain-text file (`lesson.txt`) that a shared template turns into an interactive page.
The people who maintain the lessons are librarians, not programmers.
Two requirements outrank everything else:

1. Lessons must meet WCAG 2.1 Level AA.
2. A librarian must be able to change wording, answers, images and links without code and without AI.

Read [docs/context.md](docs/context.md) for the full requirements and [docs/docs.md](docs/docs.md) for the lesson format before changing anything.

## Layout

| Path | Purpose | May you edit it? |
|---|---|---|
| `<lesson>/lesson-DRAFT.txt` | Working copy of a lesson | Yes. Make lesson changes here |
| `<lesson>/lesson.txt` | What students see | Only by copying in a draft the person has approved |
| `<lesson>/assets/` | The lesson's images | Yes, when asked |
| `<lesson>/index.html`, `preview.html` | Fixed 16-line pages that load the engine | No |
| `index.html` (top level) | Front page listing the lessons | Only to add or rename a lesson's `<li>` line |
| `new-lesson-starter/` | Blank lesson to copy | Only when the format itself changes |
| `example-lesson/` | Uses every feature; doubles as a test page | Keep in step with the engine |
| `template/lesson-engine.js`, `template/lesson-theme.css` | The shared program and look | Not without explicit approval (see below) |
| `docs/` | Documentation | Yes. Keep it in step with any change |

## Rules for lesson content

- Use only the labels listed in `docs/docs.md`. Do not put HTML in a lesson file; it is shown as plain text.
- Never type section, quiz or question numbers. The engine adds them.
- Every `IMAGE:` needs an `ALT:` line that describes the picture. Every `VIDEO:` needs a `TITLE:` line.
- Every `BOX:`, `TIP:`, `AFTER ANSWERS:`, `CARDS:` and `FINISH:` needs its matching `END` line.
- Keep a question's lines together, with no blank line inside it.
- Use a fill-in only when the answer is one unmistakable word or name. Aim for no more than two or three per lesson.
- Image file names have no spaces. Credit every image and video with a `CREDIT:` line that starts with the item's name.
- Do not invent facts, sources, credits or quotations. If a credit or source is unknown, say so and ask.
- Follow the draft routine: change `lesson-DRAFT.txt`, check the preview page shows "No problems found", then copy the draft into `lesson.txt` only when the person says to.

## Rules for the template

- Do not change `template/lesson-engine.js` or `template/lesson-theme.css` unless the person has explicitly asked for a template change. A change there affects every lesson.
- The `SETTINGS` and `WORDING` lists at the top of the engine, and the color list at the top of the theme, are meant to be edited by hand. Keep them that way: plain names, one per line, with a comment.
- Do not add a build step, a framework, a package manager or new outside dependencies. The site must stay plain files that work on any static web host.
- Do not add analytics, tracking, accounts, or anything that sends student data anywhere. Progress is saved in the student's browser only.
- Keep the code readable by someone new to it: comments in plain English, no minifying.
- After any template change, open `example-lesson/preview.html` and one real lesson, and confirm that every question type, saved progress and "Start over" still work.

## Accessibility checks to keep passing

- One `h1` per page, with headings in order below it.
- All controls usable by keyboard alone, with a visible focus outline.
- Text contrast of at least 4.5:1; never color alone to show right or wrong.
- Feedback messages announced to screen readers.
- No sideways scrolling at 320 pixels wide. Motion respects the "reduce motion" setting.

An automated scan is necessary but not enough. Say plainly what you tested and what still needs a person with a screen reader.

## How to work with the maintainers

- Write for non-coders: plain language, no jargon without a short explanation.
- Ask before each step that changes files, and offer options when there is a real choice.
- Say what you have not tested. Do not describe something as working unless you ran it.
- When behavior or the lesson format changes, update `docs/docs.md`, `docs/how-to-edit.md`, `example-lesson/` and `new-lesson-starter/` in the same change.
