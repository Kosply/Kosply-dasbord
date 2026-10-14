'use client';

import { useState } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, Plus } from 'lucide-react';

import Table from '@/components/ui/Table';
import ActionButton from '@/components/ui/ActionButton';
import StateContainer from '@/components/states/StateContainer';
import { updateModelAction } from '@/app/_actions/models';
import { formatUsd } from '@/lib/utils/format';

/**
 * @title ModelsTable (React Query island)
 * @notice Client-side search + disable controls for the AI model registry.
 * @dev Data flow: this Client Component → `GET /api/models?search=` (Next route
 * @dev handler, which forwards to Express with the session cookie) → JSON rows.
 * @dev Mutations flow: `useMutation` → `updateModelAction` (Server Action) →
 * @dev `PATCH /api/models/:id` on Express → `invalidateQueries(['models'])` so
 * @dev both the client cache and the Server Component payload re-render.
 * @dev The parent Server Component provides `initialData`, so the first paint
 * @dev needs no browser round trip (no loading flash).
 */

/**
 * @notice Fetches the (optionally filtered) model list from the BFF route handler.
 * @param {string} search Search term; empty string returns the full list.
 * @returns {Promise<import('@/types').AiModel[]>} Matching models.
 * @throws {Error} When the route handler reports a backend failure.
 */
async function fetchModels(search) {
  const response = await fetch(`/api/models?search=${encodeURIComponent(search)}`);
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || 'Gagal memuat daftar model.');
  }
  return payload.items ?? [];
}

/**
 * @notice Renders the model registry table with live search and row actions.
 * @param {object} props Component properties.
 * @param {import('@/types').AiModel[]} props.initialModels Server-rendered snapshot used as `initialData`.
 * @returns {JSX.Element} Registry panel.
 */
export default function ModelsTable({ initialModels }) {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const modelsQuery = useQuery({
    queryKey: ['models', search],
    queryFn: () => fetchModels(search),
    /** @dev The unfiltered key is the one the server already hydrated. */
    initialData: search === '' ? initialModels : undefined,
    /** @dev Keeps the previous rows visible while a new search term loads. */
    placeholderData: keepPreviousData,
  });

  const disableMutation = useMutation({
    mutationFn: async (id) => {
      const result = await updateModelAction(id, { isActive: false });
      if (!result.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models'] });
    },
  });

  const models = modelsQuery.data ?? [];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Model list</h2>
        <div className="flex items-center gap-3">
          <div className="search-pill py-2">
            <Search size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Type to Search Model"
              className="w-48 bg-transparent outline-none"
            />
          </div>
          <div className="rounded-full border border-border px-4 py-2 text-sm text-gray-600">
            Sort : Newest
          </div>
          <button
            type="button"
            aria-label="Tambah model"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {disableMutation.isError ? (
        <p className="mb-3 text-sm text-red-600">{disableMutation.error.message}</p>
      ) : null}

      <StateContainer
        isLoading={modelsQuery.isPending}
        error={modelsQuery.error}
        isEmpty={models.length === 0}
        onRetry={() => modelsQuery.refetch()}
        stateProps={{
          loading: { message: 'Memuat daftar model...' },
          empty: {
            title: 'Tidak ada model',
            description: search
              ? `Tidak ada model yang cocok dengan "${search}".`
              : 'Registry model masih kosong — tambahkan model pertama lewat API.',
          },
        }}
      >
        <Table columns={['Model id', 'Model name', 'Input', 'Output', 'Cache read', 'Action']}>
          {models.map((model) => (
            <tr key={model.id}>
              <td className="px-6 py-4 font-medium text-brand underline-offset-2 hover:underline">
                {model.modelId}
              </td>
              <td className="px-6 py-4 text-gray-800">{model.name}</td>
              <td className="px-6 py-4 text-gray-700">{formatUsd(model.inputPrice)}</td>
              <td className="px-6 py-4 text-gray-700">{formatUsd(model.outputPrice)}</td>
              <td className="px-6 py-4 text-gray-700">{formatUsd(model.cacheReadPrice)}</td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <ActionButton icon="edit" variant="purple" label="Edit model" />
                  <ActionButton
                    icon="ban"
                    variant="red"
                    label="Nonaktifkan model"
                    onClick={() => disableMutation.mutate(model.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </StateContainer>
    </div>
  );
}
