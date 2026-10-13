import { Search, Plus, Pencil, Ban } from 'lucide-react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Table from '../components/Table';
import ActionButton from '../components/ActionButton';
import { aiModels } from '../data/dummyData';

export default function AiModel() {
  return (
    <Layout title="AI Models">
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Model list</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-gray-500">
              <Search size={16} />
              <input placeholder="Type to Search Model" className="w-48 bg-transparent outline-none" />
            </div>
            <div className="rounded-full border border-border px-4 py-2 text-sm text-gray-600">Sort : Newest</div>
            <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white">
              <Plus size={18} />
            </button>
          </div>
        </div>

        <Table columns={['Model id', 'Model name', 'Input', 'Output', 'Cache read', 'Action']}>
          {aiModels.map((model, index) => (
            <tr key={index}>
              <td className="px-6 py-4 font-medium text-brand underline-offset-2 hover:underline">{model.id}</td>
              <td className="px-6 py-4 text-gray-800">{model.name}</td>
              <td className="px-6 py-4 text-gray-700">{model.input}</td>
              <td className="px-6 py-4 text-gray-700">{model.output}</td>
              <td className="px-6 py-4 text-gray-700">{model.cache}</td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <ActionButton icon={Pencil} variant="purple" label="Edit model" />
                  <ActionButton icon={Ban} variant="red" label="Nonaktifkan model" />
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </Layout>
  );
}
