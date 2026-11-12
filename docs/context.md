# Project context and requirements

This page explains what the project is for and what it must do.
Read it before proposing a change to the template or to how lessons are made.

## Purpose

The University of Idaho Library offers self-paced workshops that students complete on their own, usually as part of a course.
This repository holds those workshops as web pages, and the template that gives them all the same look and behavior.

The first lesson is *Image Illusions: Identifying and Debunking Image Misinformation Online*, for first-year English Composition students.
It was first built in Articulate Rise by Diane Prorack in 2023 and rebuilt here in 2026.

## Who uses it

| Who | What they need |
|---|---|
| Students | A clear lesson that works on a phone or a laptop, with a keyboard or a screen reader, with no login |
| Lesson authors (librarians) | To fix wording, answers, images and links themselves, without code and without AI |
| Maintainers (library web staff) | A small, readable code base with no build step that they can host and repair |

## Requirements

### 1. Accessibility

- Every lesson meets **WCAG 2.1 Level AA**.
- Every image has a text description; every video has a title and captions.
- Everything works by keyboard alone, with a visible focus outline.
- Text contrast is at least 4.5:1, and color is never the only sign of right or wrong.
- Lessons work at 320 pixels wide without sideways scrolling.

### 2. Editable without code or AI

- All of a lesson's content is in one plain-text file with simple labels.
- Authors never edit HTML, CSS or JavaScript to change a lesson.
- Numbers for sections, quizzes and questions are added automatically, so moving or deleting a part never leaves the numbering wrong.
- A preview page checks the draft and names the line of any mistake.
- A mistake that reaches students shows a short "This part is being updated" note, not a broken page.

### 3. Consistency

- Every lesson uses the same template, so boxes, quizzes, feedback and buttons look and behave the same everywhere.
- The words the template adds (buttons, labels, messages) are in one list, and colors are in another, so each is changed in one place.

### 4. Privacy

- No accounts, no grades, no analytics, no tracking.
- A student's progress is saved in their own browser only and is never sent anywhere.
- Students who need proof of completion take a screenshot of the finish screen.
- Videos use YouTube's privacy-enhanced mode.

### 5. Hosting and upkeep

- The site is plain files with no build step, and runs on GitHub Pages or any static web host.
- No frameworks or installed packages. The only outside resources are web fonts (Google Fonts) and YouTube videos.
- Every change is recorded in the repository's history and can be undone.

### 6. Look

- University of Idaho brand colors: Pride Gold `#F1B300`, black `#191919`, silver `#808080`, white `#FFFFFF`.

## What the project does not do

- It does not record scores or report completion to Canvas or any other system.
- It does not support SCORM or other learning-management-system packaging.
- It does not host videos; they must be on YouTube.
- Changing how the template *works* (new question types, new layouts) needs someone comfortable with JavaScript. Only lesson content and the template's wording, settings and colors are editable without coding.

## Open items

- **License:** not yet confirmed (see the README).
- **University logo:** not used until cleared by University Communications and Marketing.
- **Fonts:** Lato and Merriweather are in use; to be confirmed with the library web team.
- **Accessibility review by a person:** automated checks pass, but a review with a screen reader by someone who uses assistive technology should be recorded here once done.
- **Browsers:** built and tested in Chrome; Firefox and Safari should be checked.
