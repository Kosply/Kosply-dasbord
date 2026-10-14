import { NextResponse } from 'next/server';

import { listModels } from '@/lib/resources/models';
import { toErrorInfo } from '@/lib/api/client';

/**
 * @title Models BFF route handler
 * @notice `GET /api/models` — the browser-side data source for the live model
 * @notice search on `/ai-model` (used by `components/models/ModelsTable.jsx`).
 * @dev Why a proxy instead of calling Express from the browser directly:
 * @dev  1. the session JWT lives in an httpOnly cookie, so browser JavaScript
 * @dev     cannot attach it — the route handler reads it server-side;
 * @dev  2. server-to-server calls never hit CORS;
 * @dev  3. the search filter lives here because `GET /api/models` on Express has
 * @dev     no search parameter (it returns the active registry, ≤200 rows).
 */

/**
 * @notice Returns the active model list, optionally filtered by a search term.
 * @param {import('next/server').NextRequest} request Query `?search=` (matched
 * against `modelId` and `name`, case-insensitive).
 * @returns {Promise<import('next/server').NextResponse>} `{ status, items }` or a serialized `ApiError`.
 */
export async function GET(request) {
  const search = (request.nextUrl.searchParams.get('search') || '').trim().toLowerCase();

  try {
    const models = await listModels();
    const items = search
      ? models.filter(
          (model) =>
            model.modelId.toLowerCase().includes(search) ||
            model.name.toLowerCase().includes(search)
        )
      : models;
    return NextResponse.json({ status: 'ok', items });
  } catch (error) {
    const info = toErrorInfo(error);
    return NextResponse.json({ status: 'error', ...info }, { status: info.status || 500 });
  }
}
