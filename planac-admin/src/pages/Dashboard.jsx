import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  FileText,
  TrendingUp,
  Users
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_URL = 'https://planac-backend-api.planacacabamentos.workers.dev';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/admin/dashboard`);
        setStats(response.data.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const cards = [
    {
      title: 'Produtos',
      value: stats?.resumo.produtos.total || 0,
      subtitle: `${stats?.resumo.produtos.publicados || 0} publicados`,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Orçamentos',
      value: stats?.resumo.orcamentos.total || 0,
      subtitle: `${stats?.resumo.orcamentos.novos || 0} novos`,
      icon: FileText,
      color: 'bg-green-500',
    },
    {
      title: 'Contatos',
      value: stats?.resumo.contatos.total || 0,
      subtitle: `${stats?.resumo.contatos.naoLidos || 0} não lidos`,
      icon: MessageSquare,
      color: 'bg-purple-500',
    },
    {
      title: 'Categorias',
      value: stats?.resumo.categorias.total || 0,
      subtitle: 'Ativas',
      icon: LayoutDashboard,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Visão geral do sistema</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{card.subtitle}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      {stats?.graficos?.orcamentosPorDia?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Orçamentos nos últimos 7 dias
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.graficos.orcamentosPorDia}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#0ea5e9"
                strokeWidth={2}
                name="Orçamentos"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Quotes */}
      {stats?.listas?.ultimosOrcamentos?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Últimos Orçamentos</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.listas.ultimosOrcamentos.slice(0, 5).map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{quote.nome}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{quote.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{quote.telefone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{quote.produto || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        quote.status === 'NOVO' ? 'bg-yellow-100 text-yellow-800' :
                        quote.status === 'EM_ATENDIMENTO' ? 'bg-blue-100 text-blue-800' :
                        quote.status === 'ATENDIDO' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {quote.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
