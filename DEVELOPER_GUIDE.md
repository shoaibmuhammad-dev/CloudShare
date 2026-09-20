# Auth Module — Developer Guide

Module 1 of the file-sharing app: signup, email verification (with auto-login),
login, forgot/reset password, and protected routing. Built with Next.js App
Router, Mongoose/MongoDB, and NextAuth (Credentials provider, JWT sessions).

## 1. File structure

```
lib/
  db.ts                        Mongoose connection (cached across hot reloads)
  auth.ts                      NextAuth authOptions (Credentials provider)
  tokens.ts                    Generate / hash / verify one-time tokens
  mailer.ts                    Nodemailer transporter + email templates
  models/
    User.ts
    Token.ts
  validations/
    auth.ts                    Zod schemas, shared by every API route

types/
  next-auth.d.ts                Adds id/emailVerified to Session & JWT types

app/api/
  auth/
    [...nextauth]/route.ts      NextAuth handler (login, session, logout)
    signup/route.ts             POST — create account + send verify email
    verify-email/route.ts       POST — verify token + auto-login
    resend-verification/route.ts POST — resend verify email
    forgot-password/route.ts    POST — send reset email
    reset-password/route.ts     GET  — validate token / POST — set new password
  user/
    me/route.ts                 GET — current user's fresh profile data

middleware.ts                   Protects /dashboard/* and /profile/*
.env.example
```

Drop the `lib`, `types`, `app/api`, and `middleware.ts` folders straight into
your existing Next.js project root (merge with what's already there).

## 2. Install dependencies

```bash
npm install next-auth mongoose bcryptjs zod nodemailer
npm install -D @types/bcryptjs @types/nodemailer
```

## 3. Environment setup

Copy `.env.example` to `.env.local` and fill in:

- **MONGODB_URI** — your MongoDB Atlas (or local) connection string
- **NEXTAUTH_SECRET** — generate with `openssl rand -base64 32`
- **NEXTAUTH_URL** — `http://localhost:3000` in dev
- **SMTP\_\*** — any SMTP provider. For local dev, [Mailtrap](https://mailtrap.io)
  or [Resend](https://resend.com)'s SMTP work well and won't spam real inboxes
  while you're testing.

## 4. How each flow works end-to-end

### Signup → Verify → Auto-login → Dashboard

1. Client POSTs `{ name, email, password }` to `/api/auth/signup`.
2. Server hashes the password (bcrypt, 12 rounds), creates the `User` with
   `emailVerified: null`, generates a token, and emails a link:
   `NEXTAUTH_URL/verify-email?token=<raw>`.
3. Your **`/verify-email` page** (client component) reads `token` from the
   URL query string on mount and does:

   ```ts
   const res = await fetch("/api/auth/verify-email", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ token }),
   });
   const data = await res.json();

   if (res.ok) {
     // Session cookie is already set by the API route — just navigate.
     router.push("/dashboard");
   } else {
     // show data.error ("invalid or expired link")
   }
   ```

4. The API route validates the token, flips `emailVerified`, and — this is
   the key trick — **mints a NextAuth-compatible session JWT itself** using
   `encode()` from `next-auth/jwt` and sets it as the session cookie on the
   response. That's what makes the user "auto logged in" the instant they
   verify, with no second login step.
5. Client redirects to `/dashboard`. Middleware sees the valid session
   cookie and lets them through. Dashboard calls `GET /api/user/me` to
   populate the top bar, and your (upcoming) folders API to list folders.

### Login

Use NextAuth's client helper directly from your existing login form — you
don't need a custom route for this one, `[...nextauth]` handles it:

```ts
import { signIn } from "next-auth/react";

const result = await signIn("credentials", {
  redirect: false,
  email,
  password,
});

if (result?.error) {
  // result.error will be one of:
  // "INVALID_CREDENTIALS" | "EMAIL_NOT_VERIFIED" | "INVALID_INPUT"
  // Map these to friendly messages in your UI.
} else {
  router.push("/dashboard");
}
```

Unverified users **cannot** log in — `authorize()` throws `EMAIL_NOT_VERIFIED`
before checking the password. Show a "resend verification email" link in
your UI for that case, pointing at `/api/auth/resend-verification`.

### Forgot password → Reset → Back to login

1. Client POSTs `{ email }` to `/api/auth/forgot-password`. Response is
   **always the same generic message** regardless of whether the email
   exists — this stops attackers from using the form to find out which
   emails are registered.
2. If the account exists and is verified, an email goes out with:
   `NEXTAUTH_URL/reset-password?token=<raw>`.
3. Your **`/reset-password` page**, on mount, validates the token before
   showing the form:

   ```ts
   const res = await fetch(`/api/auth/reset-password?token=${token}`);
   const data = await res.json();
   // data.valid === true  -> show the "new password" form
   // data.valid === false -> show "this link is invalid or expired"
   ```

4. On submit, POST `{ token, password }` to the same endpoint:

   ```ts
   const res = await fetch("/api/auth/reset-password", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ token, password }),
   });
   if (res.ok) router.push("/login");
   ```

   Note this flow intentionally does **not** auto-login — after a password
   reset, sending the user back to a fresh login is the safer, more
   conventional pattern (and confirms their new password actually works).

## 5. Route protection

`middleware.ts` runs on every request to `/dashboard/*`, `/profile/*`,
`/login`, and `/signup` (see the `matcher` config). It reads the NextAuth
JWT straight out of the cookie with `getToken()` — no database call needed,
so it's cheap enough to run on every request at the edge.

- No token + protected route → redirect to `/login?callbackUrl=<original path>`
- Valid token + `/login` or `/signup` → redirect to `/dashboard`

Because `authorize()` refuses to issue a session for unverified users (and
the only other way to get a session is the verify-email auto-login, which by
definition only fires for just-verified users), **a valid session always
implies a verified email** — middleware doesn't need to check that
separately.

For **server components/actions**, pull the session with:

```ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const session = await getServerSession(authOptions);
// session.user.id, session.user.fullName, session.user.email, session.user.image
```

For **client components**, wrap your app in `<SessionProvider>` (in a
top-level client wrapper) and use `useSession()` from `next-auth/react`.

## 6. Security decisions worth knowing (and worth mentioning in an interview)

- **Tokens are never stored raw.** Only a SHA-256 hash is persisted; the raw
  value only ever exists in the email link and briefly in memory server-side.
- **Tokens auto-expire via a MongoDB TTL index** (`expiresAt`) — no cron job
  needed to clean up old tokens.
- **One active token per type per user.** Requesting a new verification or
  reset email invalidates any earlier one, so an old leaked link stops working.
- **Enumeration-safe by design.** `/forgot-password` and
  `/resend-verification` always return the same response whether or not the
  email exists.
- **Passwords never leave the database unintentionally.** The `password`
  field has `select: false` in the schema — it's excluded from every query
  by default unless explicitly requested with `.select("+password")`.
- **bcrypt with 12 rounds** for hashing — a reasonable cost factor for 2025+
  hardware without being slow enough to hurt UX.

## 7. Known limitations / good "next steps" to mention

- **No rate limiting yet.** Before shipping, add rate limiting (e.g.
  [Upstash Ratelimit](https://github.com/upstash/ratelimit)) on
  `signup`, `forgot-password`, and `resend-verification` to stop abuse/spam.
- **No session invalidation on password reset.** Because sessions are
  stateless JWTs, resetting a password doesn't invalidate other devices'
  existing sessions. A common fix: add a `tokenVersion` field on `User`,
  bump it on password reset, and check it in the `session` callback —
  worth adding once you're past MVP.
- **OAuth providers (Google/GitHub)** can be added later as additional
  entries in the `providers` array in `lib/auth.ts` — the Credentials flow
  above doesn't need to change.

## 8. Quick test checklist

1. Sign up with a new email → check inbox (or Mailtrap) for the verify email.
2. Click the link → should land on `/dashboard` already logged in.
3. Log out, try logging in with an unverified second account → should get
   `EMAIL_NOT_VERIFIED`.
4. Try `/dashboard` in an incognito window → should redirect to `/login`.
5. Forgot password → check email → reset → confirm old password no longer
   works and new one does.
6. Request password reset twice in a row → confirm the first email's link
   no longer works (token was invalidated).
