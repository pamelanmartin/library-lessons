# How to Edit a Lesson

This guide explains how to change a lesson's wording, questions, answers and
images **without any coding and without Claude.** Everything is in one plain
text file per lesson.

A complete sample that uses every label is in `example-lesson/lesson.txt`.
To start a new lesson, copy the `new-lesson-starter` folder and rename it (the steps are in the [README](../README.md)).
The full reference for every label and option is [docs.md](docs.md).

---

## 1. The big picture

**The same files live in three places.** Knowing which one you are looking at saves a lot of confusion.

| Where | What it is | How you get there |
|---|---|---|
| Your computer | A working copy of the folders, if you downloaded one | Finder (Mac) or File Explorer (Windows) |
| `github.com/pamelanmartin/library-lessons` | The repository: where the files are stored and edited | Log in to GitHub |
| `pamelanmartin.github.io/library-lessons` | The live site students see | Any browser, no login |

A change saved on GitHub shows on the live site about a minute later.
A change made on your computer shows nowhere else until you upload it to GitHub.

**Finding a live address.** Take the folder's name in the repository and add it to the site address:

- Front page: `https://pamelanmartin.github.io/library-lessons/`
- A lesson: `https://pamelanmartin.github.io/library-lessons/image-illusions-workshop/`
- Its preview: `https://pamelanmartin.github.io/library-lessons/image-illusions-workshop/preview.html`

From the repository page you can also click **Settings → Pages → Visit site**.


Each lesson's folder on GitHub has four files you'll care about:

| File | What it is | Do you edit it? |
|---|---|---|
| `lesson-DRAFT.txt` | Your working copy of the lesson | **Yes, edit here** |
| `preview.html` | Shows the draft exactly as students will see it | No, just open it |
| `lesson.txt` | The version students see | Only by pasting in a finished draft |
| `assets/` folder | The lesson's images | Upload or replace images here |

Everything else (the look, the quizzes, the progress bar, saving progress)
is handled by the shared template. You never need to open it.

---

## 2. Making a change, step by step

**Why a draft and a preview?** So students never see a mistake while you're working.
The routine is:

1. Make the change in `lesson-DRAFT.txt` on GitHub.
2. Open the preview page to see how it looks. If you made a mistake, such as a missing
   correct answer or a misspelled image name, a yellow box at the top names the line to fix.
3. When it looks right, copy the draft into `lesson.txt`. Only then do students see the change.

The detailed steps:

1. On GitHub, open **`lesson-DRAFT.txt`** and click the **pencil icon** (Edit).
2. Make your change. Click **Commit changes** (this means "save").
3. Wait about a minute, then open the **preview page**:
   https://pamelanmartin.github.io/library-lessons/image-illusions-workshop/preview.html
   (the students' page is the same address without `preview.html`).
   - If something is wrong, a yellow box at the top says what and on which line.
   - Fix it in the draft and save again.
4. When the preview looks right, copy the draft over to the student version:
   1. Open `lesson-DRAFT.txt` and click the **Copy raw file** button (two overlapping squares).
   2. Open `lesson.txt`, click the **pencil icon**.
   3. Select everything (⌘A), paste (⌘V).
   4. Click **Commit changes**. Students see the change within about a minute.

**Previewing on your own computer (optional):** double-click `preview.html` in the
lesson's folder. Because it was opened from your computer, it shows a
**Choose lesson file…** button: click it and pick `lesson-DRAFT.txt` from the same
folder. The preview, with its list of problems, appears as usual. (Browsers only let
a page read files you pick yourself, which is why the button is needed.)

**Pick the draft from the same folder as the preview page.** The preview looks for images
in the `assets` folder next to itself. If you open one lesson's `preview.html` and pick
another lesson's draft, every image is reported as "not found" even though nothing is wrong.
The file window reopens in the folder you used last, so check the folder name before picking.

**Changing an image:** open the `assets` folder, click **Add file → Upload files**,
and upload the new picture. If it has the **same name** as the old one, it simply
replaces it. If it has a new name, also change the `IMAGE:` line in the draft.
Use file names with no spaces (e.g. `bullfrog-2.jpg`).

---

## 3. The basic rules

- A **label** is a word in CAPITALS at the very start of a line, followed by a colon:
  `SECTION:`  `QUESTION:`  `IMAGE:` …
- Any line **without** a label is ordinary lesson text.
- A **blank line** starts a new paragraph.
- Bold: `**like this**`  Italic: `*like this*`
- Link: `[words to click](https://web.address)` (links always open in a new tab)
- Bulleted list: start lines with `- `   Numbered list: start lines with `1. `, `2. `…
- **Never type numbers** for sections, quizzes or questions. They are added automatically,
  so moving or deleting a question never leaves the numbering wrong.
- Upper or lower case in answers doesn't matter.

---

## 4. Every label

### Lesson details (top of the file, once)
```
LESSON: Image Illusions
SUBTITLE: Identifying and Debunking Image Misinformation Online
FROM: An interactive workshop from the University of Idaho Library
```

### Sections and quizzes
```
SECTION: Look at this map        ← starts a new section ("Section 1" is added for you)
QUIZ: The Mystery Map            ← starts a quiz ("Quiz #1 —" is added for you)
PRACTICE: The Whales and the Boat  ← a hands-on "Your Turn" section
```
Students must answer every question in a section, quiz or practice before the
**Continue** button appears. Sections, practices and the wrap-up are all numbered
(Section 1, Section 2 …); quizzes are numbered separately (Quiz #1, Quiz #2 …).

### Smaller headings inside a section
```
HEADING: Spotting AI-Generated Images
```

### Images
```
IMAGE: listenbourg.jpg
ALT: A map showing a country called Listenbourg in Europe
CAPTION: A map circulating on social media
CREDIT: Listenbourg map: Created by Gaspard Hoelscher (@gaspardooo), posted on Twitter, October 30, 2022.
PLACE: beside text
```
- `ALT:` is **required**. It describes the image for students using screen readers.
- `CAPTION:` is optional (shown under the image).
- `CREDIT:` is optional but recommended. **Start it with the item's name**, then a colon
  (e.g. `CREDIT: Listenbourg map: Created by …`). All credits are collected into the
  Credits list at the end of the lesson automatically.
- `PLACE:` is optional. `beside text` puts the image next to the paragraphs that
  follow it (on phones it stacks above them). Leave it out for full width.

### Buttons
```
BUTTON: Find out about this map | https://knowyourmeme.com/memes/listenbourg
```
Words on the button, then a `|` bar, then the web address.

### Boxes (three kinds, each always looks the same)
```
BOX: Your task
Open the link above in a new tab, read about the map, then come back.
END BOX
```
```
TIP: When in doubt, do a reverse image search
Even if you can spot some AI tells, ...
END TIP
```
```
AFTER ANSWERS: What really happened
Scott Methvin photographed these humpback whales in Alaska in 2015 ...
END AFTER ANSWERS
```
- `BOX` is for tasks and notes. `TIP` is for advice.
- `AFTER ANSWERS` stays hidden until every question above it in that section is answered.
  Use it for "What really happened" explanations that would give away an answer.
- An `AFTER ANSWERS` box can also hold a question. It then appears only after the
  questions above it are answered (the wrap-up uses this: a review list, then a final check).
  Questions can't go inside `BOX` or `TIP`.
- Every box needs its matching `END` line.
- **Title rule:** box titles have **no emoji and no period at the end**. The box's color
  already tells students what kind of box it is.

### Videos
```
VIDEO: https://www.youtube.com/watch?v=LWLadJFI8Pk
TITLE: In Event of Moon Disaster
START: 4:41
CREDIT: In Event of Moon Disaster: MIT Center for Advanced Virtuality, 2020.
```
- The video plays inside the page. A "Watch on YouTube" link is added under it
  automatically, in case it won't play for a student.
- `TITLE:` is required (screen readers announce it).
- `START:` and `STOP:` are optional (minutes:seconds). Leave out `STOP:` to play to the end.

### Card sets
```
CARDS:
CARD: 👤 Who's behind it?
Look up the person or organization that shared it.
CARD: 📄 What's the evidence?
...
END CARDS
```
- All cards look the same everywhere: an emoji, a title, and text.
- **Title rule:** start every card title with an emoji (e.g. `CARD: 🔎 Google Images`),
  and give every card in a set one.
- Cards sit side by side on wide screens and stack on phones.

### End of the lesson
```
FINISH: You've finished Image Illusions!
IMAGE: careful.jpg
ALT: ...
Be careful out there!
END FINISH
```
The "screenshot this screen as proof" note and the Credits list are added for you.

---

## 5. Questions

Every question starts with `QUESTION:` and needs a `TYPE:` line.
`RIGHT:` is the message for a correct answer. `WRONG:` is the message for a wrong try.
`WRONG:` is **optional**: write one when a nudge would help (e.g. "Look for a fact-check
of the image."). Without one, students see "Not quite. Try another answer." (or, for
select all, "Not quite. Change your choices and try again.").

### Multiple choice (one right answer)
```
QUESTION: Is this country real?
TYPE: choice
- Yes
- No (correct)
RIGHT: Correct! Listenbourg is not a real country.
WRONG: Not quite. Try another answer.
```
- Put `(correct)` after the right choice.
- Optional: a `HINT:` line shows a small hint under the choices, e.g.
  `HINT: Hint: the answer appears around the 2:50 mark.` (works for every question type).
- A wrong choice gets a ✗ and can't be picked again; the student keeps trying until right.

### Select all that apply (more than one right answer)
```
QUESTION: Which of these are reverse image search tools?
TYPE: select all
- Google Images (correct)
- TinEye (correct)
- Snopes
- FactCheck.org
RIGHT: Correct! ...
WRONG: Not quite. Change your choices and try again.
```
The student keeps trying until every right choice (and nothing else) is selected.
After a wrong try, "Hint: there are 2 right answers." is added for you.

### Fill-in (student types the answer)
```
QUESTION: What is the name of the country shown in the map?
TYPE: fill-in
ACCEPT: listenbourg
RIGHT: Correct! The country is called Listenbourg.
WRONG: Not quite. Take another look at the link above.
REVEAL: The answer is Listenbourg. You can keep going.
```
- `ACCEPT:` lists the accepted words, separated by commas: `ACCEPT: grok, ai, artificial intelligence`
- Keep a question's lines together: no blank lines inside a question.
- An answer counts if it **contains** any accepted word. Capitals and punctuation are ignored.
- Students get **3 tries**. They are not told how many are left.
  After the 3rd wrong try, the `REVEAL:` message is shown and they can continue.

**When to use a fill-in:** only when the answer is **one unmistakable word or name**
that the student has just found (like "Listenbourg" or "Grok"). Otherwise use
multiple choice. Aim for **no more than 2–3 fill-ins per lesson.**

---

## 6. If something goes wrong

The preview page checks the draft and lists problems in a yellow box, for example:

- *Line 42: this QUESTION has no TYPE line. Add `TYPE: choice`, `TYPE: select all` or `TYPE: fill-in`.*
- *Line 57: no choice is marked (correct).*
- *Line 80: IMAGE "bullfrog2.jpg" was not found in the assets folder.*
- *Line 91: BOX was never closed. Add `END BOX`.*
- *Line 12: IMAGE has no ALT line.*

**Every image is "not found" when previewing on your computer?** You probably picked a draft
from a different folder than the `preview.html` you opened. See "Previewing on your own computer" in section 2.

Students never see these messages, because they only see `lesson.txt`.
If a mistake ever reaches `lesson.txt`, students see that section with a short
"This part is being updated" note instead of a broken page.

**Undoing a change:** every save is kept by GitHub. Open the file, click
**History**, pick an earlier version, and copy its text back in.

---

---

## 7. Changing the template's own words or settings

The words the template adds to every lesson (buttons like **Check** and **Continue →**,
"Section 1", "Quiz #1 —", "Welcome back!", the finish-screen note, and so on) are all in
**one list at the top of `template/lesson-engine.js`**, called `WORDING`. Next to it is
`SETTINGS` (the site name and the number of fill-in tries).

To change one: open `lesson-engine.js` in a plain-text editor (on GitHub, the pencil icon),
find the line, and change **only the words between the quotes**. Keep anything in curly
brackets, like `{n}` or `{title}`: those are filled in automatically.

```
checkButton:      'Check',          ← change Check to Submit, for example
sectionLabel:     'Section {n}',    ← {n} becomes the section number
```

A change here affects **every lesson** that uses the template. Everything below those two
lists is the program itself; changing it needs someone comfortable with JavaScript.

Colors are listed once, with notes, at the top of `template/lesson-theme.css`.
