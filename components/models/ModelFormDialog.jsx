'use client';

import { useState } from 'react';

/**
 * @title ModelFormDialog
 * @notice Modal for registering or editing an AI model.
 * @dev The parent runs `createModelAction` / `updateModelAction` and passes the
 * @dev server error back in. Closing is blocked while the request is in flight.
 */

/**
 * @param {object} props Component properties.
 * @param {'create' | 'edit'} props.mode Which action the submit button runs.
 * @param {import('@/types').AiModel | null} [props.model] Row being edited.
 * @param {boolean} props.pending True while the server action is running.
 * @param {string | null} [props.serverError] Error returned by the action.
 * @param {() => void} props.onClose Closes the dialog.
 * @param {(input: object) => void} props.onSave Validated payload.
 * @returns {JSX.Element} Modal form.
 */
export default function ModelFormDialog({ mode, model, pending, serverError, onClose, onSave }) {
  const [error, setError] = useState(null);
  const editing = mode === 'edit';

  function onSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // A disabled input is omitted from FormData, so an edit reads the id from
    // the row. The PATCH body leaves `modelId` out: the backend treats it as
    // optional on update, and resending it is not required to rename or reprice.
    const modelId = String((editing ? model?.modelId : data.get('modelId')) || '').trim();
    const name = String(data.get('name') || '').trim();
    const inputPrice = Number(data.get('inputPrice'));
    const outputPrice = Number(data.get('outputPrice'));
    const cacheRaw = String(data.get('cacheReadPrice') || '').trim();
    const cacheReadPrice = cacheRaw === '' ? undefined : Number(cacheRaw);

    if ((!editing && !modelId) || !name) {
      setError('Model id dan nama wajib diisi.');
      return;
    }
    if (!isPrice(inputPrice) || !isPrice(outputPrice) || (cacheReadPrice !== undefined && !isPrice(cacheReadPrice))) {
      setError('Harga harus berupa angka nol atau lebih.');
      return;
    }

    setError(null);
    onSave({
      ...(!editing && { modelId }),
      name,
      inputPrice,
      outputPrice,
      // Empty cache is omitted. The backend rejects `null` (`toNumber` does
      // not allow null) and treats a missing key as "leave the column alone".
      ...(cacheReadPrice !== undefined && { cacheReadPrice }),
      isActive: model?.isActive ?? true,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="model-form-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-6"
      >
        <h2 id="model-form-title" className="text-lg font-bold text-gray-900">
          {editing ? 'Edit model' : 'Tambah model'}
        </h2>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <Field label="Model id" name="modelId" defaultValue={model?.modelId || ''} disabled={editing} />
          <Field label="Nama" name="name" defaultValue={model?.name || ''} />
          <Field label="Harga input (USD / 1M)" name="inputPrice" type="number" defaultValue={model?.inputPrice ?? ''} />
          <Field label="Harga output (USD / 1M)" name="outputPrice" type="number" defaultValue={model?.outputPrice ?? ''} />
          <Field
            label="Cache read (opsional)"
            name="cacheReadPrice"
            type="number"
            defaultValue={model?.cacheReadPrice ?? ''}
            required={false}
          />
          {error || serverError ? <p className="text-sm text-red-600">{error || serverError}</p> : null}
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={pending}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-surface-alt disabled:opacity-60"
            >
              Batal
            </button>
            <button type="submit" disabled={pending} className="btn-brand rounded-xl px-4 py-2 text-sm font-semibold">
              {pending ? 'Menyimpan…' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * @notice Tests a non-negative finite price.
 * @param {number} value Parsed number.
 * @returns {boolean} True when the value can be stored as a price.
 */
function isPrice(value) {
  return Number.isFinite(value) && value >= 0;
}

/**
 * @param {object} props Field properties.
 * @param {string} props.label Visible label.
 * @param {string} props.name Input name.
 * @param {string} [props.type='text'] Input type.
 * @param {string | number} props.defaultValue Initial value.
 * @param {boolean} [props.disabled=false] Locks the model id while editing.
 * @param {boolean} [props.required=true] HTML required flag.
 * @returns {JSX.Element} Labelled input.
 */
function Field({ label, name, type = 'text', defaultValue, disabled = false, required = true }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        disabled={disabled}
        min={type === 'number' ? '0' : undefined}
        step={type === 'number' ? 'any' : undefined}
        className="input-field mt-1 disabled:bg-surface-alt"
      />
    </label>
  );
}
