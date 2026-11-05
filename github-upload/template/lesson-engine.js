/* ==================================================================
   LESSON ENGINE — turns a lesson text file into an interactive lesson
   University of Idaho Library lesson template
   ------------------------------------------------------------------
   You never need to edit this file to change a lesson's content.
   Everything a lesson says lives in its lesson.txt file.

   The only parts meant to be changed by hand are the two lists below:
     SETTINGS — how the template behaves (e.g. number of tries)
     WORDING  — every word the template adds to a lesson (buttons, labels,
                messages). Change the text between the quotes only.
                {n}, {title}, {start} etc. are filled in automatically:
                keep them, but you can move them around.
   Everything below those lists is the program itself. Changing it needs
   someone comfortable with JavaScript.
================================================================== */
(function () {
  'use strict';

  // ================= SETTINGS =================
  const SETTINGS = {
    siteName: 'University of Idaho Library',   // shown in the header and footer
    maxTries: 3                                // fill-in tries before the answer is shown
  };

  // ================= WORDING ==================
  // Every word the template adds to a lesson. (A lesson's own text is in its lesson.txt.)
  const WORDING = {
    // Page parts
    skipLink:         'Skip to main content',
    progressLabel:    'Lesson progress',
    sectionLabel:     'Section {n}',
    quizHeading:      'Quiz #{n} — {title}',
    practiceHeading:  'Your Turn: {title}',
    // Buttons
    checkButton:      'Check',
    continueButton:   'Continue →',
    fillinPlaceholder:'Type your answer…',
    // After a section's questions are all answered
    continueMessage:  "Great work! When you're ready, move on to the next section.",
    // A student answered some questions in a section but skipped others
    almostThere:      'Almost there! Answer {questions} above ↑ to continue.',
    and:              'and',
    // Messages on questions (used when a question has no RIGHT: or WRONG: line of its own)
    defaultRight:       'Correct!',
    defaultWrongChoice: 'Not quite. Try another answer.',
    defaultWrongSelect: 'Not quite. Change your choices and try again.',
    defaultWrongFillin: 'Not quite. Try again.',
    defaultReveal:      'The answer is: {answer}.',
    selectAllHint:      'Hint: there are {n} right answers.',
    triesLeft:          '({n} tries left before we show the answer.)',
    oneTryLeft:         '(1 try left before we show the answer.)',
    triesLeftRestored:  'You have {n} tries left on this question.',
    oneTryLeftRestored: 'You have 1 try left on this question.',
    pleaseType:         'Please type an answer before checking.',
    pleaseChoose:       'Please choose an answer.',
    pleaseChooseSome:   'Please choose at least one answer.',
    // Videos
    videoPlaysFromTo: 'Plays from {start} to {stop}.',
    videoStartsAt:    'Starts at {start}.',
    videoBackup:      'Video not playing?',
    videoBackupLink:  'Watch on YouTube',
    // Links that open a new tab (read aloud by screen readers only)
    opensNewTab:      '(opens in new tab)',
    // Finish screen and credits
    finishDefaultTitle: "You've finished!",
    screenshotNote:   '<strong>Need proof you finished?</strong> If your instructor asked for proof of completion, take a screenshot of this screen.',
    creditsHeading:   'Credits',
    creditsToggle:    'Image and video sources',
    creditsNote:      'Images and videos are used for educational purposes. All rights belong to their creators.',
    // Saved progress
    welcomeBack:      '<strong>Welcome back!</strong> This browser remembered where you left off, so your earlier answers are filled in below.',
    resumeButton:     'Pick up where I left off ↓',
    startOverLong:    'Start over from the beginning',
    startOverShort:   'Start over',
    startOverConfirm: 'Start over? This clears all your answers in this browser.',
    savedNote:        'Your place in the lesson is saved in this browser only. Nothing is sent to anyone.',
    // A question with a mistake in it (students see this instead of the question)
    beingUpdated:     'This part is being updated.'
  };
  // ============================================

  // Fill in {placeholders}: say('Section {n}', { n: 3 }) -> 'Section 3'
  function words(key, values) {
    return String(WORDING[key]).replace(/\{(\w+)\}/g, (m, k) => (values && values[k] != null ? values[k] : m));
  }

  const app = document.getElementById('lesson-app');
  if (!app) return;
  const PREVIEW = app.dataset.preview === 'true';
  let LESSON_FILE = app.dataset.lesson || 'lesson.txt';
  const ASSETS = app.dataset.assets || 'assets/';
  const EMBEDDED_IMAGES = window.LESSON_IMAGES || null; // used by the single-file review copy

  // =================================================================
  // 1. READING THE LESSON FILE
  // =================================================================
  const ITEM_LABELS = ['LESSON', 'SUBTITLE', 'FROM', 'SECTION', 'QUIZ', 'PRACTICE', 'HEADING', 'IMAGE', 'BUTTON',
    'BOX', 'TIP', 'AFTER ANSWERS', 'CARDS', 'CARD', 'VIDEO', 'QUESTION', 'FINISH'];
  const DETAIL_LABELS = { // label -> which items it belongs to
    'ALT': ['image'], 'CAPTION': ['image'], 'CREDIT': ['image', 'video'], 'PLACE': ['image'],
    'TITLE': ['video'], 'START': ['video'], 'STOP': ['video'],
    'TYPE': ['question'], 'HINT': ['question'], 'ACCEPT': ['question'], 'RIGHT': ['question'], 'WRONG': ['question'], 'REVEAL': ['question']
  };
  const BOX_KINDS = { 'BOX': 'box', 'TIP': 'tip', 'AFTER ANSWERS': 'after' };
  const ALL_LABELS = ITEM_LABELS.concat(Object.keys(DETAIL_LABELS));

  function parse(text) {
    const problems = [];
    const problem = (line, msg) => problems.push({ line, msg });
    const doc = { meta: {}, units: [], finish: null };
    const lines = text.replace(/\r\n?/g, '\n').split('\n');

    let unit = null;          // current SECTION / QUIZ / PRACTICE
    let container = null;     // where blocks go (unit, box, card, finish)
    let box = null;           // open BOX / TIP / AFTER ANSWERS
    let cards = null;         // open CARDS set
    let card = null;          // current CARD
    let item = null;          // open image / video / question (takes detail lines)
    let lastDetail = null;    // for continuation lines in questions
    let para = null;          // paragraph being collected
    let list = null;          // list being collected

    const endText = () => { para = null; list = null; };
    const endItem = () => { item = null; lastDetail = null; };
    const target = () => {
      if (card) return card.blocks;
      if (box) return box.blocks;
      if (container) return container.blocks;
      return null;
    };
    const add = (block, lineNo) => {
      const t = target();
      if (!t) { problem(lineNo, 'This line comes before the first <code>SECTION:</code>, <code>QUIZ:</code> or <code>PRACTICE:</code>. Move it below one, or start a section above it.'); return false; }
      t.push(block); return true;
    };

    lines.forEach((raw, i) => {
      const n = i + 1;
      const line = raw.replace(/\s+$/, '');
      const trimmed = line.trim();

      // ---- blank line ----
      if (trimmed === '') { endText(); endItem(); return; }

      // ---- END lines ----
      const endMatch = trimmed.match(/^END\s+(BOX|TIP|AFTER ANSWERS|CARDS|FINISH)\s*:?$/i);
      if (endMatch) {
        const what = endMatch[1].toUpperCase();
        endText(); endItem();
        if (what === 'CARDS') {
          if (!cards) problem(n, '<code>END CARDS</code> found, but no <code>CARDS:</code> was open.');
          cards = null; card = null;
        } else if (what === 'FINISH') {
          if (!doc.finish || container !== doc.finish) problem(n, '<code>END FINISH</code> found, but no <code>FINISH:</code> was open.');
          container = null;
        } else {
          if (!box) problem(n, '<code>END ' + what + '</code> found, but no <code>' + what + ':</code> was open.');
          else if (box.label !== what) problem(n, 'This says <code>END ' + what + '</code>, but the open box is a <code>' + box.label + ':</code> (line ' + box.line + '). Change it to <code>END ' + box.label + '</code>.');
          box = null;
        }
        return;
      }

      // ---- labels ----
      const m = trimmed.match(/^([A-Z][A-Z ]*[A-Z]|[A-Z])\s*:\s?(.*)$/);
      const label = m ? m[1] : null;
      const value = m ? m[2].trim() : '';
      if (m && ALL_LABELS.indexOf(label) === -1) {
        // Looks like a label but isn't one we know. Treat as text, but warn.
        const guess = ALL_LABELS.find(l => l.startsWith(label.slice(0, 3)));
        problem(n, '<code>' + label + ':</code> isn\'t a label the template knows' + (guess ? ' (did you mean <code>' + guess + ':</code>?)' : '') + '. It is shown as ordinary text. If that\'s what you want, you can ignore this.');
      }
      if (m && ALL_LABELS.indexOf(label) !== -1) {
        endText();
        // Detail labels attach to the open item
        if (DETAIL_LABELS[label]) {
          if (!item || DETAIL_LABELS[label].indexOf(item.kind) === -1) {
            const owner = DETAIL_LABELS[label].map(k => '<code>' + ({ image: 'IMAGE', video: 'VIDEO', question: 'QUESTION' })[k] + ':</code>').join(' or ');
            problem(n, '<code>' + label + ':</code> must come directly under its ' + owner + ' line, with no blank line in between.');
            return;
          }
          const key = label.toLowerCase();
          if (key === 'accept') item.accept = value.split(',').map(s => s.trim()).filter(Boolean);
          else item[key] = value;
          item.lines[key] = n;
          lastDetail = key;
          return;
        }
        endItem();
        switch (label) {
          case 'LESSON': case 'SUBTITLE': case 'FROM':
            doc.meta[label.toLowerCase()] = value; return;
          case 'SECTION': case 'QUIZ': case 'PRACTICE':
            if (box) { problem(box.line, 'This <code>' + box.label + ':</code> was never closed. Add <code>END ' + box.label + '</code> after its text.'); box = null; }
            if (cards) { problem(cards.line, 'This <code>CARDS:</code> set was never closed. Add <code>END CARDS</code> after the last card.'); cards = null; card = null; }
            if (doc.finish && container === doc.finish) { problem(doc.finish.line, 'This <code>FINISH:</code> was never closed. Add <code>END FINISH</code>.'); }
            if (doc.finish) problem(n, 'This comes after the <code>FINISH:</code> screen. Lesson parts after FINISH are not shown; move it above FINISH.');
            if (!value) problem(n, '<code>' + label + ':</code> needs a title after the colon.');
            unit = { kind: label.toLowerCase(), title: value, line: n, blocks: [] };
            doc.units.push(unit); container = unit; return;
          case 'FINISH':
            if (box || cards) problem(n, 'Close the open box or card set before <code>FINISH:</code>.');
            box = null; cards = null; card = null;
            doc.finish = { title: value, line: n, blocks: [] }; container = doc.finish; return;
          case 'HEADING':
            add({ kind: 'heading', text: value, line: n }, n); return;
          case 'IMAGE':
            item = { kind: 'image', file: value, line: n, lines: {} };
            if (!value) problem(n, '<code>IMAGE:</code> needs the image\'s file name, e.g. <code>IMAGE: bullfrog.jpg</code>.');
            add(item, n); return;
          case 'VIDEO':
            item = { kind: 'video', url: value, line: n, lines: {} };
            add(item, n); return;
          case 'BUTTON': {
            const parts = value.split('|');
            if (parts.length < 2 || !parts[1].trim()) { problem(n, '<code>BUTTON:</code> needs the words, a <code>|</code> bar, then the web address. Example: <code>BUTTON: Open TinEye | https://tineye.com</code>'); return; }
            add({ kind: 'button', text: parts[0].trim(), url: parts.slice(1).join('|').trim(), line: n }, n); return;
          }
          case 'BOX': case 'TIP': case 'AFTER ANSWERS':
            if (box) { problem(n, 'A new <code>' + label + ':</code> starts before the <code>' + box.label + ':</code> on line ' + box.line + ' was closed. Add <code>END ' + box.label + '</code> above this line.'); box = null; }
            if (cards) { problem(n, 'Boxes can\'t go inside a <code>CARDS:</code> set. Close it first with <code>END CARDS</code>.'); return; }
            { const b = { kind: 'box', box: BOX_KINDS[label], label, title: value, line: n, blocks: [] };
              if (add(b, n)) box = b; }
            return;
          case 'CARDS':
            if (box) { problem(n, 'Card sets can\'t go inside a box. Close the box first with <code>END ' + box.label + '</code>.'); return; }
            if (cards) problem(n, 'A new <code>CARDS:</code> starts before the one on line ' + cards.line + ' was closed. Add <code>END CARDS</code> above this line.');
            { const c = { kind: 'cards', line: n, cards: [] }; card = null;
              if (add(c, n)) cards = c; }
            return;
          case 'CARD':
            if (!cards) { problem(n, '<code>CARD:</code> must be inside a card set. Put <code>CARDS:</code> above the first card and <code>END CARDS</code> after the last.'); return; }
            card = { title: value, line: n, blocks: [] }; cards.cards.push(card); return;
          case 'QUESTION':
            item = { kind: 'question', text: value, line: n, choices: [], accept: [], lines: {} };
            if (cards) { problem(n, 'Questions can\'t go inside cards. Close the card set first with <code>END CARDS</code>.'); item = null; return; }
            if (box && box.box !== 'after') { problem(n, 'Questions can\'t go inside a <code>' + box.label + ':</code>. Close it first with <code>END ' + box.label + '</code>.'); item = null; return; }
            add(item, n); return;
        }
        return;
      }

      // ---- not a label ----
      // Inside a question: choices and continuation lines
      if (item && item.kind === 'question') {
        const ch = trimmed.match(/^[-•*]\s+(.*)$/);
        if (ch) {
          let t = ch[1]; let correct = false;
          if (/\(\s*correct\s*\)\s*$/i.test(t)) { correct = true; t = t.replace(/\s*\(\s*correct\s*\)\s*$/i, ''); }
          item.choices.push({ text: t, correct, line: n }); lastDetail = 'choice'; return;
        }
        if (lastDetail && lastDetail !== 'choice' && lastDetail !== 'accept' && typeof item[lastDetail] === 'string') { item[lastDetail] += ' ' + trimmed; return; }
        if (!lastDetail) { item.text += ' ' + trimmed; return; }
        problem(n, 'This line is inside a question but doesn\'t start with a label or <code>- </code>. Did you mean to leave a blank line above it?');
        return;
      }
      endItem();
      // Lists
      const bullet = trimmed.match(/^[-•*]\s+(.*)$/);
      const numbered = trimmed.match(/^\d+[.)]\s+(.*)$/);
      if (bullet || numbered) {
        para = null;
        const ordered = !!numbered;
        if (!list || list.ordered !== ordered) { list = { kind: 'list', ordered, items: [], line: n }; if (!add(list, n)) list = null; }
        if (list) list.items.push((bullet || numbered)[1]);
        return;
      }
      if (list && /^\s{2,}/.test(raw)) { list.items[list.items.length - 1] += ' ' + trimmed; return; } // indented = same item
      list = null;
      if (para) { para.text += ' ' + trimmed; return; }
      para = { kind: 'para', text: trimmed, line: n };
      if (!add(para, n)) para = null;
    });

    if (box) problem(box.line, 'This <code>' + box.label + ':</code> was never closed. Add <code>END ' + box.label + '</code> after its text.');
    if (cards) problem(cards.line, 'This <code>CARDS:</code> set was never closed. Add <code>END CARDS</code> after the last card.');
    if (!doc.meta.lesson) problem(1, 'The file has no <code>LESSON:</code> line. Add one at the top, e.g. <code>LESSON: Image Illusions</code>.');
    if (!doc.units.length) problem(1, 'The lesson has no <code>SECTION:</code>, <code>QUIZ:</code> or <code>PRACTICE:</code> yet.');
    if (!doc.finish) problem(lines.length, 'The lesson has no <code>FINISH:</code> screen at the end. Students won\'t see a "you\'re done" message.');

    // ---- check every question and item ----
    const walk = (blocks, fn) => blocks.forEach(b => {
      fn(b);
      if (b.blocks) walk(b.blocks, fn);
      if (b.cards) b.cards.forEach(c => walk(c.blocks, fn));
    });
    doc.units.concat(doc.finish ? [doc.finish] : []).forEach(u => walk(u.blocks, b => {
      if (b.kind === 'question') checkQuestion(b, problem);
      if (b.kind === 'image') {
        if (!b.alt) { problem(b.line, 'This <code>IMAGE:</code> has no <code>ALT:</code> line. Add one right under it describing the picture (students using screen readers depend on it).'); }
        if (b.place && !/^(beside text|full width)$/i.test(b.place)) problem(b.lines.place, '<code>PLACE:</code> can be <code>beside text</code> or <code>full width</code>.');
        if (/\s/.test(b.file)) problem(b.line, 'The image file name <code>' + esc(b.file) + '</code> has spaces. Rename the file without spaces (e.g. with dashes) and update this line.');
      }
      if (b.kind === 'video') {
        b.id = youTubeId(b.url);
        if (!b.id) problem(b.line, '<code>VIDEO:</code> needs a YouTube address, e.g. <code>VIDEO: https://www.youtube.com/watch?v=LWLadJFI8Pk</code>.');
        if (!b.title) problem(b.line, 'This <code>VIDEO:</code> has no <code>TITLE:</code> line. Add one right under it (screen readers announce it).');
        ['start', 'stop'].forEach(k => { if (b[k] != null && toSeconds(b[k]) == null) problem(b.lines[k], '<code>' + k.toUpperCase() + ':</code> should be minutes:seconds, e.g. <code>1:25</code>.'); });
      }
    }));
    return { doc, problems };
  }

  function checkQuestion(q, problem) {
    q.bad = false;
    const bad = msg => { problem(q.line, msg); q.bad = true; };
    if (!q.text) bad('<code>QUESTION:</code> needs the question after the colon.');
    const type = (q.type || '').toLowerCase().replace(/[^a-z]/g, '');
    q.qtype = { choice: 'choice', multiplechoice: 'choice', selectall: 'select', selectallthatapply: 'select', fillin: 'fillin', fillintheblank: 'fillin' }[type];
    if (!q.type) return bad('This <code>QUESTION:</code> has no <code>TYPE:</code> line. Add <code>TYPE: choice</code>, <code>TYPE: select all</code> or <code>TYPE: fill-in</code> under it.');
    if (!q.qtype) return bad('<code>TYPE: ' + esc(q.type) + '</code> isn\'t a type the template knows. Use <code>choice</code>, <code>select all</code> or <code>fill-in</code>.');
    const nCorrect = q.choices.filter(c => c.correct).length;
    if (q.qtype === 'fillin') {
      if (!q.accept.length) bad('This fill-in question has no <code>ACCEPT:</code> line. Add the accepted answers, separated by commas.');
      if (q.choices.length) problem(q.line, 'This fill-in question also has choices (lines starting with <code>- </code>). Fill-ins don\'t use choices, so they are ignored. Did you mean <code>TYPE: choice</code>?');
      if (!q.reveal) problem(q.line, 'This fill-in question has no <code>REVEAL:</code> line (shown after ' + SETTINGS.maxTries + ' wrong tries). For now it will say "The answer is: ' + esc(q.accept[0] || '') + '."');
    } else {
      if (q.choices.length < 2) bad('This question needs at least two choices, each on its own line starting with <code>- </code>.');
      else if (nCorrect === 0) bad('No choice is marked correct. Add <code>(correct)</code> after the right choice.');
      else if (q.qtype === 'choice' && nCorrect > 1) bad('More than one choice is marked <code>(correct)</code>. For more than one right answer, use <code>TYPE: select all</code>.');
      if (q.accept.length) problem(q.lines.accept, '<code>ACCEPT:</code> is only used by fill-in questions, so it is ignored here.');
      if (q.reveal) problem(q.lines.reveal, '<code>REVEAL:</code> is only used by fill-in questions, so it is ignored here.');
    }
    if (!q.right) problem(q.line, 'This question has no <code>RIGHT:</code> line. Students will just see "' + esc(WORDING.defaultRight) + '"');
  }

  // =================================================================
  // 2. SMALL HELPERS
  // =================================================================
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]); }
  // **bold**, *italic*, [link](https://...)
  function inline(s) {
    let h = esc(s);
    h = h.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (m, t, u) =>
      '<a href="' + u + '" target="_blank" rel="noopener noreferrer">' + t + newTabNote() + '</a>');
    h = h.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    h = h.replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\*)/g, '$1<em>$2</em>');
    return h;
  }
  function newTabNote() { return '<span class="visually-hidden"> ' + esc(WORDING.opensNewTab) + '</span>'; }
  function plain(s) { return String(s || '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\*/g, ''); }
  function normalize(s) {
    return String(s || '').toLowerCase().replace(/[‘’“”]/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  }
  function youTubeId(u) {
    const m = String(u || '').match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
  }
  function toSeconds(t) {
    const m = String(t || '').trim().match(/^(?:(\d+):)?(\d{1,2}):(\d{2})$|^(\d+)$/);
    if (!m) return null;
    if (m[4]) return +m[4];
    return (+(m[1] || 0)) * 3600 + (+m[2]) * 60 + (+m[3]);
  }
  function splitEmoji(title) {
    const m = String(title || '').match(/^((?:\p{Extended_Pictographic}|\p{Regional_Indicator})(?:️|‍|\p{Extended_Pictographic}|\p{Emoji_Modifier})*)\s*(.*)$/u);
    return m ? { icon: m[1], text: m[2] } : { icon: '', text: title };
  }
  // A short code made from a question's text, used to remember its answer
  function hash(s) {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  }
  function el(tag, attrs, html) {
    const e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(k => { if (attrs[k] != null && attrs[k] !== false) e.setAttribute(k, attrs[k]); });
    if (html != null) e.innerHTML = html;
    return e;
  }
  function imgSrc(file) { return (EMBEDDED_IMAGES && EMBEDDED_IMAGES[file]) || (ASSETS + file); }

  // =================================================================
  // 3. BUILDING THE PAGE
  // =================================================================
  const questions = [];   // every question in order
  const units = [];       // rendered units
  const credits = [];
  let problemsList = [];
  let storageKey = null;
  let state = { continued: 0, q: {} };
  let restoring = false;
  let wasFinished = null;   // null until the page is first drawn

  function build(doc, problems) {
    problemsList = problems;
    const title = doc.meta.lesson || 'Lesson';
    document.title = title + (doc.meta.subtitle ? ': ' + doc.meta.subtitle : '');
    storageKey = (PREVIEW ? 'lesson-preview:' : 'lesson:') + location.pathname.replace(/[^/]*$/, '') + title;

    document.body.innerHTML = '';
    document.body.appendChild(el('a', { href: '#main-content', class: 'skip-link' }, esc(WORDING.skipLink)));
    if (PREVIEW) document.body.appendChild(el('div', { class: 'preview-banner', role: 'note' },
      '<strong>PREVIEW</strong> of <code>' + esc(LESSON_FILE) + '</code>. Students don\'t see this page. Answers here are remembered separately from the student page.'));
    const header = el('header', { class: 'site-header' },
      '<div class="logo-bar" aria-hidden="true"></div><div><h1>' + esc(title) + '</h1><p class="subtitle">' + esc(SETTINGS.siteName) + '</p></div>');
    document.body.appendChild(header);
    const prog = el('div', { class: 'progress-bar-wrap', role: 'progressbar', 'aria-valuenow': '5', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-label': WORDING.progressLabel }, '<div class="progress-bar-fill"></div>');
    document.body.appendChild(prog);
    const main = el('main', { id: 'main-content', tabindex: '-1' });
    document.body.appendChild(main);

    if (PREVIEW) main.appendChild(renderProblems());
    const banner = el('div', { class: 'resume-banner', role: 'status', hidden: '' },
      '<p>' + WORDING.welcomeBack + '</p>' +
      '<div class="resume-actions"><button type="button" class="btn-continue" data-act="resume">' + esc(WORDING.resumeButton) + '</button>' +
      '<button type="button" class="btn-text" data-act="startover">' + esc(WORDING.startOverLong) + '</button></div>');
    main.appendChild(banner);
    main.appendChild(el('div', { class: 'course-intro' },
      (doc.meta.subtitle ? '<h2>' + inline(doc.meta.subtitle) + '</h2>' : '') + (doc.meta.from ? '<p>' + inline(doc.meta.from) + '</p>' : '')));

    // Units and their numbering
    let sectionNo = 0, quizNo = 0;
    doc.units.forEach((u, ui) => {
      const isQuiz = u.kind === 'quiz';
      if (!isQuiz) sectionNo++; else quizNo++;
      const sec = el('section', { class: 'unit unit-' + u.kind, 'aria-labelledby': 'u' + ui + '-h', id: 'unit-' + (ui + 1) });
      if (!isQuiz) sec.appendChild(el('span', { class: 'unit-label' }, esc(words('sectionLabel', { n: sectionNo }))));
      let heading = inline(u.title);
      if (isQuiz) heading = words('quizHeading', { n: quizNo, title: heading });
      else if (u.kind === 'practice') heading = words('practiceHeading', { title: heading });
      sec.appendChild(el('h2', { id: 'u' + ui + '-h', tabindex: '-1' }, heading));
      const rec = { node: sec, questions: [], afters: [], index: ui };
      units.push(rec);
      renderBlocks(u.blocks, sec, rec);
      rec.pending = el('p', { class: 'pending-note', role: 'status', hidden: '' });
      rec.cont = el('div', { class: 'continue-wrap', hidden: '' }, '<p>' + esc(WORDING.continueMessage) + '</p><button type="button" class="btn-continue">' + esc(WORDING.continueButton) + '</button>');
      rec.cont.querySelector('button').addEventListener('click', () => doContinue(rec));
      sec.appendChild(rec.pending); sec.appendChild(rec.cont);
      if (ui > 0) rec.divider = el('hr', { class: 'section-divider' });
      if (rec.divider) main.appendChild(rec.divider);
      main.appendChild(sec);
    });

    // Finish screen + credits
    if (doc.finish) {
      const fin = el('section', { class: 'finish', 'aria-labelledby': 'finish-h', hidden: '' });
      fin.appendChild(el('h2', { id: 'finish-h', tabindex: '-1' }, inline(doc.finish.title || WORDING.finishDefaultTitle)));
      renderBlocks(doc.finish.blocks, fin, null);
      fin.appendChild(el('p', { class: 'screenshot-note' }, WORDING.screenshotNote));
      main.appendChild(fin);
      app.finish = fin;
    }
    const cr = el('section', { class: 'credits', 'aria-labelledby': 'credits-h', hidden: '' });
    cr.appendChild(el('h2', { id: 'credits-h' }, esc(WORDING.creditsHeading)));
    const det = el('details', null, '<summary>' + esc(WORDING.creditsToggle) + '</summary>');
    const ul = el('ul');
    credits.forEach(c => {
      // "Name: details" -> the name is shown in bold
      const colon = c.indexOf(': ');
      const html = colon > 0
        ? '<strong>' + inline(c.slice(0, colon + 1)) + '</strong> ' + inline(c.slice(colon + 2))
        : inline(c);
      ul.appendChild(el('li', null, html));
    });
    det.appendChild(ul);
    det.appendChild(el('p', null, esc(WORDING.creditsNote)));
    cr.appendChild(det);
    if (credits.length) main.appendChild(cr);
    app.credits = credits.length ? cr : null;

    document.body.appendChild(el('footer', null,
      '<p>' + esc(SETTINGS.siteName) + ' &nbsp;·&nbsp; <span class="lesson-name">' + esc(title) + '</span></p>' +
      '<p class="save-note">' + esc(WORDING.savedNote) + ' ' +
      '<button type="button" class="btn-text" data-act="startover">' + esc(WORDING.startOverShort) + '</button></p>'));

    document.querySelectorAll('[data-act="startover"]').forEach(b => b.addEventListener('click', startOver));
    banner.querySelector('[data-act="resume"]').addEventListener('click', jumpToResume);
    app.banner = banner;

    // Question numbers restart in each unit
    units.forEach(u => u.questions.forEach((q, i) => { q.numNode.textContent = 'Q' + (i + 1); q.label = 'Q' + (i + 1); }));

    restore();
    refresh();
  }

  function renderBlocks(blocks, parent, unitRec) {
    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      if (b.kind === 'image' && /^beside/i.test(b.place || '')) {
        // the image sits beside the text that follows it
        const wrap = el('div', { class: 'image-aside' });
        wrap.appendChild(renderImage(b));
        const side = el('div', { class: 'aside-text' });
        while (i + 1 < blocks.length && ['para', 'list', 'button'].indexOf(blocks[i + 1].kind) !== -1) { i++; side.appendChild(renderBlock(blocks[i], unitRec)); }
        wrap.appendChild(side);
        parent.appendChild(wrap);
        continue;
      }
      const node = renderBlock(b, unitRec);
      if (node) parent.appendChild(node);
    }
  }

  function renderBlock(b, unitRec) {
    switch (b.kind) {
      case 'para': return el('p', null, inline(b.text));
      case 'heading': return el('h3', null, inline(b.text));
      case 'list': {
        const l = el(b.ordered ? 'ol' : 'ul');
        b.items.forEach(t => l.appendChild(el('li', null, inline(t))));
        return l;
      }
      case 'button':
        return el('a', { href: b.url, target: '_blank', rel: 'noopener noreferrer', class: 'btn-link' },
          esc(b.text) + newTabNote());
      case 'image': return renderImage(b);
      case 'video': return renderVideo(b);
      case 'box': {
        const d = el('div', { class: b.box, role: b.box === 'after' ? 'region' : 'note', 'aria-label': plain(b.title) || null });
        if (b.box === 'after' && unitRec) {
          d.hidden = true;
          unitRec.afters.push({ node: d, needs: unitRec.questions.slice() }); // the questions above it
        }
        if (b.title) d.appendChild(el('strong', { class: 'box-title' }, inline(b.title)));
        renderBlocks(b.blocks, d, unitRec);
        return d;
      }
      case 'cards': {
        const grid = el('div', { class: 'cards' });
        b.cards.forEach(c => {
          const card = el('div', { class: 'card' });
          const t = splitEmoji(c.title);
          if (t.icon) card.appendChild(el('span', { class: 'card-icon', 'aria-hidden': 'true' }, t.icon));
          if (t.text) card.appendChild(el('h3', null, inline(t.text)));
          renderBlocks(c.blocks, card, unitRec);
          grid.appendChild(card);
        });
        return grid;
      }
      case 'question': return renderQuestion(b, unitRec);
    }
    return null;
  }

  function renderImage(b) {
    const fig = el('figure', { class: 'figure' });
    const img = el('img', { src: imgSrc(b.file), alt: b.alt || '', loading: 'lazy' });
    if (PREVIEW && b.file) { // check the file exists, even if this part of the lesson isn't showing yet
      const probe = new Image();
      probe.onerror = () => {
        const msg = 'Line ' + b.line + ': the image <code>' + esc(b.file) + '</code> was not found in the assets folder. Check the spelling (capitals matter) or upload the image.';
        addLateProblem(msg);
        fig.appendChild(el('p', { class: 'problem-flag' }, msg));
      };
      probe.src = imgSrc(b.file);
    }
    fig.appendChild(img);
    if (b.caption) fig.appendChild(el('figcaption', null, inline(b.caption)));
    if (b.credit && credits.indexOf(b.credit) === -1) credits.push(b.credit);
    return fig;
  }

  function renderVideo(b) {
    const wrap = el('div', { class: 'video' });
    if (!b.id) return wrap;
    const start = toSeconds(b.start), stop = toSeconds(b.stop);
    const q = ['rel=0'];
    if (start) q.push('start=' + start);
    if (stop) q.push('end=' + stop);
    const frame = el('div', { class: 'video-frame' });
    frame.appendChild(el('iframe', {
      src: 'https://www.youtube-nocookie.com/embed/' + b.id + '?' + q.join('&'),
      title: plain(b.title || 'Video'), loading: 'lazy',
      allow: 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture', allowfullscreen: ''
    }));
    wrap.appendChild(frame);
    let note = '';
    if (start && stop) note = esc(words('videoPlaysFromTo', { start: b.start, stop: b.stop })) + ' ';
    else if (start) note = esc(words('videoStartsAt', { start: b.start })) + ' ';
    const youTubeLink = 'https://www.youtube.com/watch?v=' + b.id + (start ? '&amp;t=' + start + 's' : '');
    note += esc(WORDING.videoBackup) + ' <a href="' + youTubeLink + '" target="_blank" rel="noopener noreferrer">' +
      esc(WORDING.videoBackupLink) + newTabNote() + '</a>';
    wrap.appendChild(el('p', { class: 'video-note' }, note));
    if (b.credit && credits.indexOf(b.credit) === -1) credits.push(b.credit);
    return wrap;
  }

  // =================================================================
  // 4. QUESTIONS
  // =================================================================
  function renderQuestion(b, unitRec) {
    if (b.bad) {
      return el('div', { class: 'being-updated', role: 'note' }, PREVIEW
        ? 'Line ' + b.line + ': this question has a problem (see the yellow box at the top), so students would see "This part is being updated."'
        : esc(WORDING.beingUpdated));
    }
    const id = 'q' + questions.length;
    let key = hash(b.qtype + '|' + normalize(b.text)); while (questions.some(x => x.key === key)) key += 'x';
    const q = { def: b, id, key, unit: unitRec, status: 'open', tries: 0, wrong: [] };
    questions.push(q);
    if (unitRec) unitRec.questions.push(q);
    const box = el('div', { class: 'question', id: id });
    q.node = box;
    q.numNode = el('span', { class: 'question-num' });
    const fb = el('div', { class: 'feedback', id: id + '-fb', role: 'status', 'aria-live': 'polite' });
    q.fb = fb;

    if (b.qtype === 'fillin') {
      const lab = el('label', { class: 'question-text', for: id + '-in' });
      lab.appendChild(q.numNode); lab.insertAdjacentHTML('beforeend', ' ' + inline(b.text));
      box.appendChild(lab);
      const row = el('div', { class: 'fillin' });
      q.input = el('input', { type: 'text', id: id + '-in', autocomplete: 'off', placeholder: WORDING.fillinPlaceholder, 'aria-describedby': id + '-fb' });
      q.btn = el('button', { type: 'button', class: 'btn-check' }, esc(WORDING.checkButton));
      row.appendChild(q.input); row.appendChild(q.btn);
      box.appendChild(row);
      if (b.hint) box.appendChild(el('p', { class: 'hint-text' }, inline(b.hint)));
      q.input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); check(q); } });
    } else {
      const fs = el('fieldset');
      const lg = el('legend', { class: 'question-text' });
      lg.appendChild(q.numNode); lg.insertAdjacentHTML('beforeend', ' ' + inline(b.text));
      fs.appendChild(lg);
      const wrap = el('div', { class: 'choices' });
      q.opts = b.choices.map((c, ci) => {
        const lab = el('label', { class: 'choice' });
        const inp = el('input', { type: b.qtype === 'choice' ? 'radio' : 'checkbox', name: id, value: String(ci) });
        inp.addEventListener('change', () => markSelected(q));
        lab.appendChild(inp); lab.insertAdjacentHTML('beforeend', ' <span>' + inline(c.text) + '</span>');
        wrap.appendChild(lab);
        return { label: lab, input: inp, correct: c.correct };
      });
      fs.appendChild(wrap);
      if (b.hint) fs.appendChild(el('p', { class: 'hint-text' }, inline(b.hint)));
      if (b.qtype === 'select') {
        const n = b.choices.filter(c => c.correct).length;
        q.hint = el('p', { class: 'hint-text', hidden: '' }, esc(words('selectAllHint', { n: n })));
        fs.appendChild(q.hint);
      }
      box.appendChild(fs);
      q.btn = el('button', { type: 'button', class: 'btn-check' }, esc(WORDING.checkButton));
      box.appendChild(q.btn);
    }
    q.btn.addEventListener('click', () => check(q));
    box.appendChild(fb);
    return box;
  }

  function markSelected(q) {
    q.opts.forEach(o => o.label.classList.toggle('selected', o.input.checked));
  }

  function check(q) {
    if (q.status !== 'open') return;
    const d = q.def;
    if (d.qtype === 'fillin') {
      const val = q.input.value;
      if (!normalize(val)) return say(q, 'neutral', esc(WORDING.pleaseType));
      // Right if the answer contains any accepted word (capitals and punctuation ignored)
      const answer = normalize(val);
      const ok = d.accept.some(a => normalize(a) && answer.indexOf(normalize(a)) !== -1);
      if (ok) return finishQ(q, 'right', val);
      q.tries++;
      if (q.tries >= SETTINGS.maxTries) return finishQ(q, 'revealed', val);
      const left = SETTINGS.maxTries - q.tries;
      const triesNote = left === 1 ? WORDING.oneTryLeft : words('triesLeft', { n: left });
      say(q, 'incorrect', '✗ ' + inline(d.wrong || WORDING.defaultWrongFillin) + ' ' + esc(triesNote));
      save();
      return;
    }
    const picked = q.opts.map((o, i) => o.input.checked ? i : -1).filter(i => i >= 0);
    if (!picked.length) return say(q, 'neutral', esc(d.qtype === 'choice' ? WORDING.pleaseChoose : WORDING.pleaseChooseSome));
    const right = q.opts.every((o, i) => o.correct === (picked.indexOf(i) !== -1));
    if (right) return finishQ(q, 'right', picked);
    if (d.qtype === 'choice') {
      const w = picked[0];
      if (q.wrong.indexOf(w) === -1) q.wrong.push(w);
      applyWrong(q);
      say(q, 'incorrect', '✗ ' + inline(d.wrong || WORDING.defaultWrongChoice));
    } else {
      say(q, 'incorrect', '✗ ' + inline(d.wrong || WORDING.defaultWrongSelect));
      q.hint.hidden = false;
      q.hintShown = true;
    }
    q.tries++;
    save();
  }

  function applyWrong(q) {
    q.wrong.forEach(w => {
      const o = q.opts[w]; if (!o) return;
      o.input.checked = false; o.input.disabled = true;
      o.label.classList.remove('selected'); o.label.classList.add('is-wrong');
    });
  }

  function say(q, kind, html) { q.fb.className = 'feedback ' + kind; q.fb.innerHTML = html; }

  function finishQ(q, status, value) {
    const d = q.def;
    q.status = status;
    q.value = value;
    q.btn.disabled = true;
    if (d.qtype === 'fillin') {
      q.input.disabled = true;
      if (typeof value === 'string') q.input.value = value;
      if (status === 'right') say(q, 'correct', '✓ ' + inline(d.right || WORDING.defaultRight));
      else say(q, 'incorrect', '✗ ' + inline(d.reveal || words('defaultReveal', { answer: d.accept[0] || '' })));
    } else {
      q.opts.forEach((o, i) => {
        o.input.disabled = true;
        o.input.checked = o.correct;
        o.label.classList.remove('selected');
        if (o.correct) o.label.classList.add('is-right');
      });
      say(q, 'correct', '✓ ' + inline(d.right || WORDING.defaultRight));
      if (q.hint) q.hint.hidden = true;
    }
    if (!restoring) { save(); refresh(); }
  }

  // =================================================================
  // 5. MOVING THROUGH THE LESSON
  // =================================================================
  // A "stop" is a unit that has questions. Everything up to and including the
  // next stop is shown; its Continue button reveals the next stretch.
  function stops() { return units.filter(u => u.questions.length); }
  function unitDone(u) { return u.questions.every(q => q.status !== 'open'); }

  function refresh() {
    const st = stops();
    const last = st[st.length - 1];
    const unitsAfterLast = last ? last.index < units.length - 1 : false;
    // which units are visible
    const lastVisible = (!st.length || state.continued >= st.length) ? units.length - 1 : st[state.continued].index;
    units.forEach(u => {
      const vis = u.index <= lastVisible;
      u.node.hidden = !vis;
      if (u.divider) u.divider.hidden = !vis;
    });
    // AFTER ANSWERS boxes
    units.forEach(u => u.afters.forEach(a => { a.node.hidden = !a.needs.every(q => q.status !== 'open'); }));
    // Continue buttons and "almost there" notes
    st.forEach((u, i) => {
      const isCurrent = i === state.continued;
      u.cont.hidden = !(isCurrent && unitDone(u) && (i < st.length - 1 || unitsAfterLast));
      const open = u.questions.filter(q => q.status === 'open');
      const startedHere = u.questions.some(q => q.status !== 'open');
      if (isCurrent && open.length && startedHere) {
        const names = open.map(q => '<a href="#' + q.id + '">' + q.label + '</a>');
        const list = names.length === 1 ? names[0] : names.slice(0, -1).join(', ') + ' ' + esc(WORDING.and) + ' ' + names[names.length - 1];
        u.pending.innerHTML = words('almostThere', { questions: list });
        u.pending.hidden = false;
      } else u.pending.hidden = true;
    });
    // Finished? (all questions answered, and every part shown)
    const finished = !st.length || (st.every(unitDone) && state.continued >= (unitsAfterLast ? st.length : st.length - 1));
    if (app.finish) app.finish.hidden = !finished;
    if (app.credits) app.credits.hidden = !finished;
    // Move the student to the finish screen the moment they finish (not on reload)
    if (finished && wasFinished === false && app.finish) setTimeout(() => focusEl(app.finish.querySelector('h2')), 60);
    wasFinished = finished;
    // Progress: 5% to start, 100% when finished
    const total = questions.length || 1;
    const answered = questions.filter(q => q.status !== 'open').length;
    const pct = finished ? 100 : Math.round(5 + 90 * answered / total);
    const bar = document.querySelector('.progress-bar-fill');
    bar.style.width = pct + '%';
    bar.parentNode.setAttribute('aria-valuenow', String(pct));
  }

  function doContinue(u) {
    const st = stops();
    const i = st.indexOf(u);
    if (i !== state.continued) return;
    state.continued = i + 1;
    save();
    refresh();
    const next = units[u.index + 1];
    if (next) focusEl(next.node.querySelector('h2'));
  }

  function focusEl(e) {
    if (!e) return;
    e.focus({ preventScroll: true });
    e.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }

  // =================================================================
  // 6. SAVED PROGRESS (this browser only; nothing is sent anywhere)
  // =================================================================
  function save() {
    if (restoring) return;
    const out = { v: 1, continued: state.continued, q: {} };
    questions.forEach(q => {
      if (q.status === 'open' && !q.tries) return;
      out.q[q.key] = { s: q.status, v: q.value, t: q.tries, w: q.wrong, h: q.hintShown ? 1 : 0 };
    });
    try { localStorage.setItem(storageKey, JSON.stringify(out)); } catch (e) { /* storage blocked: lesson still works */ }
  }

  function restore() {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(storageKey) || 'null'); } catch (e) { saved = null; }
    if (!saved || saved.v !== 1 || typeof saved.q !== 'object') return;
    restoring = true;
    let any = false;
    try {
      questions.forEach(q => {
        const s = saved.q[q.key];
        if (!s) return;
        any = true;
        q.tries = +s.t || 0;
        q.wrong = Array.isArray(s.w) ? s.w.filter(w => q.opts && q.opts[w]) : [];
        if (s.s === 'right' || s.s === 'revealed') {
          if (q.def.qtype === 'fillin' && s.s === 'revealed' && q.tries < SETTINGS.maxTries) q.tries = SETTINGS.maxTries;
          finishQ(q, s.s, s.v);
        } else if (q.def.qtype === 'choice') {
          applyWrong(q);
          if (q.wrong.length) say(q, 'incorrect', '✗ ' + inline(q.def.wrong || WORDING.defaultWrongChoice));
        } else if (q.def.qtype === 'select' && s.h) {
          q.hint.hidden = false; q.hintShown = true;
        } else if (q.def.qtype === 'fillin' && q.tries) {
          const left = SETTINGS.maxTries - q.tries;
          say(q, 'neutral', esc(left === 1 ? WORDING.oneTryLeftRestored : words('triesLeftRestored', { n: left })));
        }
      });
      const st = stops();
      state.continued = Math.max(0, Math.min(+saved.continued || 0, st.length));
      // never skip past a stop that isn't finished (e.g. a question was edited)
      for (let i = 0; i < state.continued; i++) if (!unitDone(st[i])) { state.continued = i; break; }
    } finally { restoring = false; }
    if (any || state.continued) app.banner.hidden = false;
  }

  function jumpToResume() {
    app.banner.hidden = true;
    // 1) the first unanswered question that is showing
    const target = questions.find(q => q.status === 'open' && !q.node.closest('[hidden]'));
    if (target) {
      let field = target.input;                                   // fill-in box
      if (!field) {                                               // or the first choice still available
        const firstOpen = target.opts.find(o => !o.input.disabled);
        field = firstOpen ? firstOpen.input : null;
      }
      target.node.scrollIntoView({ block: 'center' });
      if (field) field.focus({ preventScroll: true });
      return;
    }
    // 2) otherwise a Continue button that is waiting to be clicked
    const waiting = units.map(u => u.cont).find(c => !c.hidden);
    if (waiting) {
      waiting.scrollIntoView({ block: 'center' });
      waiting.querySelector('button').focus({ preventScroll: true });
      return;
    }
    // 3) otherwise the finish screen
    if (app.finish && !app.finish.hidden) focusEl(app.finish.querySelector('h2'));
  }

  function startOver() {
    if (!window.confirm(WORDING.startOverConfirm)) return;
    try { localStorage.removeItem(storageKey); } catch (e) { }
    location.reload();
  }

  // =================================================================
  // 7. PREVIEW: list of problems
  // =================================================================
  let problemsBox = null;
  function renderProblems() {
    problemsBox = el('div', { class: 'problems', role: 'region', 'aria-label': 'Problems found in the lesson file' });
    drawProblems();
    return problemsBox;
  }
  function drawProblems() {
    if (!problemsBox) return;
    const list = problemsList.slice().sort((a, b) => a.line - b.line);
    problemsBox.classList.toggle('problems-ok', !list.length);
    problemsBox.innerHTML = list.length
      ? '<h2>⚠️ ' + list.length + (list.length === 1 ? ' thing' : ' things') + ' to fix in <code>' + esc(LESSON_FILE) + '</code></h2><ul>' +
        list.map(p => '<li><strong>Line ' + p.line + ':</strong> ' + p.msg + '</li>').join('') + '</ul>' +
        '<p>Fix these in the draft, save, then reload this page.</p>'
      : '<h2>✓ No problems found in <code>' + esc(LESSON_FILE) + '</code></h2><p>Click through the lesson below to check it, then copy the draft into <code>lesson.txt</code>.</p>';
  }
  function addLateProblem(msg) {
    const m = msg.match(/^Line (\d+): (.*)$/);
    problemsList.push({ line: m ? +m[1] : 0, msg: m ? m[2] : msg });
    drawProblems();
  }

  // =================================================================
  // 8. START
  // =================================================================
  function showLoadError(html) {
    document.body.innerHTML = '<div class="load-error" role="alert">' + html + '</div>';
  }
  function start(text) {
    let result;
    try { result = parse(text); } catch (e) {
      return showLoadError('<h1>Sorry, this lesson couldn\'t be loaded.</h1><p>' + esc(e.message) + '</p>');
    }
    build(result.doc, result.problems);
    window.LESSON_DEBUG = { doc: result.doc, problems: problemsList, questions, units };
  }
  const inlineText = document.getElementById('lesson-text');
  if (inlineText) { start(inlineText.textContent.replace(/^\n/, '')); return; }
  fetch(LESSON_FILE, { cache: 'no-cache' })
    .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
    .then(start)
    .catch(() => {
      if (location.protocol === 'file:') return askForFile();
      showLoadError('<h1>Sorry, this lesson couldn\'t be loaded.</h1><p>The file <code>' + esc(LESSON_FILE) + '</code> wasn\'t found next to this page. Please try again in a minute.</p>');
    });

  // Opened straight from the computer: browsers won't let the page read the
  // lesson file by itself, so ask the person to choose it.
  function askForFile() {
    showLoadError(
      '<h1>Choose the lesson file to preview</h1>' +
      '<p>This page was opened from your computer, and browsers only let it read a file you pick yourself. ' +
      'Click the button and choose <code>' + esc(LESSON_FILE) + '</code> from this lesson\'s folder.</p>' +
      '<p><label class="btn-continue file-pick">Choose lesson file…' +
      '<input type="file" accept=".txt,text/plain" id="pick-lesson" class="visually-hidden"></label></p>' +
      '<p class="small-note">Images load from this lesson\'s <code>assets</code> folder. ' +
      'Answers you give in a preview opened this way are remembered in this browser only.</p>');
    const input = document.getElementById('pick-lesson');
    input.addEventListener('change', () => {
      const f = input.files && input.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => { LESSON_FILE = f.name; start(String(reader.result)); };
      reader.readAsText(f);
    });
  }
})();
