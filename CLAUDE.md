# Project Conventions

Next.js 16 (App Router) + React 19 + TypeScript, MongoDB/Mongoose, Zustand, Zod, Tailwind.

## Feature-based structure

Code is organized by feature under `features/<name>/`. A feature may contain:

```
features/<name>/
  components/     UI — display only (see rule below)
  hooks/          all data fetching + state lives here
  store.ts        zustand store for persisted/shared client state
  service.ts      server-side data access (DB), used by API routes
  model.ts        mongoose schema + inferred type
  validators.ts   zod schemas + inferred payload types
  index.tsx       feature entry/composition
```

Shared/infra code lives under `lib/` (`lib/api`, `lib/auth`, `lib/db`, `lib/data`).
API routes live under `app/api/**/route.ts`.

## Core rule: hooks own logic, components only render

**Components and pages are for extracting data from hooks — nothing else.**
All API calls and state (form state, loading, error, results) live in a hook.

- ✅ Hooks (`features/<name>/hooks/use*.ts`) handle every `fetch`, all `useState`,
  loading/error flags, store updates, and navigation (`router.push/refresh`).
- ✅ Components destructure from the hook and wire values to markup.
  No `useState`, `fetch`, `router`, or store access directly in a component.
- ✅ One hook per action/flow: `useLogin`, `useLogout`, `useSearchProjects`, etc.
- ✅ Hooks return a flat object, e.g. `{ email, setEmail, error, loading, handleSubmit }`.

### Reference examples
- `features/auth/hooks/useLogin.ts` + `features/auth/components/LoginForm.tsx`
- `features/auth/hooks/useLogout.ts`
- `features/project/hooks/useSearchProjects.ts`

## Client state (zustand)

- Store per feature in `features/<name>/store.ts`, created with `create()(persist(...))`
  when state should survive reloads (e.g. `features/auth/store.ts`, key `"auth-store"`).
- Only mutate the store from hooks, and only after a successful API response
  (e.g. `login(user)` only after login succeeds, `logout()` only after logout succeeds).
- The store is convenience client state — the httpOnly session cookie
  (`lib/auth/session.ts`) + middleware remain the source of truth for auth.

## API responses

Routes return the `sendResponse(status, message, data?)` envelope from `lib/api/response.ts`:
`{ success, statusCode, message, data? }`. Hooks read `body.success` and `body.data`,
and surface `body.message` as the error string.

## Validation & errors

- Validate request bodies with the feature's zod schema (`validators.ts`) in the route.
- Services throw `ApiError` (`lib/api/error.ts`); routes wrap with `handleError`.

## Conventions checklist for new features

1. Add `validators.ts` (zod) and `model.ts` (mongoose) if it touches the DB.
2. Put DB access in `service.ts`; expose it via `app/api/**/route.ts`.
3. Put every call + all state in `features/<name>/hooks/use*.ts`.
4. Add `store.ts` only for shared/persisted client state; mutate it only from hooks.
5. Keep components/pages presentational — extract from the hook, render markup.
