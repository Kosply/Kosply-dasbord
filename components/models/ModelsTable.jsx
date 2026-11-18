'use client';

import { useEffect, useMemo, useState } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, Plus } from 'lucide-react';

import Table from '@/components/ui/Table';
import { Dropdown } from '@/components/ui/Dropdown';
import ActionButton from '@/components/ui/ActionButton';
import StateContainer from '@/components/states/StateContainer';
import ModelFormDialog from '@/components/models/ModelFormDialog';
import { createModelAction, updateModelAction } from '@/app/_actions/models';
import { PAGE_SIZE } from '@/lib/utils/filters';
import { formatUsd } from '@/lib/utils/format';

/**
 * @title ModelsTable (React Query island)
 * @notice Client-side search, sort, paging and create/edit for the AI model registry.
 * @dev Data flow: this Client Component → `GET /api/models?search=` (Next route
 * @dev handler, which forwards to Express with the session cookie) → JSON rows.
 * @dev Mutations flow: `useMutation` → Server Action → Express → `invalidateQueries`.
 * @dev Sort and paging stay on the client because the list endpoint has no
 * @dev sort or page query. The parent Server Component provides `initialData`.
 */

/** @notice Sort menu for the registry toolbar. */
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'name', label: 'Name' },
];

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
 * @notice Orders models for the toolbar sort control.
 * @param {import('@/types').AiModel[]} models Unsorted rows.
 * @param {string} sort `newest`, `oldest` or `name`.
 * @returns {import('@/types').AiModel[]} New sorted array.
 */
function sortModels(models, sort) {
  return [...models].sort((left, right) => {
    if (sort === 'name') return left.name.localeCompare(right.name, 'id');
    const leftTime = new Date(left.createdAt).getTime();
    const rightTime = new Date(right.createdAt).getTime();
    return sort === 'oldest' ? leftTime - rightTime : rightTime - leftTime;
  });
}

/**
 * @notice Renders the model registry table with live search and row actions.
 * @param {object} props Component properties.
 * @param {import('@/types').AiModel[]} props.initialModels Server-rendered snapshot used as `initialData`.
 * @returns {JSX.Element} Registry panel.
 */
export default function ModelsTable({ initialModels }) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState(null);
  const queryClient = useQueryClient();

  const modelsQuery = useQuery({
    queryKey: ['models', search],
    queryFn: () => fetchModels(search),
    initialData: search === '' ? initialModels : undefined,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    setPage(1);
  }, [search, sort]);

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

  const saveMutation = useMutation({
    mutationFn: async ({ id, input }) => {
      const result = id ? await updateModelAction(id, input) : await createModelAction(input);
      if (!result.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models'] });
      setDialog(null);
    },
  });

  const models = modelsQuery.data ?? [];
  const sorted = useMemo(() => sortModels(models, sort), [models, sort]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-lg font-bold text-gray-900">Model list</h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="search-pill min-w-0 py-2 sm:w-56">
            <Search size={16} className="shrink-0" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Type to Search Model"
              aria-label="Cari model"
              className="w-full min-w-0 bg-transparent outline-none"
            />
          </div>
          <Dropdown label="Sort" value={sort} options={SORT_OPTIONS} onChange={setSort} />
          <button
            type="button"
            aria-label="Tambah model"
            onClick={() => {
              saveMutation.reset();
              setDialog({ mode: 'create', model: null });
            }}
            className="flex h-9 w-9 items-center justify-center self-start rounded-full bg-brand text-white sm:self-auto"
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
              : 'Registry model masih kosong — tambahkan model lewat tombol +.',
          },
        }}
      >
        <Table
          columns={['Model id', 'Model name', 'Input', 'Output', 'Cache read', 'Action']}
          page={currentPage}
          totalPages={totalPages}
          onPage={setPage}
        >
          {visible.map((model) => (
            <tr key={model.id}>
              <td className="px-4 py-4 font-medium text-brand sm:px-6">{model.modelId}</td>
              <td className="px-4 py-4 text-gray-800 sm:px-6">{model.name}</td>
              <td className="px-4 py-4 text-gray-700 sm:px-6">{formatUsd(model.inputPrice)}</td>
              <td className="px-4 py-4 text-gray-700 sm:px-6">{formatUsd(model.outputPrice)}</td>
              <td className="px-4 py-4 text-gray-700 sm:px-6">{formatUsd(model.cacheReadPrice)}</td>
              <td className="px-4 py-4 sm:px-6">
                <div className="flex flex-wrap gap-2">
                  <ActionButton
                    icon="edit"
                    variant="purple"
                    label="Edit model"
                    onClick={() => {
                      saveMutation.reset();
                      setDialog({ mode: 'edit', model });
                    }}
                  />
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

      {dialog ? (
        <ModelFormDialog
          mode={dialog.mode}
          model={dialog.model}
          pending={saveMutation.isPending}
          serverError={saveMutation.isError ? saveMutation.error.message : null}
          onClose={() => {
            if (!saveMutation.isPending) setDialog(null);
          }}
          onSave={(input) => saveMutation.mutate({ id: dialog.model?.id, input })}
        />
      ) : null}
    </div>
  );
}
