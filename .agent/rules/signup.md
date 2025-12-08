---
trigger: model_decision
description: Description of the user signupo flow end to end
---

# USER SIGN-UP FLOW CONTEXT
# Source of Truth for Authentication & Onboarding Implementation

## 1. ARCHITECTURE HIGHLIGHTS
- Strategy: Passwordless-first (OTP) -> Set Password -> Onboarding.
- Framework: Better-auth with Email OTP plugin.
- Session Management: HTTP-only cookies.
- Critical Logic: Transition from OTP to Password Setup uses `window.location.href` (Full Page Nav) to ensure server components receive the new session cookie. Client-side routing (`router.push`) causes auth failures here.
- Persistence: User data stored in `sessionStorage` ("signupData") to survive refreshes.

## 2. TECHNOLOGY STACK
- Auth: Better-auth (Plugins: emailOTP, organization, username, admin, passkey, magicLink, twoFactor, invitationOnly).
- Config: `packages/auth/auth.ts`.
- DB: PostgreSQL via Prisma.
- Frontend: Next.js App Router, React Hook Form, Zod, Shadcn UI.
- State: React Query (TanStack), Component State, SessionStorage.

## 3. DATABASE SCHEMA (Prisma)
Location: `packages/database/prisma/schema.prisma`

model User {
  id                 String   @id @default(cuid())
  email              String   @unique
  emailVerified      Boolean
  name               String
  username           String?  @unique
  onboardingComplete Boolean  @default(false) // Critical for routing
  role               String?
  sessions           Session[]
  accounts           Account[]
  members            Member[] // Org membership
}

model Account {
  id          String   @id @default(cuid())
  userId      String
  providerId  String   // "credential" for password
  accountId   String   // email
  password    String?  // Scrypt hashed
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Session {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Organization {
  id         String      @id @default(cuid())
  name       String
  slug       String?     @unique
  workspaces Workspace[]
  members    Member[]
}

model Workspace {
  id             String       @id @default(cuid())
  organizationId String
  name           String
  slug           String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  @@unique([organizationId, slug])
}

model Verification {
  id         String   @id @default(cuid())
  identifier String   // Email
  value      String   // Hashed OTP
  expiresAt  DateTime
}

## 4. IMPLEMENTATION STEPS

### STEP 1: REGISTRATION (Details)
- Page: `apps/web/app/auth/signup/page.tsx`
- Component: `apps/web/modules/saas/auth/components/SignupForm.tsx`
- Zod Schema: 
  - Validates `firstName`, `lastName`, `email`.
  - Blocks free email providers (gmail, yahoo, hotmail, outlook, aol, icloud, protonmail, etc).
  - Requires `consent` boolean.
- API Call: `GET /api/auth/check-email` (Checks duplicate).
- Action: Stores form data in `sessionStorage`. Calls `POST /api/auth/email-otp/send-verification-otp`.

### STEP 2: OTP VERIFICATION
- Component: `SignupForm.tsx` (Step 2 state).
- Input: 6-digit OTP via `InputOTP`.
- Logic:
  1. Calls `authClient.signIn.emailOtp({ email, otp })`.
  2. On success: `window.location.href = "/auth/set-password"` (FORCE RELOAD).
- Error Handling: Invalid code, expired code.

### STEP 3: SET PASSWORD
- Page: `apps/web/app/auth/set-password/page.tsx` (Server Comp).
- Guard: Redirects to login if `!session`.
- Component: `SetPasswordForm.tsx`.
- Schema: Min 8 chars, 1 uppercase, 1 number. Match confirm.
- API: `POST /api/auth/set-password`.
  - Hashes password using `scrypt` + salt.
  - Updates/Creates `Account` (provider: "credential").
  - Sets `User.emailVerified = true`.
- Nav: `router.push("/auth/onboarding")` (or /app based on config).

### STEP 4: ONBOARDING
- Page: `apps/web/app/auth/onboarding/page.tsx`.
- Guard: Redirects if `!session` or `user.onboardingComplete`.
- Component: `OnboardingStep1.tsx`.
- Auto-fill: `GET /api/companies/by-email` fetches company info based on email domain.
- Submission Logic:
  1. Generate Slug (slugify company name).
  2. Create Org: `authClient.organization.create`.
     - Retry logic: If slug exists, append random 4 digits (up to 5 attempts).
  3. Create Workspace: `orpc.workspaces.create`.
  4. Set Active Org: `authClient.organization.setActive`.
  5. Mark Complete: `authClient.updateUser({ onboardingComplete: true })`.
  6. Clear Cache & Redirect to `/app/{org}/{workspace}`.

## 5. API ENDPOINTS REFERENCE

| Endpoint | Method | Payload | Auth |
| :--- | :--- | :--- | :--- |
| `/api/auth/check-email` | GET | `?email=x` | Public |
| `/api/auth/email-otp/send-verification-otp` | POST | `{ email, type: "sign-in" }` | Public |
| `/api/auth/set-password` | POST | `{ password }` | Session |
| `/api/companies/by-email` | GET | `?email=x` | Public |

## 6. CLIENT METHODS (Better-auth)
- `authClient.signIn.emailOtp({ email, otp })`
- `authClient.organization.create({ name, slug })`
- `authClient.organization.setActive({ organizationId })`
- `authClient.updateUser({ onboardingComplete })`

## 7. ERROR HANDLING & SECURITY
- **Free Emails**: Blocked via Zod refine.
- **Slug Collision**: Handled via retry loop (slug + random suffix).
- **Session**: HttpOnly cookies. `check-email` prevents duplicate signups before OTP.
- **Set Password**: Server verifies password strength again. Validates session existence.

## 8. CONFIGURATION VARIABLES
- `config.auth.enableSignup`: Boolean.
- `config.users.enableOnboarding`: Boolean.
- `config.auth.sessionCookieMaxAge`: Seconds.
- Env: `DATABASE_URL`, `BETTER_AUTH_SECRET`.