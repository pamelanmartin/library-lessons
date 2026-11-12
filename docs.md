# Full documentation

The complete reference for the lesson format and the template.
For step-by-step editing instructions, see [how-to-edit.md](how-to-edit.md).
For why the project works this way, see [context.md](context.md).

**Contents**

1. [How the pieces fit together](#1-how-the-pieces-fit-together)
2. [Lesson file basics](#2-lesson-file-basics)
3. [All labels at a glance](#3-all-labels-at-a-glance)
4. [Lesson details](#4-lesson-details)
5. [Sections, quizzes and practices](#5-sections-quizzes-and-practices)
6. [Text formatting](#6-text-formatting)
7. [Images](#7-images)
8. [Videos](#8-videos)
9. [Buttons, boxes and cards](#9-buttons-boxes-and-cards)
10. [Questions](#10-questions)
11. [The finish screen and credits](#11-the-finish-screen-and-credits)
12. [What students experience](#12-what-students-experience)
13. [The preview page and its checks](#13-the-preview-page-and-its-checks)
14. [Template settings, wording and colors](#14-template-settings-wording-and-colors)
15. [Technical specifications](#15-technical-specifications)
16. [Limits](#16-limits)

---

## 1. How the pieces fit together

```
library-lessons/
├── index.html                 front page listing the lessons
├── template/
│   ├── lesson-engine.js       reads a lesson file, checks it, builds the page
│   └── lesson-theme.css       colors, fonts, layout
└── any-lesson-folder/
    ├── lesson-DRAFT.txt       working copy (authors edit this)
    ├── lesson.txt             published copy (students see this)
    ├── preview.html           shows lesson-DRAFT.txt, with a list of problems
    ├── index.html             shows lesson.txt to students
    └── assets/                the lesson's images
```

A lesson's `index.html` and `preview.html` are the same in every lesson.
Each is 16 lines: it names the lesson file to load and links to the engine and theme at `../template/`.
For that reason a lesson folder must sit at the top level of the repository, next to `template/`.

## 2. Lesson file basics

- The file is plain text, saved as UTF-8. Use a plain-text editor or GitHub's editor, not Word.
- A **label** is a word in CAPITALS at the very start of a line, followed by a colon: `SECTION:`, `IMAGE:`, `QUESTION:`.
- A line without a label is ordinary lesson text.
- A blank line ends a paragraph, a list, and the lines that belong to an image, video or question.
- **Detail labels** (such as `ALT:` or `RIGHT:`) must come directly under the item they belong to, with no blank line in between.
- Never type numbers for sections, quizzes or questions. They are added automatically.
- HTML is not interpreted. Anything typed as HTML is shown to students as plain text.
- Any line that starts with capital letters and a colon is read as a label. A line such as `NOTE: bring your ID` is shown as text, but the preview warns that `NOTE:` is not a known label. Reword it (`Note: …`) to avoid the warning.

## 3. All labels at a glance

**Items** start something new.

| Label | What it does | Needs an `END` line? |
|---|---|---|
| `LESSON:` | The lesson's title (required, once, at the top) | No |
| `SUBTITLE:` | A line under the title | No |
| `FROM:` | A line saying who offers the lesson | No |
| `SECTION:` | Starts a content section | No |
| `QUIZ:` | Starts a quiz | No |
| `PRACTICE:` | Starts a hands-on "Your Turn" section | No |
| `HEADING:` | A smaller heading inside a section | No |
| `IMAGE:` | An image from the lesson's `assets` folder | No |
| `VIDEO:` | An embedded YouTube video | No |
| `BUTTON:` | A button that opens a web address | No |
| `BOX:` | A box for tasks and notes | `END BOX` |
| `TIP:` | A box for advice | `END TIP` |
| `AFTER ANSWERS:` | A box hidden until the questions above it are answered | `END AFTER ANSWERS` |
| `CARDS:` | Starts a set of cards | `END CARDS` |
| `CARD:` | One card inside a set | No |
| `QUESTION:` | A question | No |
| `FINISH:` | The finish screen (once, at the end) | `END FINISH` |

**Detail labels** go directly under their item.

| Label | Belongs to | Required? | What it does |
|---|---|---|---|
| `ALT:` | `IMAGE:` | **Yes** | Describes the image for screen-reader users |
| `CAPTION:` | `IMAGE:` | No | Text shown under the image |
| `CREDIT:` | `IMAGE:`, `VIDEO:` | Recommended | Added to the Credits list at the end |
| `PLACE:` | `IMAGE:` | No | `beside text` or `full width` (the default) |
| `TITLE:` | `VIDEO:` | **Yes** | The video's name, announced by screen readers |
| `START:` | `VIDEO:` | No | Where playback starts |
| `STOP:` | `VIDEO:` | No | Where playback stops |
| `TYPE:` | `QUESTION:` | **Yes** | `choice`, `select all` or `fill-in` |
| `HINT:` | `QUESTION:` | No | A small hint shown with the question |
| `ACCEPT:` | `QUESTION:` (fill-in) | **Yes** for fill-ins | Accepted answers, separated by commas |
| `RIGHT:` | `QUESTION:` | Recommended | Message for a correct answer |
| `WRONG:` | `QUESTION:` | No | Message for a wrong try |
| `REVEAL:` | `QUESTION:` (fill-in) | Recommended | Message shown after the last wrong try |

## 4. Lesson details

```
LESSON: Image Illusions
SUBTITLE: Identifying and Debunking Image Misinformation Online
FROM: An interactive workshop from the University of Idaho Library
```

These three lines go at the top, before the first section.
`LESSON:` is required and, with the subtitle, becomes the browser tab's title.
Changing the `LESSON:` title, or renaming the lesson's folder, resets students' saved progress for that lesson.

## 5. Sections, quizzes and practices

```
SECTION: Look at this map
QUIZ: The Mystery Map
PRACTICE: The Whales and the Boat
```

Each starts a new part of the lesson and needs a title after the colon.

| Label | Shown to students as | Numbered |
|---|---|---|
| `SECTION:` | "Section 1" above the title | With practices |
| `PRACTICE:` | "Your Turn: title" | With sections |
| `QUIZ:` | "Quiz #1 — title" | Separately |

All three can hold text, images, videos, boxes, cards and questions.
All text and items must come after the first `SECTION:`, `QUIZ:` or `PRACTICE:` line.

## 6. Text formatting

| To get | Type |
|---|---|
| A new paragraph | A blank line |
| **Bold** | `**like this**` |
| *Italic* | `*like this*` |
| A link | `[words to click](https://web.address)` |
| A bulleted list | Lines starting with `- ` |
| A numbered list | Lines starting with `1. `, `2. ` and so on |

- Links must start with `http://` or `https://`. They always open in a new tab, and screen readers announce "(opens in new tab)".
- A list line can continue on the next line if that line is indented by two or more spaces.
- Formatting works in paragraphs, lists, captions, boxes, cards, questions, choices and feedback messages.
- There are no tables, no colored text and no font choices. This is deliberate: it keeps every lesson consistent and accessible.

## 7. Images

```
IMAGE: listenbourg.jpg
ALT: A map showing a country called Listenbourg in Europe
CAPTION: A map circulating on social media
CREDIT: Listenbourg map: Created by Gaspard Hoelscher (@gaspardooo), posted on Twitter, October 30, 2022.
PLACE: beside text
```

- The file must be in the lesson's `assets` folder. Type the name exactly; capitals matter.
- File names must not contain spaces. Use dashes: `whale-photo.jpg`.
- Any image type a web browser shows will work (`.jpg`, `.png`, `.gif`, `.webp`, `.svg`). JPG suits photographs; PNG suits screenshots.
- Keep files small so lessons load quickly on phones. Around 1,200 pixels wide and under 300 KB is a good target.
- `ALT:` is required. Describe what the image shows and why it matters, in a sentence or two. Do not start with "Image of".
- `PLACE: beside text` puts the image next to the paragraphs that follow it. On phones it stacks above them. Without `PLACE:`, the image is full width.
- Start `CREDIT:` with the item's name and a colon: `CREDIT: Listenbourg map: Created by …`.

## 8. Videos

```
VIDEO: https://www.youtube.com/watch?v=LWLadJFI8Pk
TITLE: In Event of Moon Disaster
START: 4:41
STOP: 6:10
CREDIT: In Event of Moon Disaster: MIT Center for Advanced Virtuality, 2020.
```

- Only YouTube videos are supported. Paste the address from the browser's address bar or the Share button (`youtube.com/watch?v=…`, `youtu.be/…`, `youtube.com/embed/…` and `youtube.com/shorts/…` all work).
- `TITLE:` is required.
- `START:` and `STOP:` are optional. Write them as minutes:seconds (`4:41`), hours:minutes:seconds (`1:02:30`) or a number of seconds (`281`). A note such as "Plays from 4:41 to 6:10." is shown for you.
- A "Video not playing? Watch on YouTube" link is added under every video.
- Videos use YouTube's privacy-enhanced address (`youtube-nocookie.com`).
- Videos play only when the lesson is opened from a web address, not from a file on a computer.
- Check that each video has accurate captions before using it. The template cannot check this.

## 9. Buttons, boxes and cards

### Buttons

```
BUTTON: Find out about this map | https://knowyourmeme.com/memes/listenbourg
```

The words on the button, a `|` bar, then the web address. Buttons open in a new tab.

### Boxes

```
BOX: Your task
Open the link above in a new tab, read about the map, then come back.
END BOX

TIP: When in doubt, do a reverse image search
Even if you can spot some AI tells, a search is more reliable.
END TIP

AFTER ANSWERS: What really happened
Scott Methvin photographed these humpback whales in Alaska in 2015.
END AFTER ANSWERS
```

| Box | Use it for | Notes |
|---|---|---|
| `BOX:` | Tasks and notes | |
| `TIP:` | Advice | |
| `AFTER ANSWERS:` | Explanations that would give away an answer | Hidden until every question above it in that section is answered |

- The title goes after the colon. Titles have no emoji and no period at the end.
- Every box needs its matching `END` line.
- Boxes can hold text, lists, images, videos and buttons. Boxes cannot go inside other boxes or inside cards.
- Only an `AFTER ANSWERS:` box can hold a question. That question appears once the questions above the box are answered.

### Cards

```
CARDS:
CARD: 👤 Who's behind it?
Look up the person or organization that shared it.
CARD: 📄 What's the evidence?
Look for the original source.
END CARDS
```

- Cards sit side by side on wide screens and stack on phones.
- Start every card title with an emoji, and give every card in a set one.
- Cards can hold text and lists. They cannot hold questions or boxes, and a card set cannot go inside a box.

## 10. Questions

Every question starts with `QUESTION:` and needs a `TYPE:` line.
Keep all of a question's lines together, with no blank line inside it.

| Type | Student does | Tries | Marked correct when |
|---|---|---|---|
| `choice` | Picks one answer | Until right | The one `(correct)` choice is picked |
| `select all` | Ticks several answers | Until right | Every `(correct)` choice, and nothing else, is ticked |
| `fill-in` | Types an answer | 3, then the answer is shown | The typed answer contains an accepted word |

`TYPE:` also accepts `multiple choice`, `select all that apply` and `fill in the blank`.

### Multiple choice

```
QUESTION: Is this country real?
TYPE: choice
- Yes
- No (correct)
HINT: Hint: read the article's first paragraph.
RIGHT: Correct! Listenbourg is not a real country.
WRONG: Not quite. Try another answer.
```

- At least two choices, each on its own line starting with `- `.
- Exactly one choice ends with `(correct)`.
- A wrong choice gets a ✗ and can't be picked again.

### Select all that apply

```
QUESTION: Which of these are reverse image search tools?
TYPE: select all
- Google Images (correct)
- TinEye (correct)
- Snopes
RIGHT: Correct! Both search by image.
WRONG: Not quite. Change your choices and try again.
```

- One or more choices end with `(correct)`.
- After a wrong try, "Hint: there are 2 right answers." is added for you.

### Fill-in

```
QUESTION: What is the name of the country shown in the map?
TYPE: fill-in
ACCEPT: listenbourg, listenburg
RIGHT: Correct! The country is called Listenbourg.
WRONG: Not quite. Take another look at the link above.
REVEAL: The answer is Listenbourg. You can keep going.
```

- `ACCEPT:` lists the accepted answers, separated by commas. Include likely misspellings.
- An answer counts if it **contains** any accepted word, so "the Listenbourg map" is accepted. Capitals and punctuation are ignored.
- Because of that, keep accepted words specific. A short word such as `no` would also match "not sure" or "I don't know".
- Students get 3 tries (the number is a template setting). They are not told how many tries remain.
- After the last wrong try, the `REVEAL:` message is shown and the student can continue.
- Use a fill-in only when the answer is one unmistakable word or name. Aim for no more than two or three per lesson.

### Messages

| Line | If you leave it out, students see |
|---|---|
| `RIGHT:` | "Correct!" |
| `WRONG:` (choice) | "Not quite. Try another answer." |
| `WRONG:` (select all) | "Not quite. Change your choices and try again." |
| `WRONG:` (fill-in) | "Not quite. Try again." |
| `REVEAL:` | "The answer is: " followed by the first accepted answer |

A long message can continue on the next line, as long as there is no blank line.

## 11. The finish screen and credits

```
FINISH: You've finished Image Illusions!
IMAGE: careful.jpg
ALT: A cartoon sign reading "Be careful out there"
Be careful out there!
END FINISH
```

- `FINISH:` goes last. Anything after it is not shown.
- It can hold text, an image and buttons.
- Two things are added for you: a note telling students to screenshot the screen if they need proof of completion, and a **Credits** list collecting every `CREDIT:` line in the lesson.

## 12. What students experience

- The lesson is revealed in stages. Students see everything up to and including the next part that has questions. Once every question in that part is answered, a **Continue** button appears and reveals the next stage.
- A part with no questions does not pause the lesson; it is shown together with the part that follows it.
- The finish screen and the Credits list appear when every question is answered.
- If a student answers some questions but skips others, a note names the ones still to answer.
- A progress bar at the top shows how far along they are.
- Progress is saved in the student's browser. On returning, they see "Welcome back!", with buttons to pick up where they left off or start over.
- Saved progress belongs to one browser on one device. It does not follow a student to another device, and private-browsing windows forget it. If the browser blocks saving, the lesson still works.
- Changing a question's wording clears students' saved answer to that question only.
- If a question has a mistake that reached `lesson.txt`, students see "This part is being updated." in its place and can carry on.

## 13. The preview page and its checks

`preview.html` shows `lesson-DRAFT.txt` with a blue "preview" banner.
If it finds problems, a yellow box at the top lists them by line number.
The preview keeps its own saved progress, separate from the students' page.

**Opening it on your own computer:** double-click `preview.html`, click **Choose lesson file…** and pick `lesson-DRAFT.txt` from the same folder.
Images are read from the `assets` folder next to the `preview.html` you opened, so a draft picked from a different folder reports every image as missing.

**Problems that hide the question from students** until fixed:

- A question has no text, no `TYPE:`, or a `TYPE:` the template does not know.
- A `choice` or `select all` question has fewer than two choices, or none marked `(correct)`.
- A `choice` question has more than one choice marked `(correct)`.
- A `fill-in` question has no `ACCEPT:` line.

**Other problems reported:**

- No `LESSON:` line, no sections, or no `FINISH:` screen.
- Text or an item placed before the first section.
- A section, quiz or practice with no title.
- A box, card set or finish screen that was never closed, or an `END` line with nothing open, or the wrong `END` line for the open box.
- A box inside a card set, a card set inside a box, a `CARD:` outside a set, or a question inside a `BOX:`, `TIP:` or card.
- A detail label (such as `ALT:`) separated from its item by a blank line, or under the wrong kind of item.
- An image with no `ALT:`, with spaces in its file name, with a `PLACE:` value that is not `beside text` or `full width`, or whose file is not in `assets`.
- A video whose address is not a YouTube address, with no `TITLE:`, or with a `START:` or `STOP:` that is not a time.
- A `BUTTON:` without a `|` bar and web address.
- A question with no `RIGHT:` line; a fill-in with no `REVEAL:` line or with choices; `ACCEPT:` or `REVEAL:` on a question that is not a fill-in.
- Anything placed after `FINISH:`.
- A label the template does not know, with a "did you mean" suggestion.

The preview does **not** check spelling, whether links work, whether alt text is a good description, or whether a video has captions.

## 14. Template settings, wording and colors

These affect **every** lesson.

| What | Where | How to change it |
|---|---|---|
| Site name; number of fill-in tries | `SETTINGS` list at the top of `template/lesson-engine.js` | Change the value after the colon |
| Every word the template adds (buttons, labels, messages) | `WORDING` list just below it | Change only the words between the quotes |
| Colors and the lesson column's width | The list at the top of `template/lesson-theme.css` | Change the value after the colon |

- A `WORDING` line can be left empty (`''`) to show nothing. The four "tries left" lines are empty on purpose, so students are not told in advance that the answer will be revealed.
- In `WORDING`, keep anything in curly brackets, such as `{n}` or `{title}`. Those are filled in automatically; you may move them within the sentence.
- If you change a color, check that text on it still has a contrast of at least 4.5:1.
- Everything below those lists is the program itself. Changing it needs someone comfortable with JavaScript and CSS.

## 15. Technical specifications

| | |
|---|---|
| **Type of site** | Static files; no server-side code, no database, no build step |
| **Hosting** | GitHub Pages, or any static web host |
| **Engine** | `template/lesson-engine.js`: about 930 lines of plain JavaScript, no libraries or frameworks |
| **Theme** | `template/lesson-theme.css`: about 270 lines of plain CSS, colors defined once as variables |
| **Outside resources** | Google Fonts (Lato, Merriweather); YouTube privacy-enhanced embeds, only in lessons with videos |
| **Data stored** | The student's answers and place in the lesson, in the browser's `localStorage`. Nothing is sent to a server |
| **Cookies, analytics, tracking** | None set by the lessons. YouTube may set its own once a student plays a video |
| **Browsers** | Current versions of Chrome, Edge, Firefox and Safari. Built and tested in Chrome; Firefox and Safari still to be checked |
| **Accessibility target** | WCAG 2.1 Level AA |
| **Screen sizes** | From 320 pixels wide upward |

**How a page loads.** The lesson's `index.html` contains one element, `<div id="lesson-app" data-lesson="lesson.txt">`.
The engine fetches that file, reads it line by line, checks it, and builds the page.
`preview.html` is the same, with `data-lesson="lesson-DRAFT.txt"` and `data-preview="true"`.
An optional `data-assets` attribute names a different images folder (the default is `assets/`).
The lesson file is always fetched fresh, so an edit appears on the next page load.

**Opened from a computer.** Browsers do not let a page opened from a file read other files by itself, so the page shows a **Choose lesson file…** button.

**Saved progress.** One `localStorage` entry per lesson, named from the page's folder address and the lesson's title.
Each answer is stored against a short code made from the question's text.

**Accessibility features built in.** A "Skip to main content" link; one `h1` with headings in order; real buttons, radio buttons and checkboxes; visible focus outlines; feedback messages announced by screen readers; right and wrong shown by symbol and words as well as color; hidden "(opens in new tab)" text on links; a title on every video frame; no motion for people who have asked their device to reduce it.

## 16. Limits

- Videos must be on YouTube.
- No scores are recorded, and nothing is reported to Canvas or any other system.
- No question types beyond the three listed; no drag-and-drop, matching or free-text responses.
- No tables or raw HTML in lesson text.
- Boxes cannot be nested, and questions cannot go in `BOX:`, `TIP:` or cards.
- A lesson is a single page. There is no way to link directly to a later section.
- Each lesson folder must sit at the top level of the repository, beside `template/`.
