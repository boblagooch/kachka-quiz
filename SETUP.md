# Kachka Quiz Platform — Setup Guide

## What You Have
- `index.html` — staff-facing quiz page (mobile-first, shareable link)
- `dashboard.html` — your admin dashboard (login-protected)
- This uses your existing `the-hourly-log` Firebase project — no new account needed

---

## Step 1 — Firebase: Add Two New Collections

Go to your Firebase Console → Firestore Database and create these two collections:

### Collection: `kachka_quizzes`
Each document = one quiz version. Structure:

```
kachka_quizzes/
  └─ [auto-id]/
       ├─ version: 5                          (number)
       ├─ title: "Version 5 — Vodka Focus"    (string, shown at top of quiz)
       ├─ active: true                         (boolean — only ONE quiz active at a time)
       └─ questions: [                         (array)
            {
              text: "What is Absolut Elyx distilled from?",
              answers: ["French grapes", "Single estate winter wheat", "Rye", "Potato"],
              correct: 1,                      (0-indexed: 0=A, 1=B, 2=C, 3=D)
              category: "vodka",               (for dashboard breakdown)
              topic: "base_ingredient",
              difficulty: "easy",
              funFact: "Absolut Elyx is distilled in a single vintage copper still from 1921."
            },
            { ... },
            { ... }
          ]
```

### Collection: `kachka_quiz_submissions`
This is auto-populated when staff submit. You don't need to create documents here — the app writes them automatically.

---

## Step 2 — Firebase Security Rules

In Firebase Console → Firestore → Rules, update to allow:
- Public read on `kachka_quizzes` (staff quiz page has no login)
- Public write on `kachka_quiz_submissions` (staff submit without login)
- Authenticated read on `kachka_quiz_submissions` (dashboard only)

Paste these rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Existing Hourly Log — unchanged
    match /checkins/{doc} {
      allow read, write: if true;
    }

    // Quiz: staff can read active quiz
    match /kachka_quizzes/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Quiz: staff can submit, only you can read results
    match /kachka_quiz_submissions/{doc} {
      allow create: if true;
      allow read: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
  }
}
```

---

## Step 3 — Deploy to Netlify

1. Create a new GitHub repo (e.g., `kachka-quiz`)
2. Push `index.html` and `dashboard.html` into it
3. Connect to Netlify → auto-deploys on every push
4. Your URLs will be:
   - Staff quiz: `https://kachka-quiz.netlify.app/`
   - Dashboard: `https://kachka-quiz.netlify.app/dashboard.html`

---

## How to Publish a New Quiz

1. Go to Firebase Console → Firestore → `kachka_quizzes`
2. Find the current active quiz → set `active: false`
3. Add a new document with the new quiz questions → set `active: true`
4. Share the quiz URL before service — staff click the same link every time, it always loads the active quiz

No code changes needed. No redeployment. Just Firestore.

---

## Dashboard Login

The dashboard uses the same Firebase Auth as your Hourly Log dashboard.
Log in with your existing manager email/password at:
`https://kachka-quiz.netlify.app/dashboard.html`

---

## Quiz Format Reminder (for entering questions into Firestore)

- `correct` is 0-indexed: A=0, B=1, C=2, D=3
- `category`: use `"vodka"` or `"wine"`
- `topic`: e.g., `"base_ingredient"`, `"filtration"`, `"tasting_notes"`, `"region"`, `"production"`
- `funFact`: one sentence, pulls from the master research list — written per question
- Keep to 7 questions per quiz, same difficulty mix as paper format
