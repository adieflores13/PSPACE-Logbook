# PSPACE Mobile Authentication

The native app uses the existing PSPACE Flask accounts. `backend/` (TypeScript/Prisma) is unchanged and is not involved in this integration. Flight and aircraft data remain on the device; there is no cloud record sync.

## Run Locally

In the PSPACE project, use its existing Python environment and configuration. Redis on port 6379 and the existing account database are required.

```sh
cd /Users/ramoj745/Desktop/anything-code/PSPACE
MOBILE_ALLOW_HTTP=1 python app.py
```

For local testing without outgoing mail:

```sh
MOBILE_ALLOW_HTTP=1 python app.py --noemail
```

No-email mode prints development verification codes in the Flask terminal. Never enable it in production. The website's existing login and signup remain available.

Set `EXPO_PUBLIC_PSPACE_URL` in the mobile project's `.env.local` to the Flask origin (not the API path), then restart Expo:

```sh
npx expo start --ios
```

Use `http://127.0.0.1:8000` for an iOS simulator or `http://10.0.2.2:8000` for the Android emulator. Physical devices need the computer's LAN address and a Flask server listening on `0.0.0.0`. Production requires HTTPS; `MOBILE_ALLOW_HTTP` must be unset. The URL is public configuration, never a place for database credentials or signing keys.

For web preview, explicitly allow the browser's origin on Flask, for example `MOBILE_ALLOWED_ORIGINS=http://localhost:8081,http://localhost:8082`. Native apps do not need CORS. No cross-origin browser cookies are used. Browser-preview tokens use sessionStorage, not localStorage; the native application is the intended shipping client.

## Flask Package

`PSPACE/flask_app/routes/mobile/` contains:

- `__init__.py`: blueprint, transport/CORS policy, JSON errors, session-table initialization.
- `security.py`: shared rate limiter integration, signed access tokens, account checks, session storage.
- `auth.py`: email verification, signup, sign-in, refresh, and logout.
- `profile.py`: current-user information and allow-listed profile updates.

All routes are under `/api/mobile/v1`:

| Method | Path | Body / purpose |
| --- | --- | --- |
| POST | `/auth/login` | `email`, `password` |
| POST | `/auth/signup-code` | `email`; send a five-minute signup code |
| POST | `/auth/verify-signup` | `email`, `code`; returns a ten-minute `verificationToken` |
| POST | `/auth/register` | `firstName`, `lastName`, `email`, `dateOfBirth` (YYYY-MM-DD), `password`, `role` (`student` or `instructor`), `acceptTerms: true`, `verificationToken` |
| POST | `/auth/refresh` | `refreshToken`; rotates the token |
| POST | `/auth/logout` | `refreshToken`; revokes its session, including a rotated-out token's session |
| GET | `/me` | Bearer access token; fresh shared profile |
| PATCH | `/me` | Bearer token; `firstName`, `lastName`, `dateOfBirth` |
| POST | `/me/photo` | Bearer token; multipart `profile_photo`, maximum 5 MB |

Login, registration, and refresh return `accessToken`, `refreshToken`, `expiresIn`, and `user`. The user includes an immutable PSPACE ID, names, email, DOB, role, photo, linked academy names, and an empty student ID when no real identifier is available. No password hashes or admin controls are returned. Names, DOB, and photos are shared; email, role, and school membership cannot be changed through these endpoints.

Registration creates a real PSPACE account using its password policy and supported roles. It does not grant paid subscriptions or school membership. Signup proof is isolated from website password-reset verification. Password recovery and legal information open existing PSPACE website pages.

## Sessions And Offline Access

- Access tokens use ItsDangerous with a mobile-specific signing salt and a 15-minute lifetime. They are not JWTs and never use the TypeScript backend's token format.
- Random refresh tokens have a 30-day absolute lifetime. Only their hashes are stored in the existing PSPACE SQLite database (`mobile_sessions` and `mobile_retired_tokens`), created automatically when Flask registers the blueprint.
- Refresh is single-flight on mobile and rotates the refresh token. Replaying an old refresh token revokes its session. Password and permission changes, suspension, deletion requests, expiry, and logout invalidate access on subsequent authenticated requests.
- Native refresh credentials use Expo SecureStore with device-only keychain access on iOS. Passwords are never persisted. Cached profile information and flight records use local SQLite, which is not encrypted by this implementation.
- After an online sign-in, a cached account may reopen local records during connection/service failures, up to the saved session's absolute expiry. Explicit authentication/permission failures never fall back to offline access. Revocation cannot be learned while the device is offline.
- Signing out clears local credentials immediately, including offline. Server revocation is best-effort when connected; an unreachable server session expires naturally.
- The app refreshes profile data on reopening/foregrounding. It does not promise real-time profile sync. Previously remote-hosted avatar images may need a connection; newly uploaded avatars are cached as image data.

## Local Record Ownership

New records use account-owned tables with composite foreign keys in the existing device database. Ownership includes the configured PSPACE origin and stable user ID, so environments and accounts remain separate. Account changes remount record providers to prevent stale in-memory records from appearing.

Earlier unowned records remain in their original tables. First sign-in offers **Import My Records** or **Start Fresh**. An import atomically copies the records and records their one-account ownership claim; it never silently imports the old locally edited profile over a PSPACE identity. Starting fresh leaves earlier records unassigned and does not delete them. There is no UI to reassign imported records.

## Verification

```sh
# Mobile project
npx tsc --noEmit
npm test
npm run lint

# PSPACE project: isolated DB, mail and Redis replacements
PYTHONDONTWRITEBYTECODE=1 venv/bin/python -m pytest flask_app/tests/test_mobile_api.py -q -p no:cacheprovider
```

Tests do not use real account credentials or send email. Configure HTTPS, real email delivery, Redis, allowed web origins if needed, database backup, signing-key management, and retention of expired session rows before deployment. Deploy/restart the Flask change and the matching mobile client together.
