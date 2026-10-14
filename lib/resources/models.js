import 'server-only';

import { apiFetch } from '@/lib/api/client';
import { getSessionToken } from '@/lib/auth/session';

/**
 * @title AI model registry resource
 * @notice Data access for `/api/models` on the Express backend.
 * @dev `GET /api/models` is public and returns only *active* models — the
 * @dev Flutter selector contract. Writes require role ADMIN/SUPER_ADMIN, so the
 * @dev session token is forwarded automatically.
 */

/**
 * @notice Lists active models from `GET /api/models`.
 * @returns {Promise<import('@/types').AiModel[]>} Active models, oldest first.
 * @throws {import('./api').ApiError} When the backend is unreachable or errors.
 */
export async function listModels() {
  const token = await getSessionToken();
  const data = await apiFetch('/api/models', { token });
  return data.items ?? [];
}

/**
 * @notice Registers a model via `POST /api/models` (ADMIN).
 * @param {object} input Body `{ modelId, name, inputPrice, outputPrice, cacheReadPrice?, isActive? }`.
 * @returns {Promise<import('@/types').AiModel>} The created model.
 */
export async function createModel(input) {
  const token = await getSessionToken();
  const data = await apiFetch('/api/models', { method: 'POST', body: input, token });
  return data.item;
}

/**
 * @notice Updates a model via `PATCH /api/models/:id` (ADMIN).
 * @param {string} id Registry row id.
 * @param {object} input Partial body — pricing, name or `isActive`.
 * @returns {Promise<import('@/types').AiModel>} The updated model.
 */
export async function updateModel(id, input) {
  const token = await getSessionToken();
  const data = await apiFetch(`/api/models/${id}`, { method: 'PATCH', body: input, token });
  return data.item;
}

/**
 * @notice Deletes a model via `DELETE /api/models/:id` (ADMIN).
 * @dev The backend refuses with `MODEL_IN_USE` (409) when chat history still
 * @dev references the model — callers should surface that message verbatim.
 * @param {string} id Registry row id.
 * @returns {Promise<void>} Resolves when the backend confirms the delete.
 */
export async function deleteModel(id) {
  const token = await getSessionToken();
  await apiFetch(`/api/models/${id}`, { method: 'DELETE', token });
}
