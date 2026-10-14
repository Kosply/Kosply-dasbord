'use server';

import { revalidatePath } from 'next/cache';

import { createModel, deleteModel, updateModel } from '@/lib/resources/models';
import { ROUTES } from '@/lib/routes';

/**
 * @title Model Server Actions
 * @notice Mutations for the AI model registry (`/ai-model`).
 * @dev Each action forwards to the Express API with the session token, then
 * @dev `revalidatePath('/ai-model')` so the Server Component re-renders with
 * @dev fresh data. The React Query island additionally invalidates its own
 * @dev `['models']` cache after these calls resolve.
 */

/**
 * @notice Registers a model through `POST /api/models`.
 * @param {object} input Body `{ modelId, name, inputPrice, outputPrice, cacheReadPrice?, isActive? }`.
 * @returns {Promise<{ ok: true } | { ok: false, error: string }>} Action result for the form.
 */
export async function createModelAction(input) {
  try {
    await createModel(input);
  } catch (error) {
    return { ok: false, error: error?.message || 'Gagal menambah model.' };
  }
  revalidatePath('/ai-model');
  return { ok: true };
}

/**
 * @notice Updates a model through `PATCH /api/models/:id`.
 * @param {string} id Registry row id.
 * @param {object} input Partial model fields.
 * @returns {Promise<{ ok: true } | { ok: false, error: string }>} Action result.
 */
export async function updateModelAction(id, input) {
  try {
    await updateModel(id, input);
  } catch (error) {
    return { ok: false, error: error?.message || 'Gagal memperbarui model.' };
  }
  revalidatePath('/ai-model');
  return { ok: true };
}

/**
 * @notice Deletes a model through `DELETE /api/models/:id`.
 * @dev Returns the backend's `MODEL_IN_USE` message verbatim when history still
 * @dev references the model, so the operator knows to disable it instead.
 * @param {string} id Registry row id.
 * @returns {Promise<{ ok: true } | { ok: false, error: string }>} Action result.
 */
export async function deleteModelAction(id) {
  try {
    await deleteModel(id);
  } catch (error) {
    return { ok: false, error: error?.message || 'Gagal menghapus model.' };
  }
  revalidatePath('/ai-model');
  return { ok: true };
}
