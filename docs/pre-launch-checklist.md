# Pre-Launch Checklist

Things to complete before going live.

---

## 1. Resend — Verify a Sending Domain

**Why:** Free tier only sends to the Resend account email. Without a verified domain,
notification emails cannot reach real users or the admin inbox.

**Steps:**
1. Buy or use an existing domain (e.g. `birthdayvid.com`)
2. Resend → Domains → Add Domain → follow DNS record instructions
3. Update `.env` (and Vercel env vars):
   ```
   FROM_EMAIL="BirthdayVid <noreply@yourdomain.com>"
   ADMIN_EMAIL="zsyoscar@gmail.com"   # restore to your real inbox
   ```
4. Restart / redeploy

**Files touched:** `.env`, Vercel environment variables

---

## 2. Resend — Fix Admin Email Button URL

**Why:** The "View in Admin Dashboard →" button in the admin notification email
currently links to a hardcoded placeholder URL (`birthday-video-platform.vercel.app`).

**Steps:**
1. Add `NEXT_PUBLIC_APP_URL` to `.env` and Vercel env vars:
   ```
   NEXT_PUBLIC_APP_URL="https://yourdomain.com"
   ```
2. Update `src/lib/email.ts` — replace the hardcoded href:
   ```ts
   // before
   href="https://birthday-video-platform.vercel.app/en/admin"
   // after
   href="${process.env.NEXT_PUBLIC_APP_URL}/en/admin"
   ```

**Files touched:** `src/lib/email.ts`, `.env`, Vercel environment variables

---

## 3. Vercel — Set Up Production Domain

**Why:** The app is deployed to a Vercel-generated URL. A real domain improves
trust and is required for Resend domain verification to match the sending address.

**Steps:**
1. Vercel dashboard → Project → Settings → Domains → Add your domain
2. Point DNS to Vercel (Vercel provides the records)
3. Vercel auto-provisions HTTPS
4. Set `NEXT_PUBLIC_APP_URL` env var in Vercel to the final domain

**Files touched:** Vercel dashboard only

---

## 4. Remove Dummy Form Data

**Why:** The order form is pre-filled with test data ("Sophie", age 5, etc.)
to make manual testing easier. Must be reverted before real users see it.

**Steps:**
In `src/app/[locale]/order/[id]/page.tsx`, swap the `INITIAL` constant —
the empty version is already written above (commented out):
```ts
// swap this block back in:
const INITIAL: FormState = {
  subjectName: "", age: "", birthday: "", occasion: "birthday",
  blessingMessage: "", specialNotes: "", photoFiles: [], voiceFiles: [],
  ...
};
```

**Files touched:** `src/app/[locale]/order/[id]/page.tsx`

---

## 5. Vercel — Add All Environment Variables

Copy every key from `.env` into Vercel → Project → Settings → Environment Variables.
Critical ones that must be present in production:

| Key | Notes |
|---|---|
| `DATABASE_URL` | pgBouncer pooler URL |
| `DIRECT_URL` | Direct connection URL (for migrations) |
| `AUTH_SECRET` | Must match what was used locally |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Add production callback URL to Google Console |
| `NEXT_PUBLIC_SUPABASE_URL` | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | |
| `SUPABASE_SERVICE_ROLE_KEY` | |
| `RESEND_API_KEY` | |
| `FROM_EMAIL` | Use verified domain address |
| `ADMIN_EMAIL` | Your real inbox |
| `NEXT_PUBLIC_APP_URL` | Final production URL |

Also add the production domain to **Google OAuth → Authorized redirect URIs**:
`https://yourdomain.com/api/auth/callback/google`
