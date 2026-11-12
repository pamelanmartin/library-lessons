# library-lessons

Self-paced, interactive lessons from the University of Idaho Library, plus the template used to build them. These lessons are intended for first-year college students and use different topics to discuss information literacy in the real world.

Each lesson is one plain-text file.
A shared template turns that file into a web page with sections, quizzes, feedback, a progress bar and saved progress.
Lesson authors never touch HTML, CSS or JavaScript.

**Live site:** <https://pamelanmartin.github.io/library-lessons/>

**Lessons so far:**

- [Image Illusions: Identifying and Debunking Image Misinformation Online](https://pamelanmartin.github.io/library-lessons/image-illusions-workshop/)

## What's in this repository

| Folder or file | What it is |
|---|---|
| `index.html` | The site's front page, which lists the lessons |
| `template/` | The shared engine (`lesson-engine.js`) and look (`lesson-theme.css`) used by every lesson |
| `new-lesson-starter/` | A nearly empty lesson. Copy it to start a new lesson |
| `example-lesson/` | A short sample lesson that uses every feature |
| `image-illusions-workshop/` | The Image Illusions lesson |
| `docs/` | Full documentation |
| `AGENTS.md` | Instructions for AI assistants working in this repository |

Every lesson folder holds the same five things:

| File | What it is | Do you edit it? |
|---|---|---|
| `lesson-DRAFT.txt` | Your working copy of the lesson | Yes, edit here |
| `preview.html` | Shows the draft as students will see it, and lists any mistakes | No, just open it |
| `lesson.txt` | The version students see | Only by pasting in a checked draft |
| `index.html` | The students' page | No |
| `assets/` | The lesson's images | Upload or replace images here |

## The preview page

Every lesson folder has a `preview.html`.
It shows `lesson-DRAFT.txt` as students would see it, and a yellow box at the top names any line that needs fixing.
Students never see the preview; their page shows `lesson.txt`.

- **On the live site:** add `preview.html` to the lesson's address.
- **On your computer:** double-click `preview.html`, click **Choose lesson file…** and pick `lesson-DRAFT.txt` from that same folder.

## How to use: start a new lesson

1. Download this repository to your computer (**Code → Download ZIP**) and unzip it.
2. Make a copy of the `new-lesson-starter` folder, in the same place, and rename it.
   Use lowercase letters and dashes, with no spaces: `citing-sources`.
3. Open `lesson-DRAFT.txt` in a plain-text editor and write your lesson.
   Put its images in the `assets` folder.
4. Check your work: double-click `preview.html`, click **Choose lesson file…** and pick `lesson-DRAFT.txt`.
   A yellow box at the top names any line that needs fixing.
5. When the preview looks right, copy everything in `lesson-DRAFT.txt` into `lesson.txt`.
6. On GitHub, click **Add file → Upload files**, drag your new lesson folder in, and click **Commit changes**.
7. Add the lesson to the front page: in `index.html`, copy one `<li>…</li>` line and change the folder name and the title.

About a minute later the lesson is live at `https://pamelanmartin.github.io/library-lessons/your-folder-name/`.

## How to use: change an existing lesson

1. On GitHub, open the lesson's `lesson-DRAFT.txt`, click the pencil icon, make the change, and click **Commit changes**.
2. Open the lesson's preview page (the lesson's address followed by `preview.html`) and check it.
3. When it looks right, copy the draft into `lesson.txt`. Only then do students see the change.

Step-by-step instructions are in [docs/how-to-edit.md](docs/how-to-edit.md).

## What a lesson file looks like

A label is a word in capitals at the start of a line, followed by a colon.
Any line without a label is ordinary lesson text.

```
LESSON: Image Illusions
SUBTITLE: Identifying and Debunking Image Misinformation Online

SECTION: Look at this map

IMAGE: listenbourg.jpg
ALT: A map showing a country called Listenbourg in Europe

Text can include **bold**, *italics* and [links](https://www.lib.uidaho.edu/).

QUESTION: Is this country real?
TYPE: choice
- Yes
- No (correct)
RIGHT: Correct! Listenbourg is not a real country.
```

- Section, quiz and question numbers are added for you. Never type them.
- Three question types: `choice` (one right answer), `select all` and `fill-in`.
- Also available: images with captions and credits, YouTube videos, buttons, boxes, tips, card sets, and explanations that stay hidden until the questions are answered.

The complete list of labels and options is in [docs/docs.md](docs/docs.md).

## Good to know

- **Accessibility.** Lessons are built to meet WCAG 2.1 Level AA. Every image needs an `ALT:` line and every video a `TITLE:` line; the preview page reports any that are missing.
- **Privacy.** A student's progress is saved in their own browser only. The lessons collect nothing, and there are no accounts or grades. Fonts load from Google Fonts and videos from YouTube (privacy-enhanced mode).
- **No build step.** The site is plain files and runs on GitHub Pages or any web host. Nothing needs installing.
- **Videos** play only from a web address, not when a lesson is opened from a computer.
- **Changing the template.** The template's own wording and settings are two labeled lists at the top of `template/lesson-engine.js`; colors are at the top of `template/lesson-theme.css`. Changes there affect every lesson. Anything below those lists needs someone comfortable with JavaScript.

## Documentation

- [docs/how-to-edit.md](docs/how-to-edit.md): step-by-step editing guide for non-coders
- [docs/docs.md](docs/docs.md): full reference for the lesson format and the template
- [docs/context.md](docs/context.md): what this project is for and the requirements it must meet

## License

**TO BE CONFIRMED before this section is final.**

Proposed wording, following common practice for teaching materials:
lesson text and documentation under Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0), and the template code in `template/` under the MIT License.

Images and videos in the lessons belong to their creators, who are named in each lesson's Credits list.
They are not covered by this license.
