'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { loginAction } from '@/app/_actions/auth';

/**
 * @title LoginForm
 * @notice Credential form for the admin dashboard — brand block, tagline and
 * @notice the bare input fields, without any card surface.
 * @dev Data flow: form → `loginAction` (`useActionState`) → `POST /api/admin/login`
 * @dev on Express → httpOnly session cookies → redirect to `/`.
 * @dev Errors are rendered as text directly below the brand block (below the
 * @dev logo tagline), so the failure state is visible without shifting the form.
 * @dev `useFormStatus` lives in the `SubmitButton` child because it only reads
 * @dev the status of the *nearest* enclosing form.
 */

/**
 * @notice Submit button that reflects the in-flight login request.
 * @returns {JSX.Element} Submit button labelled "Masuk" / "Memproses…".
 */
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-brand w-full rounded-xl px-4 py-3 text-sm font-semibold"
    >
      {pending ? 'Memproses…' : 'Masuk'}
    </button>
  );
}

/**
 * @notice Renders the login form with per-field validation feedback.
 * @returns {JSX.Element} Brand block, tagline, error slot and credential inputs.
 */
export default function LoginForm() {
  const [state, formAction] = useActionState(loginAction, null);

  return (
    <div>
      <div className="mb-3 flex items-center justify-center gap-2">
        <span className="text-2xl font-bold text-brand">X</span>
        <span className="text-xl font-semibold text-gray-900">Kosply</span>
        <span className="ml-1 rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
          OPS
        </span>
      </div>

      <p className="mb-8 text-center text-sm text-gray-500">
        E-commerce barang secondhand bagi mahasiswa
      </p>

      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
            Masukan email address kamu
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            aria-label="Email"
            placeholder="Email"
            className="input-field"
          />
          {state?.fieldErrors?.email ? (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.email}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
            Masukan password kamu
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            aria-label="Password"
            placeholder="Password"
            className="input-field"
          />
          {state?.fieldErrors?.password ? (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.password}</p>
          ) : null}
        </div>

        {state?.error ? (
          <p className="text-center text-sm text-red-600">
            {state.error}
            {state.code === 'RATE_LIMITED' ? ' Coba lagi beberapa menit lagi.' : ''}
          </p>
        ) : null}

        <SubmitButton />
      </form>
    </div>
  );
}
