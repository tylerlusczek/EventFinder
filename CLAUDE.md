# Event Finder — UI Improvement Guide

## Overview

This guide captures the findings from the frontend audit (score: 12/20) and provides
implementation instructions for fixing each issue. Work through sections in priority order:
P1 fixes first, then P2, then P3.

---

## P1 Fixes — Do These First

### 1. Render CRUD feedback (`message` state is never displayed)

**Problem:** `setMessage(...)` is called in 8+ handlers in App.jsx (create event, delete event,
join club, RSVP, etc.) but `message` is never rendered. Users get zero feedback.

**Fix — App.jsx:** Add a feedback banner inside `.page-wrapper`, just before `.tab-content`:

```jsx
{message && (
  <p role="status" aria-live="polite" className="feedback-banner">
    {message}
  </p>
)}
```

**Fix — App.css:**

```css
.feedback-banner {
  background: #EAF4EA;
  color: #1E6B1E;
  border: 1px solid #B8DEB8;
  border-radius: var(--radius-sm);
  padding: 0.65rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
}
```

Auto-dismiss after 3 seconds by adding to App.jsx:

```js
useEffect(() => {
  if (!message) return;
  const t = setTimeout(() => setMessage(""), 3000);
  return () => clearTimeout(t);
}, [message]);
```

---

### 2. Success messages must not be red

**Problem:** `authMessage` holds both errors ("Invalid email or password") and successes
("Login successful"). Both render with `className="error-message"` — red. Success messages
should be green.

**Fix — App.jsx:** Add `authMessageType` state:

```js
const [authMessageType, setAuthMessageType] = useState("error");
```

Set `"success"` where appropriate:

```js
// in handleLogin:
setAuthMessage("Login successful");
setAuthMessageType("success");

// in handleSignup:
setAuthMessage("Account created successfully");
setAuthMessageType("success");

// in handleLogout:
setAuthMessage("Logged out successfully");
setAuthMessageType("success");

// in handlePasswordChange:
setAuthMessage("Password updated successfully");
setAuthMessageType("success");

// in all catch blocks — leave as "error"
```

Pass it to AuthPanel and AccountInfo:

```jsx
<AuthPanel ... authMessage={authMessage} authMessageType={authMessageType} />
<AccountInfo ... authMessage={authMessage} authMessageType={authMessageType} />
```

**Fix — AuthPanel.jsx and AccountInfo.jsx:** Use the type to pick the class:

```jsx
{authMessage && (
  <p className={authMessageType === "success" ? "success-message" : "error-message"}>
    {authMessage}
  </p>
)}
```

**Fix — App.css:**

```css
.success-message {
  color: #1E6B1E;
  font-size: 0.8rem;
  text-align: center;
  margin-top: 0.75rem;
  min-height: 1.1em;
}
```

---

### 3. Tables must scroll horizontally on mobile

**Problem:** EventList (8 cols), YourEventsList (8 cols) overflow the viewport on mobile.
`.table-card` has `overflow: hidden` which clips content instead of allowing scroll.

**Fix — App.css:** Replace `overflow: hidden` with a scroll wrapper:

```css
.table-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius);
  box-shadow: 0 2px 12px var(--card-shadow);
  overflow: hidden;        /* keep for border-radius clipping on the card edges */
}

.table-card .table-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
```

**Fix — EventList.jsx, YourEventsList.jsx, ClubList.jsx:** Wrap the `<table>` in a scroll div:

```jsx
<div className="table-card">
  <div className="table-card-header">All Events</div>
  <div className="table-scroll">
    <table>...</table>
  </div>
</div>
```

---

### 4. Button focus rings (keyboard navigation)

**Problem:** No `:focus-visible` styles on any button. Keyboard users cannot see focus position.
Violates WCAG 2.4.7 Focus Visible (AA).

**Fix — App.css:** Add after the `:root` block:

```css
button:focus-visible,
a:focus-visible {
  outline: 2px solid var(--blue-primary);
  outline-offset: 2px;
}
```

This uses `:focus-visible` so mouse users are not affected — only keyboard/assistive tech.

---

### 5. Touch targets too small

**Problem:** Tab buttons are ~30px tall, action buttons are ~24px tall. WCAG 2.5.5 requires
44×44px minimum.

**Fix — App.css:** Add to the mobile breakpoint:

```css
@media (max-width: 600px) {
  .tab {
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-edit,
  .btn-delete,
  .btn-rsvp,
  .btn-cancel-rsvp,
  .btn-join,
  .leave-button {
    min-height: 40px;
    padding: 0.5rem 0.85rem;
  }
}
```

---

## P2 Fixes — Do These Second

### 6. Move Google Fonts out of CSS (performance)

**Problem:** `@import url(...)` in CSS is render-blocking. The browser downloads App.css,
parses the `@import`, then starts fetching the font — adding ~100–300ms to first paint.

**Fix:** Remove the `@import` from App.css and add to `index.html` `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

### 7. Tokenize dark panel colors

**Problem:** 10 hardcoded hex values in `.form-panel` styles (`#9090BB`, `#3D3D55`,
`#2A2A3C`, `#E8E8F0`, `#606080`). They bypass the token system.

**Fix — App.css `:root`:** Add:

```css
--panel-label:        #9090BB;
--panel-divider:      #3D3D55;
--panel-input-bg:     #2A2A3C;
--panel-input-text:   #E8E8F0;
--panel-placeholder:  #606080;
```

Then replace every hardcoded value in `.form-panel` selectors with these variables.

---

### 8. Accessibility: ARIA and semantic fixes

**Problem:** Multiple WCAG violations across components.

**Fix — App.jsx tabs:** Add `aria-current` to the active tab:

```jsx
<button
  className={"tab" + (currentTab === "events" ? " active" : "")}
  aria-current={currentTab === "events" ? "page" : undefined}
  onClick={() => setCurrentTab("events")}
>
  Events
</button>
```

**Fix — AuthPanel.jsx:** Replace `<a href="#">` toggle with a button:

```jsx
<button
  type="button"
  className="link-button"
  onClick={() => setMode(mode === "login" ? "signup" : "login")}
>
  {mode === "login" ? "Create an account" : "Already have an account?"}
</button>
```

Add to App.css:

```css
.link-button {
  background: none;
  border: none;
  color: var(--link-color);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  margin: 0;
  text-decoration: none;
}

.link-button:hover {
  text-decoration: underline;
}
```

**Fix — All table components:** Add `scope="col"` to every `<th>`:

```jsx
<th scope="col">Name</th>
<th scope="col">Description</th>
```

**Fix — EventList.jsx, YourEventsList.jsx:** Add `aria-label` to action buttons:

```jsx
<button className="btn-edit" aria-label={"Edit " + event.name} onClick={() => onEdit(event)}>
  Edit
</button>
<button className="btn-delete" aria-label={"Delete " + event.name} onClick={() => onDelete(event.id)}>
  Delete
</button>
```

---

## P3 Fixes — Polish Pass

### 9. Remove inline styles from AuthPanel

**Problem:** Two elements use raw inline style objects.

**Fix — AuthPanel.jsx line 107:** Replace:
```jsx
<p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
```
With:
```jsx
<p className="login-subtitle">
```

**Fix — AuthPanel.jsx line 111:** Replace:
```jsx
<h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--label-text)", marginBottom: "1rem" }}>
```
With:
```jsx
<h3 className="password-card-title">
```

Add to App.css:

```css
.login-subtitle {
  text-align: center;
  color: var(--text-muted);
  margin-bottom: 1.25rem;
}

.password-card-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--label-text);
  margin-bottom: 1rem;
}
```

---

### 10. Pass clubs as prop to EventForm (avoid redundant fetch)

**Problem:** EventForm calls `getClubs()` on every mount. App.jsx already has clubs in state.

**Fix — EventForm.jsx:** Remove the `useEffect` + `getClubs` import. Accept clubs as a prop:

```jsx
export default function EventForm({ onSubmit, selectedEvent, clubs = [] }) {
```

**Fix — App.jsx:** Pass it:

```jsx
<EventForm onSubmit={handleCreateOrUpdateEvent} selectedEvent={selectedEvent} clubs={clubs} />
```

---

## Checklist

| # | Issue | Severity | Status |
|---|-------|----------|--------|
| 1 | CRUD feedback never shown | P1 | [ ] |
| 2 | Success messages render red | P1 | [ ] |
| 3 | Tables overflow on mobile | P1 | [ ] |
| 4 | No button focus rings | P1 | [ ] |
| 5 | Touch targets too small | P1 | [ ] |
| 6 | Google Fonts render-blocking | P2 | [ ] |
| 7 | Dark panel colors not tokenized | P2 | [ ] |
| 8 | ARIA: tabs, links, th scope, action labels | P2 | [ ] |
| 9 | Inline styles in AuthPanel | P3 | [ ] |
| 10 | Redundant clubs fetch in EventForm | P3 | [ ] |
