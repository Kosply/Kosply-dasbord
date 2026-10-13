import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import ErrorState from '@/components/states/ErrorState';
import ModelsTable from '@/components/models/ModelsTable';
import { listModels } from '@/lib/resources/models';
import { ROUTES } from '@/lib/routes';

export const metadata = {
  title: ROUTES.aiModel.title,
};

/**
 * @notice Render strategy: SSR on every request.
 * @dev The registry changes through admin actions and the page is session-aware,
 * @dev so each request re-reads `GET /api/models` instead of serving a cache.
 */
export const dynamic = 'force-dynamic';

/**
 * @title AI Models page
 * @notice Admin registry of the models exposed to the AI selector.
 * @dev Data flow: this Server Component → `lib/models.js` → `GET /api/models`
 * @dev (Express, active models only) → `initialModels` prop → the interactive
 * @dev `ModelsTable` island handles search and disable mutations.
 * @returns {Promise<JSX.Element>} Registry page.
 */
export default async function AiModelPage() {
  /** @type {import('@/types').AiModel[]} */
  let models = [];
  let loadError = null;

  try {
    models = await listModels();
  } catch (error) {
    loadError = error;
  }

  return (
    <Layout title={ROUTES.aiModel.title}>
      <Card className="p-6">
        {loadError ? (
          <ErrorState
            title="Gagal memuat daftar model"
            error={loadError}
            description={`${loadError.message} — pastikan backend Express berjalan di API_URL.`}
          />
        ) : (
          <ModelsTable initialModels={models} />
        )}
      </Card>
    </Layout>
  );
}
